"use client"

import { useState, useContext } from "react"
import { RoomContext } from "../context/RoomContext"
import { UserContext } from "../context/UserContext"

export default function MentorPanel() {
  const {
    room,
    canEdit,
    toggleEditAccess,
    adviceList,
    sendAdvice,
    annotations,
    sendAnnotation,
    selectedFile,
    focusFile,
    requestEditAccess,
    editRequests,
    approveRequest,
  } = useContext(RoomContext)
  const { user } = useContext(UserContext)

  const [newAdvice, setNewAdvice] = useState("")
  const [newAnnotation, setNewAnnotation] = useState("")
  const [activeTab, setActiveTab] = useState("advice")
  const [showAdviceForm, setShowAdviceForm] = useState(false)
  const [showAnnotationForm, setShowAnnotationForm] = useState(false)

  const isMentor = room?.createdBy === (user?._id || user?.id)

  const handleSendAdvice = () => {
    if (!newAdvice.trim()) return
    sendAdvice(newAdvice)
    setNewAdvice("")
    setShowAdviceForm(false)
  }

  const handleSendAnnotation = () => {
    if (!newAnnotation.trim()) return
    sendAnnotation(newAnnotation)
    setNewAnnotation("")
    setShowAnnotationForm(false)
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        borderTop: "1px solid #3e3e42",
      }}
    >
      {/* Mentor Toolbar */}
      <div style={{ padding: "0.75rem", borderBottom: "1px solid #3e3e42", background: "#2d2d2d" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#858585" }}>MANAGEMENT</span>
          {isMentor ? (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => selectedFile && focusFile(selectedFile)}
                title="Force all students to open this file"
                style={{
                  background: "#0e639c",
                  color: "#fff",
                  border: "none",
                  padding: "2px 6px",
                  fontSize: "0.65rem",
                  borderRadius: "2px",
                  cursor: "pointer",
                }}
              >
                Focus File
              </button>
            </div>
          ) : (
            !canEdit && (
              <button
                onClick={requestEditAccess}
                style={{
                  background: "#4ec9b0",
                  color: "#1e1e1e",
                  border: "none",
                  padding: "2px 6px",
                  fontSize: "0.65rem",
                  fontWeight: "bold",
                  borderRadius: "2px",
                  cursor: "pointer",
                }}
              >
                Request Access
              </button>
            )
          )}
        </div>

        {isMentor && editRequests.length > 0 && (
          <div style={{ marginBottom: "0.5rem", padding: "0.4rem", background: "#3e3e42", borderRadius: "4px" }}>
            <p style={{ fontSize: "0.65rem", color: "#ccc", marginBottom: "0.3rem" }}>Pending Requests:</p>
            {editRequests.map((req) => (
              <div key={req.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.7rem", color: "#fff" }}>{req.username}</span>
                <button
                  onClick={() => approveRequest(req.userId)}
                  style={{
                    background: "#0e639c",
                    color: "#fff",
                    border: "none",
                    padding: "1px 4px",
                    fontSize: "0.6rem",
                    cursor: "pointer",
                  }}
                >
                  Grant
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: "2px", background: "#1e1e1e", padding: "2px", borderRadius: "4px" }}>
          <button
            onClick={() => setActiveTab("advice")}
            style={{
              flex: 1,
              padding: "0.3rem",
              fontSize: "0.7rem",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
              background: activeTab === "advice" ? "#3e3e42" : "transparent",
              color: activeTab === "advice" ? "#fff" : "#858585",
            }}
          >
            Advice
          </button>
          <button
            onClick={() => setActiveTab("annotations")}
            style={{
              flex: 1,
              padding: "0.3rem",
              fontSize: "0.7rem",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
              background: activeTab === "annotations" ? "#3e3e42" : "transparent",
              color: activeTab === "annotations" ? "#fff" : "#858585",
            }}
          >
            Review
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflow: "auto", padding: "0.75rem" }}>
        {activeTab === "advice" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {adviceList.map((advice) => (
              <div
                key={advice.id}
                style={{ background: "#1e1e1e", border: "1px solid #3e3e42", borderRadius: "4px", padding: "0.75rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.4rem",
                    fontSize: "0.7rem",
                  }}
                >
                  <span style={{ color: "#4ec9b0", fontWeight: "bold" }}>{advice.author}</span>
                  <span style={{ color: "#858585" }}>{advice.timestamp}</span>
                </div>
                <div style={{ color: "#d4d4d4", fontSize: "0.75rem", lineHeight: "1.5" }}>{advice.text}</div>
              </div>
            ))}
            {adviceList.length === 0 && (
              <div style={{ textAlign: "center", color: "#666", fontSize: "0.75rem", marginTop: "2rem" }}>
                No advice sent yet.
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {annotations.map((ann) => (
              <div
                key={ann.id}
                style={{
                  background: "#252526",
                  border: "1px solid #3e3e42",
                  borderLeft: "3px solid #0e639c",
                  borderRadius: "4px",
                  padding: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.4rem",
                    fontSize: "0.7rem",
                  }}
                >
                  <span style={{ color: "#ce9178", fontWeight: "bold" }}>Reviewer: {ann.author}</span>
                  <span style={{ color: "#858585" }}>{ann.timestamp}</span>
                </div>
                <div style={{ color: "#d4d4d4", fontSize: "0.75rem", marginBottom: "0.4rem" }}>{ann.text}</div>
                <div style={{ fontSize: "0.65rem", color: "#858585", fontStyle: "italic" }}>File: {ann.file}</div>
              </div>
            ))}
            {annotations.length === 0 && (
              <div style={{ textAlign: "center", color: "#666", fontSize: "0.75rem", marginTop: "2rem" }}>
                No code reviews yet.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form Area */}
      {isMentor && (
        <div style={{ padding: "0.75rem", borderTop: "1px solid #3e3e42", background: "#252526" }}>
          {activeTab === "advice" ? (
            showAdviceForm ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <textarea
                  value={newAdvice}
                  onChange={(e) => setNewAdvice(e.target.value)}
                  placeholder="Type advice..."
                  style={{
                    width: "100%",
                    background: "#1e1e1e",
                    border: "1px solid #3e3e42",
                    color: "#fff",
                    padding: "0.5rem",
                    fontSize: "0.75rem",
                    minHeight: "60px",
                    outline: "none",
                    borderRadius: "2px",
                  }}
                />
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button
                    onClick={handleSendAdvice}
                    style={{
                      flex: 1,
                      background: "#0e639c",
                      color: "#fff",
                      border: "none",
                      padding: "0.4rem",
                      fontSize: "0.7rem",
                      borderRadius: "2px",
                      cursor: "pointer",
                    }}
                  >
                    Send
                  </button>
                  <button
                    onClick={() => setShowAdviceForm(false)}
                    style={{
                      background: "#3e3e42",
                      color: "#fff",
                      border: "none",
                      padding: "0.4rem",
                      fontSize: "0.7rem",
                      borderRadius: "2px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAdviceForm(true)}
                style={{
                  width: "100%",
                  background: "#0e639c",
                  color: "#fff",
                  border: "none",
                  padding: "0.5rem",
                  fontSize: "0.75rem",
                  borderRadius: "2px",
                  cursor: "pointer",
                }}
              >
                + New Advice
              </button>
            )
          ) : showAnnotationForm ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <textarea
                value={newAnnotation}
                onChange={(e) => setNewAnnotation(e.target.value)}
                placeholder={`Reviewing ${selectedFile?.name || "current file"}...`}
                style={{
                  width: "100%",
                  background: "#1e1e1e",
                  border: "1px solid #3e3e42",
                  color: "#fff",
                  padding: "0.5rem",
                  fontSize: "0.75rem",
                  minHeight: "60px",
                  outline: "none",
                  borderRadius: "2px",
                }}
              />
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button
                  onClick={handleSendAnnotation}
                  style={{
                    flex: 1,
                    background: "#0e639c",
                    color: "#fff",
                    border: "none",
                    padding: "0.4rem",
                    fontSize: "0.7rem",
                    borderRadius: "2px",
                    cursor: "pointer",
                  }}
                >
                  Submit Review
                </button>
                <button
                  onClick={() => setShowAnnotationForm(false)}
                  style={{
                    background: "#3e3e42",
                    color: "#fff",
                    border: "none",
                    padding: "0.4rem",
                    fontSize: "0.7rem",
                    borderRadius: "2px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAnnotationForm(true)}
              style={{
                width: "100%",
                background: "#0e639c",
                color: "#fff",
                border: "none",
                padding: "0.5rem",
                fontSize: "0.75rem",
                borderRadius: "2px",
                cursor: "pointer",
              }}
            >
              + Code Review
            </button>
          )}
        </div>
      )}
    </div>
  )
}
