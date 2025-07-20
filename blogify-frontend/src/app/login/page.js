"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "@/lib/api"
import Link from "next/link"
import { motion } from "framer-motion"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setError("")
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isLoading) return
    
    setIsLoading(true)
    setError("")
    
    try {
      const res = await axios.post("/auth/login", formData)
      localStorage.setItem("token", res.data.token)
      window.dispatchEvent(new Event('auth-change'))
      router.push("/")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 overflow-hidden">
      <div className="relative w-full max-w-4xl flex items-center justify-center">
        {/* Background Text - Starts hidden (opacity:0) behind form, then slides left and appears */}
        <motion.div
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: -10, opacity: 0.8 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute left-0 text-gray-500 font-bold z-0"
          style={{ width: "200px" }}
        >
          <div className="text-xl md:text-2xl leading-tight">
            <p>BLOGIFY</p>
            <p>YOUR IDEAS</p>
          </div>
        </motion.div>

        {/* Login Form - Starts centered, then slides right */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: 0 }}
          transition={{ duration: 0, ease: "easeOut" }}
          className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg border border-gray-700 w-full max-w-md relative z-10"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-gray-400 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-center text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400 pr-12"
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-400"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-teal-500 focus:ring-teal-500 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <Link href="/forgot-password" className="text-sm text-teal-400 hover:text-teal-300">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 px-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center ${
                isLoading
                  ? "bg-teal-600/70 text-white cursor-not-allowed"
                  : "bg-teal-600 text-white hover:bg-teal-500"
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link href="/register" className="font-medium text-teal-400 hover:text-teal-300">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}