"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "@/lib/api"
import Link from "next/link"
import { motion } from "framer-motion"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleChange = (e) => {
    setError("")
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === "password") {
      calculatePasswordStrength(value)
    }
  }

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    setPasswordStrength(strength)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isLoading) return

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (passwordStrength < 3) {
      setError("Password is too weak. Please use a stronger password.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await axios.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      router.push("/login?registered=true")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
      console.error("Registration error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 0: return "bg-red-500"
      case 1: return "bg-red-400"
      case 2: return "bg-yellow-500"
      case 3: return "bg-teal-400"
      case 4: return "bg-teal-500"
      default: return "bg-gray-600"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 overflow-hidden">
      <div className="relative w-full max-w-4xl flex items-center justify-center">
        {/* Background Text - Starts hidden behind form, then slides left */}
        <motion.div
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: -50, opacity: 0.8 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute left-0 text-gray-500 font-bold z-0"
          style={{ width: "200px" }}
        >
          <div className="text-xl md:text-2xl leading-tight">
            <p>SHARE YOUR</p>
            <p>STORIES AND THOUGHTS</p>
            <p>WITH EVERYONE</p>
            <p>ON MINDSCRIBE</p>
          </div>
        </motion.div>

        {/* Register Form - Starts centered, then slides right */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: 0 }}
          transition={{ duration: 0, ease: "easeOut" }}
          className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg border border-gray-700 w-full max-w-md relative z-10"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Create Account</h2>
            <p className="text-gray-400 mt-2">Join the Blogify community</p>
          </div>

          {error && (
            <div className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-center text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your full name"
                className="w-full px-4 py-2.5 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

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
                  autoComplete="new-password"
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
              <div className="mt-2">
                <div className="flex gap-1 h-1">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-full ${i < passwordStrength ? getPasswordStrengthColor() : "bg-gray-600"}`}
                    ></div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {passwordStrength < 2 ? "Weak" : 
                   passwordStrength < 4 ? "Good" : "Strong"} password
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-teal-500 focus:ring-teal-500 border-gray-600 rounded bg-gray-700"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                I agree to the <Link href="/terms" className="text-teal-400 hover:underline">Terms</Link>
              </label>
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-teal-400 hover:text-teal-300">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}