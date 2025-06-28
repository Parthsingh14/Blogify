"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [token, setToken] = useState("")
  const router = useRouter()

  useEffect(() => {
    setToken(localStorage.getItem("token"))
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
      <div className="space-x-4">
        {!token ? (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        ) : (
          <button onClick={logout} className="text-red-500 font-medium">
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}
