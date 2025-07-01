"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "@/lib/api"
import Link from "next/link"

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
    <div className="min-h-screen flex items-center justify-center bg-[#ffeedb] p-4">
      <div className="bg-[#ffdec7] p-8 rounded-lg shadow-lg border border-[#efa3a0]/30 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#493129]">Welcome Back</h2>
          <p className="text-[#8b597b] mt-2">Sign in to your Blogify account</p>
        </div>

        {error && (
          <div className="bg-[#efa3a0] text-[#493129] p-3 rounded-md mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#493129] mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg border border-[#efa3a0] focus:outline-none focus:ring-2 focus:ring-[#8b597b] focus:border-transparent bg-[#ffeedb] text-[#493129]"
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#493129] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-[#efa3a0] focus:outline-none focus:ring-2 focus:ring-[#8b597b] focus:border-transparent bg-[#ffeedb] text-[#493129] pr-12"
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b597b] hover:text-[#493129]"
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
                className="h-4 w-4 text-[#8b597b] focus:ring-[#8b597b] border-[#efa3a0] rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[#493129]">
                Remember me
              </label>
            </div>

            <Link href="/forgot-password" className="text-sm text-[#8b597b] hover:text-[#493129]">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center ${
              isLoading
                ? "bg-[#8b597b]/70 text-[#ffeedb] cursor-not-allowed"
                : "bg-[#8b597b] text-[#ffeedb] hover:bg-[#493129]"
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
          <p className="text-sm text-[#493129]">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-[#8b597b] hover:text-[#493129]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}