"use client"

import React from "react"

let toastId = 0
let listeners = []

export const toast = {
  success: (message) => notify("success", message),
  error: (message) => notify("error", message),
  info: (message) => notify("info", message),
  warning: (message) => notify("warning", message),
}

function notify(type, message) {
  const id = toastId++
  const notification = { id, type, message }
  listeners.forEach((listener) => listener(notification))

  setTimeout(() => {
    listeners.forEach((listener) => listener({ id, remove: true }))
  }, 3000)
}

export function useToast() {
  const [toasts, setToasts] = React.useState([])

  React.useEffect(() => {
    const unsubscribe = (notification) => {
      if (notification.remove) {
        setToasts((prev) => prev.filter((t) => t.id !== notification.id))
      } else {
        setToasts((prev) => [...prev, notification])
      }
    }
    listeners.push(unsubscribe)
    return () => {
      listeners = listeners.filter((l) => l !== unsubscribe)
    }
  }, [])

  return toasts
}

export function ToastContainer() {
  const toasts = useToast()

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {toasts.map((t) => (
        <Toast key={t.id} type={t.type} message={t.message} />
      ))}
    </div>
  )
}

function Toast({ type, message }) {
  const colors = {
    success: { bg: "#10b981", icon: "✓" },
    error: { bg: "#ef4444", icon: "✕" },
    info: { bg: "#3b82f6", icon: "ℹ" },
    warning: { bg: "#f59e0b", icon: "⚠" },
  }

  const { bg, icon } = colors[type] || colors.info

  return (
    <div
      style={{
        padding: "1rem",
        background: bg,
        color: "white",
        borderRadius: "0.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        minWidth: "300px",
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <span style={{ fontWeight: "bold" }}>{icon}</span>
      <span>{message}</span>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
