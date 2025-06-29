"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getUserFromToken } from "@/lib/auth"

export default function Navbar() {
  const [token, setToken] = useState("")
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    setToken(storedToken)

    if (storedToken) {
      const decoded = getUserFromToken()
      setUser(decoded)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl text-blue-600">
        Blogify
      </Link>

      <div className="space-x-4 flex items-center">
        {!token ? (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        ) : (
          <>
            <Link href="/create-post" className="text-green-600 font-medium">
              + New Post
            </Link>
            <button onClick={logout} className="text-red-500 font-medium">
              Logout
            </button>
          </>
        )}

        {/* ✅ Only show Admin link if user is an admin */}
        {user && user.role === "admin" && (
          <Link href="/admin" className="text-purple-600 font-medium">
            Admin
          </Link>
        )}
      </div>
    </nav>
  )
}
