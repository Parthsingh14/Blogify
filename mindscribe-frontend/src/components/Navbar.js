"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getUserFromToken } from "@/lib/auth"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
    setMobileMenuOpen(false)
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <nav className="bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="font-bold text-xl text-gray-300 animate-pulse">
          Blogify
        </Link>
        <div className="hidden md:flex space-x-4">
          <div className="h-8 w-20 bg-gray-800 rounded-full animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-800 rounded-full animate-pulse"></div>
        </div>
      </nav>
    )
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-50">
        <Link 
          href="/" 
          className="font-bold text-2xl text-white hover:text-teal-400 transition-colors duration-300"
        >
          MindScribe
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-400 hover:text-white focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4 items-center">
          {!token ? (
            <>
              <Link 
                href="/login" 
                className="text-white hover:text-teal-400 font-medium px-4 py-2 rounded hover:bg-gray-800 border border-gray-700 transition-all duration-300 hover:border-teal-400"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="bg-teal-600 hover:bg-teal-500 text-white font-medium px-4 py-2 rounded border border-teal-600 transition-all duration-300 hover:shadow-lg"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/create-post" 
                className="bg-gradient-to-r from-gray-800 to-gray-700 text-white font-medium px-4 py-2 rounded flex items-center gap-1 transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:shadow-lg"
              >
                <span>+</span> New Post
              </Link>
              <button 
                onClick={logout} 
                className="text-white hover:text-teal-400 font-medium px-4 py-2 rounded hover:bg-gray-800 border border-gray-700 transition-all duration-300 hover:border-teal-400"
              >
                Logout
              </button>
            </>
          )}

          {user && user.role === "admin" && (
            <Link 
              href="/admin" 
              className="bg-gray-800 text-white font-medium px-4 py-2 rounded border border-gray-700 transition-all duration-300 hover:bg-gray-700 hover:shadow-lg"
            >
              Dashboard
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-gray-900 bg-opacity-90">
          <div className="flex flex-col h-full p-6 space-y-6">
            <div className="flex justify-between items-center">
              <Link 
                href="/" 
                className="font-bold text-2xl text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blogify
              </Link>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col space-y-4">
              {!token ? (
                <>
                  <Link 
                    href="/login" 
                    className="text-white hover:text-teal-400 font-medium px-4 py-3 rounded hover:bg-gray-800 border border-gray-700 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-teal-600 hover:bg-teal-500 text-white font-medium px-4 py-3 rounded border border-teal-600 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/create-post" 
                    className="bg-gray-800 text-white font-medium px-4 py-3 rounded flex items-center gap-1 transition-all duration-300 hover:bg-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>+</span> New Post
                  </Link>
                  <button 
                    onClick={logout} 
                    className="text-white hover:text-teal-400 font-medium px-4 py-3 rounded hover:bg-gray-800 border border-gray-700 transition-all duration-300 text-left"
                  >
                    Logout
                  </button>
                </>
              )}

              {user && user.role === "admin" && (
                <Link 
                  href="/admin" 
                  className="bg-gray-800 text-white font-medium px-4 py-3 rounded border border-gray-700 transition-all duration-300 hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}