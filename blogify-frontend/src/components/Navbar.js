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

  // Function to check auth state
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
    // Initial check
    checkAuthState()

    // Set up storage event listener
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        checkAuthState()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Set up custom event listener for same-tab auth changes
    const handleAuthChange = () => checkAuthState()
    window.addEventListener('auth-change', handleAuthChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('auth-change', handleAuthChange)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('auth-change'))
    router.push("/")
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <nav className="bg-[#ffeedb] shadow-md p-4 flex justify-between items-center border-b border-[#efa3a0]/30">
        <Link href="/" className="font-bold text-xl text-[#493129] animate-pulse">
          Blogify
        </Link>
        <div className="flex space-x-4">
          <div className="h-6 w-16 bg-[#ffdec7] rounded animate-pulse"></div>
          <div className="h-6 w-20 bg-[#ffdec7] rounded animate-pulse"></div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-[#ffeedb] shadow-md p-4 flex justify-between items-center sticky top-0 z-50 border-b border-[#efa3a0]/30">
      <Link 
        href="/" 
        className="font-bold text-xl text-[#493129] hover:text-[#8b597b] transition-colors duration-200"
      >
        Blogify
      </Link>

      <div className="space-x-4 flex items-center">
        {!token ? (
          <>
            <Link 
              href="/login" 
              className="text-[#493129] hover:text-[#8b597b] font-medium px-3 py-1 rounded-md hover:bg-[#ffdec7] transition-all duration-200"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="bg-[#efa3a0] text-[#493129] hover:bg-[#8b597b] hover:text-[#ffeedb] font-medium px-3 py-1 rounded-md transition-all duration-200"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link 
              href="/create-post" 
              className="bg-[#8b597b] text-[#ffeedb] hover:bg-[#493129] font-medium px-3 py-1 rounded-md flex items-center gap-1 transition-all duration-200"
            >
              <span>+</span> New Post
            </Link>
            <button 
              onClick={logout} 
              className="text-[#493129] hover:text-[#efa3a0] font-medium px-3 py-1 rounded-md hover:bg-[#ffdec7] transition-all duration-200"
            >
              Logout
            </button>
          </>
        )}

        {user && user.role === "admin" && (
          <Link 
            href="/admin" 
            className="bg-[#493129] text-[#ffeedb] hover:bg-[#8b597b] font-medium px-3 py-1 rounded-md transition-all duration-200"
          >
            Admin
          </Link>
        )}
      </div>
    </nav>
  )
}