"use client"

import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { toast } from "../utils/toast"

export default function Terminal({ language = "javascript", code = "" }) {
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState("")
  const [input, setInput] = useState("")
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const outputRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output, error])

  const runCode = async (codeToRun = code) => {
    if (!codeToRun.trim()) {
      toast.warning("No code to execute")
      return
    }

    setIsRunning(true)
    setError("")
    setOutput("Running code...\n")

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}/api/execute`, {
        language,
        code: codeToRun,
        input,
      })

      const result = response.data.output || "Code executed successfully"
      setOutput(result)
      toast.success("Code executed!")
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Failed to execute code"
      setError(errorMessage)
      setOutput("")
      toast.error("Execution failed")
    } finally {
      setIsRunning(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      runCode()
    } else if (e.key === "ArrowUp" && history.length > 0) {
      e.preventDefault()
      const newIndex = historyIndex + 1
      if (newIndex < history.length) {
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      }
    } else if (e.key === "ArrowDown" && history.length > 0) {
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
      setHistory([input, ...history])
      setHistoryIndex(-1)
    }
    runCode()
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#0f172a",
        borderRadius: "0.5rem",
        overflow: "hidden",
        border: "1px solid #334155",
      }}
    >
      {/* Terminal Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem",
          background: "#1e293b",
          borderBottom: "1px solid #334155",
        }}
      >
        <h3
          style={{
            fontWeight: "bold",
            margin: 0,
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "0.75rem",
              height: "0.75rem",
              borderRadius: "50%",
              background: "#22c55e",
            }}
          ></span>
          Terminal
        </h3>
        <button
          onClick={handleRunClick}
          disabled={isRunning}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            fontWeight: "600",
            background: isRunning ? "#64748b" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            cursor: isRunning ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            opacity: isRunning ? 0.6 : 1,
          }}
          onMouseOver={(e) => !isRunning && (e.target.style.background = "#1d4ed8")}
          onMouseOut={(e) => !isRunning && (e.target.style.background = "#2563eb")}
        >
          {isRunning ? "Running..." : "▶ Run Code"}
        </button>
      </div>

      {/* Output Area */}
      <div
        ref={outputRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          fontSize: "0.875rem",
          fontFamily: "monospace",
          color: "#e2e8f0",
          background: "#0f172a",
          borderBottom: "1px solid #334155",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {output && <div style={{ color: "#cbd5e1", marginBottom: "0.5rem" }}>{output}</div>}
        {error && <div style={{ color: "#fca5a5" }}>{error}</div>}
        {!output && !error && <div style={{ color: "#64748b", fontSize: "0.75rem" }}>Output will appear here...</div>}
      </div>

      {/* Input Section */}
      <div style={{ padding: "0.75rem", background: "#1e293b", borderTop: "1px solid #334155" }}>
        <label
          style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.75rem", color: "#94a3b8", fontWeight: "500" }}
        >
          Input (Optional) - Press Ctrl+Enter to run
        </label>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter input for your code here..."
          style={{
            width: "100%",
            padding: "0.5rem",
            fontSize: "0.875rem",
            fontFamily: "monospace",
            background: "#0f172a",
            color: "#e2e8f0",
            border: "1px solid #334155",
            borderRadius: "0.375rem",
            resize: "none",
            height: "60px",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
          onBlur={(e) => (e.target.style.borderColor = "#334155")}
        />
        <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>
          {language} • {input.length} chars
        </div>
      </div>
    </div>
  )
}
