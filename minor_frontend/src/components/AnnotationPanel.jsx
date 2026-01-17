"use client"

import { useState } from "react"
import { toast } from "../utils/toast"

export default function AnnotationPanel({ socket, roomId, onAnnotationAdd }) {
  const [annotations, setAnnotations] = useState([])
  const [newAnnotation, setNewAnnotation] = useState("")
  const [selectedLineNumber, setSelectedLineNumber] = useState("")
  const [annotationType, setAnnotationType] = useState("note")

  const handleAddAnnotation = () => {
    if (!selectedLineNumber || !newAnnotation.trim()) {
      toast.warning("Please select a line and enter annotation text")
      return
    }

    const annotation = {
      id: Date.now().toString(),
      lineNumber: Number.parseInt(selectedLineNumber),
      text: newAnnotation,
      type: annotationType,
      timestamp: new Date().toISOString(),
    }

    setAnnotations([...annotations, annotation])

    // Emit to other users
    if (socket && roomId) {
      socket.emit("annotation-added", { roomId, annotation })
    }

    setNewAnnotation("")
    setSelectedLineNumber("")
    toast.success("Annotation added!")
  }

  return (
    <div
      style={{
        padding: "1rem",
        background: "#1e293b",
        borderRadius: "0.5rem",
        border: "1px solid #334155",
        color: "white",
      }}
    >
      <h4 style={{ margin: "0 0 1rem 0", fontSize: "0.875rem", fontWeight: "bold", color: "#f1f5f9" }}>
        Code Annotations
      </h4>

      {/* Add Annotation Form */}
      <div style={{ marginBottom: "1rem", padding: "1rem", background: "#0f172a", borderRadius: "0.375rem" }}>
        <div style={{ marginBottom: "0.75rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.75rem", color: "#cbd5e1" }}>
            Type
          </label>
          <select
            value={annotationType}
            onChange={(e) => setAnnotationType(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              fontSize: "0.875rem",
              background: "#1e293b",
              color: "white",
              border: "1px solid #334155",
              borderRadius: "0.25rem",
              outline: "none",
            }}
          >
            <option value="note">Note</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="improvement">Improvement</option>
          </select>
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.75rem", color: "#cbd5e1" }}>
            Line Number
          </label>
          <input
            type="number"
            value={selectedLineNumber}
            onChange={(e) => setSelectedLineNumber(e.target.value)}
            placeholder="e.g., 10"
            style={{
              width: "100%",
              padding: "0.5rem",
              fontSize: "0.875rem",
              background: "#0f172a",
              color: "white",
              border: "1px solid #334155",
              borderRadius: "0.25rem",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.75rem", color: "#cbd5e1" }}>
            Message
          </label>
          <textarea
            value={newAnnotation}
            onChange={(e) => setNewAnnotation(e.target.value)}
            placeholder="Add your annotation..."
            style={{
              width: "100%",
              padding: "0.5rem",
              fontSize: "0.875rem",
              background: "#0f172a",
              color: "white",
              border: "1px solid #334155",
              borderRadius: "0.25rem",
              resize: "vertical",
              minHeight: "60px",
              outline: "none",
            }}
          />
        </div>

        <button
          onClick={handleAddAnnotation}
          style={{
            width: "100%",
            padding: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: "600",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#1d4ed8")}
          onMouseOut={(e) => (e.target.style.background = "#2563eb")}
        >
          Add Annotation
        </button>
      </div>

      {/* Annotations List */}
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {annotations.length > 0 ? (
          annotations.map((ann) => (
            <div
              key={ann.id}
              style={{
                padding: "0.75rem",
                marginBottom: "0.5rem",
                background: getAnnotationColor(ann.type),
                borderLeft: `4px solid ${getAnnotationBorderColor(ann.type)}`,
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>Line {ann.lineNumber}</div>
              <div style={{ color: "#e2e8f0" }}>{ann.text}</div>
            </div>
          ))
        ) : (
          <div style={{ color: "#64748b", fontSize: "0.75rem" }}>No annotations yet</div>
        )}
      </div>
    </div>
  )
}

function getAnnotationColor(type) {
  const colors = {
    note: "#1e40af",
    warning: "#92400e",
    error: "#7c2d12",
    improvement: "#064e3b",
  }
  return colors[type] || colors.note
}

function getAnnotationBorderColor(type) {
  const colors = {
    note: "#3b82f6",
    warning: "#f59e0b",
    error: "#ef4444",
    improvement: "#10b981",
  }
  return colors[type] || colors.note
}
