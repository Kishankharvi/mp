"use client"

import { useState } from "react"
import { toast } from "../utils/toast"

export default function FileManager({ files, onFileCreate, onFileSelect, selectedFile }) {
  const [isCreating, setIsCreating] = useState(false)
  const [fileName, setFileName] = useState("")

  const handleCreateFile = () => {
    if (!fileName.trim()) {
      toast.warning("Please enter a file name")
      return
    }

    if (!/\.(js|jsx|ts|tsx|py|java|cpp|c|html|css|json)$/.test(fileName)) {
      toast.error("File must have a valid extension (.js, .py, .java, etc.)")
      return
    }

    onFileCreate(fileName)
    setFileName("")
    setIsCreating(false)
    toast.success(`File "${fileName}" created!`)
  }

  return (
    <div style={{ padding: "0.75rem", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <h3 style={{ margin: 0, fontSize: "0.875rem", fontWeight: "bold", color: "#e2e8f0" }}>Files</h3>
        <button
          onClick={() => setIsCreating(!isCreating)}
          style={{
            padding: "0.25rem 0.5rem",
            fontSize: "0.75rem",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "0.25rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#1d4ed8")}
          onMouseOut={(e) => (e.target.style.background = "#2563eb")}
        >
          + New File
        </button>
      </div>

      {isCreating && (
        <div style={{ marginBottom: "0.75rem", display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            placeholder="index.js"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCreateFile()}
            style={{
              flex: 1,
              padding: "0.5rem",
              fontSize: "0.875rem",
              background: "#0f172a",
              color: "white",
              border: "1px solid #334155",
              borderRadius: "0.25rem",
              outline: "none",
            }}
            autoFocus
          />
          <button
            onClick={handleCreateFile}
            style={{
              padding: "0.5rem 0.75rem",
              fontSize: "0.75rem",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
            }}
          >
            Create
          </button>
          <button
            onClick={() => setIsCreating(false)}
            style={{
              padding: "0.5rem 0.75rem",
              fontSize: "0.75rem",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      <div style={{ fontSize: "0.875rem", color: "#cbd5e1" }}>
        {files && files.length > 0 ? (
          <div>
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => onFileSelect(file)}
                style={{
                  padding: "0.5rem",
                  cursor: "pointer",
                  borderRadius: "0.25rem",
                  background: selectedFile?.id === file.id ? "#334155" : "transparent",
                  transition: "all 0.15s",
                  marginBottom: "0.25rem",
                }}
                onMouseOver={(e) => !selectedFile?.id === file.id && (e.currentTarget.style.background = "#2c3e50")}
                onMouseOut={(e) => selectedFile?.id === file.id && (e.currentTarget.style.background = "transparent")}
              >
                📄 {file.name}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "#64748b", fontSize: "0.75rem" }}>No files yet. Create one!</div>
        )}
      </div>
    </div>
  )
}
