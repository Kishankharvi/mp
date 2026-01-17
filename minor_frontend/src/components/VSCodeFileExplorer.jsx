"use client"

import { useState } from "react"
import { toast } from "../utils/toast"

export default function VSCodeFileExplorer({ files, onFileSelect, onCreateFile, selectedFile }) {
  const [newFileName, setNewFileName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState(new Set())

  // Define allowed extensions based on what the execution server can handle
  const allowedExtensions = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".py",
    ".java",
    ".cpp",
    ".c",
    ".rb",
    ".go",
    ".rs",
    ".php",
    ".swift",
    ".kt",
    ".html",
    ".css",
    ".json",
  ]

  const handleCreateFile = () => {
    if (!newFileName.trim()) {
      toast.warning("Please enter a file name")
      return
    }

    const hasValidExtension = allowedExtensions.some((ext) => newFileName.toLowerCase().endsWith(ext))

    if (!hasValidExtension) {
      toast.warning(`Allowed extensions: ${allowedExtensions.join(", ")}`)
      return
    }

    onCreateFile(newFileName)
    setNewFileName("")
    setIsCreating(false)
    // Removed duplicate toast here since RoomContext/RoomPage handle it via socket
  }

  const toggleFolder = (folderName) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName)
    } else {
      newExpanded.add(folderName)
    }
    setExpandedFolders(newExpanded)
  }

  const renderFileTree = (fileList, depth = 0) => {
    return fileList?.map((file) => {
      const isFolder = file.children && file.children.length > 0
      const isExpanded = expandedFolders.has(file.id)
      const isSelected = selectedFile?.path === file.path

      return (
        <div key={file.id || file.path}>
          <div
            onClick={() => {
              if (isFolder) {
                toggleFolder(file.id)
              } else {
                onFileSelect(file)
              }
            }}
            style={{
              paddingLeft: `${depth * 12 + 12}px`,
              padding: "4px 8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              background: isSelected ? "#37373d" : "transparent",
              color: isSelected ? "#ffffff" : "#cccccc",
              fontSize: "0.8125rem",
              userSelect: "none",
              transition: "background 0.1s",
              borderLeft: isSelected ? "2px solid #007acc" : "2px solid transparent",
            }}
            onMouseOver={(e) => {
              if (!isSelected) e.currentTarget.style.background = "#2a2d2e"
            }}
            onMouseOut={(e) => {
              if (!isSelected) e.currentTarget.style.background = "transparent"
            }}
          >
            {isFolder && (
              <span style={{ fontSize: "0.7rem", width: "12px", textAlign: "center", opacity: 0.7 }}>
                {isExpanded ? "▼" : "▶"}
              </span>
            )}
            {!isFolder && <span style={{ fontSize: "0.75rem", width: "16px", opacity: 0.8 }}>📄</span>}
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</span>
          </div>
          {isFolder && isExpanded && renderFileTree(file.children, depth + 1)}
        </div>
      )
    })
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        background: "#252526",
      }}
    >
      {/* Create File Section */}
      <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid #3e3e42" }}>
        {isCreating ? (
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <input
              autoFocus
              type="text"
              placeholder="filename.ext"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFile()
                if (e.key === "Escape") setIsCreating(false)
              }}
              style={{
                flex: 1,
                padding: "0.25rem 0.5rem",
                fontSize: "0.75rem",
                background: "#3c3c3c",
                color: "#cccccc",
                border: "1px solid #007acc",
                borderRadius: "2px",
                outline: "none",
              }}
            />
            <button
              onClick={handleCreateFile}
              style={{
                padding: "0.25rem 0.5rem",
                fontSize: "0.75rem",
                background: "#007acc",
                color: "white",
                border: "none",
                borderRadius: "2px",
                cursor: "pointer",
              }}
            >
              ✓
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            style={{
              width: "100%",
              padding: "0.3rem",
              fontSize: "0.75rem",
              background: "#323233",
              color: "#cccccc",
              border: "1px solid #454545",
              borderRadius: "2px",
              cursor: "pointer",
              transition: "background 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.3rem",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#3c3c3c"
              e.currentTarget.style.borderColor = "#555"
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#323233"
              e.currentTarget.style.borderColor = "#454545"
            }}
          >
            <span style={{ fontSize: "1rem" }}>+</span> New File
          </button>
        )}
      </div>

      {/* File Tree */}
      <div style={{ flex: 1, overflow: "auto", padding: "0.5rem 0" }}>
        {files && files.length > 0 ? (
          renderFileTree(files)
        ) : (
          <div style={{ padding: "1rem", fontSize: "0.75rem", color: "#858585", textAlign: "center" }}>
            No files yet
          </div>
        )}
      </div>
    </div>
  )
}
