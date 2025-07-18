"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getUserFromToken } from "@/lib/auth"

export default function Navbar() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const checkAuthState = async () => {
    try {
      const storedToken = localStorage.getItem("token")
      setToken(storedToken)

      if (storedToken) {
        const decoded = await getUserFromToken()
        setUser(decoded)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Auth loading error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuthState()
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        checkAuthState()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    const handleAuthChange = () => checkAuthState()
    window.addEventListener('auth-change', handleAuthChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('auth-change', handleAuthChange)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    window.dispatchEvent(new Event('auth-change'))
    router.push("/")
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <nav className="backdrop-blur-lg bg-[rgba(255,255,255,0.1)] p-4 flex justify-between items-center sticky top-0 z-50 border-b border-[rgba(161,98,232,0.3)] shadow-lg">
        <Link href="/" className="font-bold text-xl text-[#e0e0ff] animate-pulse">
          Blogify
        </Link>
        <div className="flex space-x-4">
          <div className="h-8 w-20 bg-[rgba(161,98,232,0.2)] rounded-full animate-pulse"></div>
          <div className="h-8 w-24 bg-[rgba(8,232,222,0.2)] rounded-full animate-pulse"></div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="backdrop-blur-lg bg-[rgba(255,255,255,0.1)] p-4 flex justify-between items-center sticky top-0 z-50 border-b border-[rgba(161,98,232,0.3)] shadow-lg">
      <Link 
        href="/" 
        className="font-bold text-2xl text-[#e0e0ff] hover:text-[#a162e8] transition-colors duration-300 hover:drop-shadow-[0_0_10px_rgba(161,98,232,0.7)]"
      >
        Blogify
      </Link>

      <div className="space-x-4 flex items-center">
        {!token ? (
          <>
            <Link 
              href="/login" 
              className="text-[#22223b] hover:text-[#08e8de] font-medium px-4 py-2 rounded-full hover:bg-[rgba(8,232,222,0.2)] border border-[rgba(255,255,255,0.1)] transition-all duration-300 hover:border-[#08e8de] hover:scale-105"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="hover-iridescent font-medium px-4 py-2 rounded-full border border-[rgba(255,255,255,0.1)] text-[#22223b] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(161,98,232,0.5)]"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link 
              href="/create-post" 
              className="bg-gradient-to-r from-[#a162e8] to-[#08e8de] text-[#22223b] font-medium px-4 py-2 rounded-full flex items-center gap-1 transition-all duration-300 hover:shadow-[0_0_20px_rgba(161,98,232,0.7)] hover:scale-105"
            >
              <span>+</span> New Post
            </Link>
            <button 
              onClick={logout} 
              className="text-[#22223b] hover:text-[#08e8de] font-medium px-4 py-2 rounded-full hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] transition-all duration-300 hover:border-[#08e8de] hover:scale-105"
            >
              Logout
            </button>
          </>
        )}

        {user && user.role === "admin" && (
          <Link 
            href="/admin" 
            className="bg-[rgba(161,98,232,0.3)] text-[#e0e0ff] font-medium px-4 py-2 rounded-full border border-[rgba(161,98,232,0.5)] transition-all duration-300 hover:bg-[rgba(161,98,232,0.5)] hover:shadow-[0_0_15px_rgba(161,98,232,0.5)] hover:scale-105"
          >
            Admin
          </Link>
        )}
      </div>
    </nav>
  )
}