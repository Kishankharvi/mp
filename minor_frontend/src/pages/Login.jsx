"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../context/UserContext"
import { toast } from "../utils/toast"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user, login, register } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate("/dashboard")
    }
  }, [user, navigate])

  async function doRegister() {
    if (!username || !email || !password) {
      toast.warning("Please fill in all fields")
      return
    }
    setIsLoading(true)
    try {
      await register({ username, email, password })
      // Toast is already shown by API service
      navigate("/dashboard")
    } catch (err) {
      console.error("[v0] Registration error:", err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function doLogin() {
    if (!email || !password) {
      toast.warning("Please fill in all fields")
      return
    }
    setIsLoading(true)
    try {
      await login({ email, password })
      // Toast is already shown by API service
      navigate("/dashboard")
    } catch (err) {
      console.error("[v0] Login error:", err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Code Room</h1>
          <p>Real-time collaborative code editor</p>
        </div>

        <div className="login-form">
          {isRegister && (
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <div className="button-group">
            {isRegister ? (
              <button onClick={doRegister} className="btn btn-primary" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
              </button>
            ) : (
              <button onClick={doLogin} className="btn btn-primary" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </button>
            )}
          </div>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            {isRegister ? (
              <p>
                Already have an account?{" "}
                <span onClick={() => setIsRegister(false)} style={{ color: "#0098ff", cursor: "pointer" }}>
                  Login
                </span>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <span onClick={() => setIsRegister(true)} style={{ color: "#0098ff", cursor: "pointer" }}>
                  Create one
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
