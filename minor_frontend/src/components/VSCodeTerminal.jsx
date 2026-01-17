"use client"

import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { toast } from "../utils/toast"

export default function VSCodeTerminal({ language = "javascript", code = "", onClose }) {
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState("")
  const [input, setInput] = useState("")
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const outputRef = useRef(null)
  const inputRef = useRef(null)
  const [displayLines, setDisplayLines] = useState(["$ Welcome to Terminal - Press Ctrl+Enter or click Run to execute"])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [displayLines])

  const runCode = async (codeToRun = code, stdin = input) => {
    if (!codeToRun.trim()) {
      addLine("$ error: No code to execute")
      return
    }

    setIsRunning(true)
    setError("")
    addLine(`$ Running ${language} code...`)
    if (stdin) {
      addLine(`$ Input provided: ${stdin}`)
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}/api/execute`, {
        language,
        code: codeToRun,
        input: stdin || undefined,
      })

      const result = response.data.output || "Code executed successfully"
      addLine(result)
      toast.success("Code executed!")
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Failed to execute code"
      addLine(`$ error: ${errorMessage}`)
      toast.error("Execution failed")
    } finally {
      setIsRunning(false)
    }
  }

  const addLine = (line) => {
    setDisplayLines((prev) => [...prev, line])
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault()
      handleRunClick()
    } else if (e.key === "ArrowUp" && history.length > 0) {
      e.preventDefault()
      const newIndex = historyIndex + 1
      if (newIndex < history.length) {
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    }
  }

  const handleRunClick = () => {
    if (input.trim()) {
      setHistory((prev) => [input, ...prev.filter((h) => h !== input)].slice(0, 50))
    }
    setHistoryIndex(-1)
    runCode(code, input)
  }

  const clearTerminal = () => {
    setDisplayLines(["$ Terminal cleared"])
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#1e1e1e",
        borderRadius: "0",
        overflow: "hidden",
        fontFamily: "'Consolas', 'Monaco', monospace",
      }}
    >
      {/* Terminal Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 1rem",
          background: "#323233",
          borderBottom: "1px solid #3e3e42",
          fontSize: "0.875rem",
          color: "#cccccc",
        }}
      >
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#4ec9b0",
              }}
            ></span>
            <span style={{ fontWeight: "500" }}>TERMINAL</span>
          </div>
          <button
            onClick={handleRunClick}
            disabled={isRunning}
            style={{
              background: isRunning ? "#444" : "#0e639c",
              color: "white",
              border: "none",
              padding: "0.2rem 0.8rem",
              borderRadius: "2px",
              fontSize: "0.75rem",
              cursor: isRunning ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            {isRunning ? "Running..." : "▶ Run"}
          </button>
          <button
            onClick={clearTerminal}
            style={{
              background: "transparent",
              color: "#858585",
              border: "1px solid #3e3e42",
              padding: "0.2rem 0.5rem",
              borderRadius: "2px",
              fontSize: "0.75rem",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#858585",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          ×
        </button>
      </div>

      {/* Output Area */}
      <div
        ref={outputRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0.75rem 1rem",
          fontSize: "0.85rem",
          fontFamily: "inherit",
          color: "#d4d4d4",
          background: "#1e1e1e",
          borderBottom: "1px solid #3e3e42",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          lineHeight: "1.5",
        }}
      >
        {displayLines.map((line, idx) => (
          <div
            key={idx}
            style={{
              color: line.startsWith("$") ? "#4ec9b0" : line.includes("error") ? "#f48771" : "#d4d4d4",
              marginBottom: "0.1rem",
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div style={{ padding: "0.75rem 1rem", background: "#323233", borderTop: "1px solid #3e3e42" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
            fontSize: "0.75rem",
            color: "#858585",
          }}
        >
          <span>{language.toUpperCase()} Input • Ctrl+Enter to Run • ↑↓ History</span>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter program input here (e.g. for Scanner/input())..."
          style={{
            width: "100%",
            padding: "0.5rem 0.75rem",
            fontSize: "0.85rem",
            fontFamily: "inherit",
            background: "#1e1e1e",
            color: "#d4d4d4",
            border: "1px solid #3e3e42",
            borderRadius: "0",
            outline: "none",
            transition: "border-color 0.2s",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#007acc")}
          onBlur={(e) => (e.target.style.borderColor = "#3e3e42")}
          disabled={isRunning}
        />
      </div>
    </div>
  )
}
