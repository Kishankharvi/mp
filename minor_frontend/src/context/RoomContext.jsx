"use client"

import { createContext, useState, useEffect, useCallback, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getRoom } from "../services/api"
import { getSocket, connectSocket } from "../services/socket"
import { UserContext } from "./UserContext"
import { toast } from "../utils/toast"

export const RoomContext = createContext()

const buildFileTree = (files) => {
  const root = { id: "/", name: "files", children: [] }
  const map = { "": root }

  files.forEach((file) => {
    const pathParts = file.path.split("/").filter(Boolean)
    let currentPath = ""
    pathParts.forEach((part, index) => {
      const parentPath = currentPath
      currentPath = currentPath ? `${currentPath}/${part}` : part

      if (!map[currentPath]) {
        const isLeaf = index === pathParts.length - 1
        const newNode = {
          id: currentPath,
          name: part,
        }
        if (isLeaf) {
          newNode.path = file.path
          newNode.content = file.content
        } else {
          newNode.children = []
        }
        map[currentPath] = newNode
        if (map[parentPath]) {
          map[parentPath].children = map[parentPath].children || []
          map[parentPath].children.push(newNode)
        }
      }
    })
  })

  return root.children || []
}

export const RoomProvider = ({ children }) => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [room, setRoom] = useState(null)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [code, setCodeState] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [socket, setSocket] = useState(null)
  const [canEdit, setCanEdit] = useState(false)
  const [adviceList, setAdviceList] = useState([])
  const [annotations, setAnnotations] = useState([])
  const [editRequests, setEditRequests] = useState([])

  const selectFile = useCallback((file) => {
    if (file.path) {
      setSelectedFile(file)
      setCodeState(file.content || "")
    }
  }, [])

  useEffect(() => {
    const sock = getSocket() || connectSocket()
    setSocket(sock)
  }, [])

  useEffect(() => {
    if (!roomId || !user) {
      return
    }

    const fetchRoomData = async () => {
      try {
        setLoading(true)
        const roomData = await getRoom(roomId, user)

        if (roomData) {
          setRoom(roomData)
          const isMentor = roomData.createdBy === (user._id || user.id)
          setCanEdit(isMentor ? true : false)

          const fileTree = buildFileTree(roomData.files || [])
          setFiles(fileTree)
          if (roomData.files && roomData.files.length > 0) {
            setSelectedFile(roomData.files[0])
            setCodeState(roomData.files[0].content || "")
          }
        } else {
          toast.error("Room not found")
          navigate("/dashboard")
        }
      } catch (err) {
        setError(err.message || "Failed to fetch room data")
        toast.error("Failed to load room")
        navigate("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchRoomData()
  }, [roomId, user, navigate])

  useEffect(() => {
    if (!socket) return

    const handleCodeUpdate = ({ code: newCode, path }) => {
      setFiles((prev) => updateFileContent(prev, path, newCode))
      setSelectedFile((current) => {
        if (current?.path === path) {
          setCodeState(newCode)
        }
        return current
      })
    }

    const handleFileCreated = ({ file }) => {
      setFiles((prev) => {
        const exists = prev.some((f) => f.path === file.path)
        if (exists) return prev
        return [...prev, file]
      })
    }

    const handleToggleEdit = ({ userId: targetUserId, canEdit: newCanEdit }) => {
      const currentUserId = user?._id || user?.id
      const isMentor = room?.createdBy === currentUserId

      if (isMentor) return // Mentors always have edit access

      if (!targetUserId || targetUserId === currentUserId) {
        setCanEdit(newCanEdit)
        toast.info(newCanEdit ? "Edit access granted" : "Edit access revoked")
      }
    }

    const handleFocusFile = ({ file }) => {
      const isMentor = room?.createdBy === (user?._id || user?.id)
      if (!isMentor) {
        selectFile(file)
        toast.info(`Mentor is focusing on: ${file.name}`)
      }
    }

    const handleRequestEdit = ({ userId, username }) => {
      const isMentor = room?.createdBy === (user?._id || user?.id)
      if (isMentor) {
        setEditRequests((prev) => [...prev, { userId, username, id: Date.now() }])
        toast.info(`${username} is requesting edit access`)
      }
    }

    const handleMentorAdvice = ({ advice, from }) => {
      setAdviceList((prev) => [
        { id: Date.now(), text: advice, author: from, timestamp: new Date().toLocaleTimeString() },
        ...prev,
      ])
      toast.info(`New advice from ${from}`)
    }

    const handleAnnotation = (annotation) => {
      setAnnotations((prev) => [annotation, ...prev])
    }

    socket.on("code-update", handleCodeUpdate)
    socket.on("file-created", handleFileCreated)
    socket.on("toggle-edit", handleToggleEdit)
    socket.on("mentor-advice", handleMentorAdvice)
    socket.on("annotation", handleAnnotation)
    socket.on("focus-file", handleFocusFile)
    socket.on("request-edit", handleRequestEdit)

    return () => {
      socket.off("code-update", handleCodeUpdate)
      socket.off("file-created", handleFileCreated)
      socket.off("toggle-edit", handleToggleEdit)
      socket.off("mentor-advice", handleMentorAdvice)
      socket.off("annotation", handleAnnotation)
      socket.off("focus-file", handleFocusFile)
      socket.off("request-edit", handleRequestEdit)
    }
  }, [socket, room, user])

  const updateFileContent = (fileTree, path, newContent) => {
    return fileTree.map((file) => {
      if (file.path === path) {
        return { ...file, content: newContent }
      }
      if (file.children) {
        return { ...file, children: updateFileContent(file.children, path, newContent) }
      }
      return file
    })
  }

  const handleCodeChange = useCallback(
    (newCode) => {
      if (!canEdit) return

      setCodeState(newCode)
      if (selectedFile) {
        setFiles((prev) => updateFileContent(prev, selectedFile.path, newCode))
      }

      if (socket && selectedFile && room) {
        socket.emit("code-change", {
          roomId: room.roomId,
          code: newCode,
          path: selectedFile.path,
        })
      }
    },
    [socket, selectedFile, room, canEdit],
  )

  const createFile = useCallback(
    async (fileName) => {
      if (!room || !socket) {
        toast.error("Not connected to room")
        return
      }

      const newFile = {
        id: Date.now().toString(),
        name: fileName,
        path: fileName,
        content: "",
      }

      socket.emit("file-created", { roomId: room.roomId, file: newFile })

      setFiles((prev) => [...prev, newFile])
      selectFile(newFile)
      toast.success(`File ${fileName} created`)
    },
    [room, socket, selectFile],
  )

  const toggleEditAccess = useCallback(
    (val) => {
      if (socket && room) {
        socket.emit("toggle-edit", { roomId: room.roomId, canEdit: val })
      }
    },
    [socket, room],
  )

  const sendAdvice = useCallback(
    (advice) => {
      if (socket && room) {
        socket.emit("mentor-advice", { roomId: room.roomId, advice })
      }
    },
    [socket, room],
  )

  const sendAnnotation = useCallback(
    (text) => {
      if (socket && room && user) {
        const annotation = {
          id: Date.now(),
          text,
          author: user.username,
          timestamp: new Date().toLocaleTimeString(),
          file: selectedFile?.name || "general",
        }
        socket.emit("annotation", { roomId: room.roomId, annotation })
        setAnnotations((prev) => [annotation, ...prev])
      }
    },
    [socket, room, user, selectedFile],
  )

  const focusFile = useCallback(
    (file) => {
      if (socket && room) {
        socket.emit("focus-file", { roomId: room.roomId, file })
      }
    },
    [socket, room],
  )

  const requestEditAccess = useCallback(() => {
    if (socket && room && user) {
      socket.emit("request-edit", { roomId: room.roomId, userId: user._id || user.id, username: user.username })
      toast.info("Access request sent to mentor")
    }
  }, [socket, room, user])

  const approveRequest = useCallback(
    (userId) => {
      if (socket && room) {
        socket.emit("toggle-edit", { roomId: room.roomId, userId, canEdit: true })
        setEditRequests((prev) => prev.filter((r) => r.userId !== userId))
      }
    },
    [socket, room],
  )

  const value = {
    room,
    files,
    loading,
    error,
    code,
    setCode: handleCodeChange,
    selectFile,
    selectedFile,
    socket,
    createFile,
    canEdit,
    toggleEditAccess,
    adviceList,
    sendAdvice,
    annotations,
    sendAnnotation,
    focusFile,
    requestEditAccess,
    editRequests,
    approveRequest,
  }

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>
}
