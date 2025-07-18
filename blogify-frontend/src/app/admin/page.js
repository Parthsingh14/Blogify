"use client"
import { useEffect, useState } from "react"
import axios from "@/lib/api"
import { useRouter } from "next/navigation"
import { getUserFromToken } from "@/lib/auth"
import { ArrowLeft } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("users")

  useEffect(() => {
    const verifyAdmin = async () => {
      const storedUser = getUserFromToken()
      if (!storedUser || storedUser.role !== "admin") {
        router.push("/")
        return
      }
      setUser(storedUser)
    }

    verifyAdmin()
  }, [])

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [usersRes, postsRes] = await Promise.all([
          axios.get("/users"),
          axios.get("/posts"),
        ])
        setUsers(usersRes.data.users)
        setPosts(postsRes.data.posts)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load admin data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    
    try {
      await axios.delete(`/users/${userId}`)
      setUsers(users.filter(u => u._id !== userId))
    } catch (err) {
      setError("Failed to delete user")
    }
  }

  const deletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return
    
    try {
      await axios.delete(`/posts/${postId}`)
      setPosts(posts.filter(p => p._id !== postId))
    } catch (err) {
      setError("Failed to delete post")
    }
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center backdrop-blur-sm bg-[rgba(255,255,255,0.05)]">
      <div className="backdrop-blur-lg bg-[rgba(255,255,255,0.1)] p-8 rounded-xl shadow-lg border border-[rgba(161,98,232,0.3)] text-center">
        <p className="text-[#121212]">Verifying admin access...</p>
      </div>
    </div>
  )

  if (isLoading) return (
    <div className="min-h-screen backdrop-blur-sm bg-[rgba(255,255,255,0.05)] p-8">
      <div className="max-w-6xl mx-auto backdrop-blur-lg bg-[rgba(255,255,255,0.1)] p-6 rounded-xl shadow-lg border border-[rgba(161,98,232,0.3)]">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/3 bg-[rgba(161,98,232,0.2)] rounded-full"></div>
          <div className="h-6 w-full bg-[rgba(161,98,232,0.1)] rounded-full"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-[rgba(161,98,232,0.1)] rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen backdrop-blur-sm bg-[rgba(255,255,255,0.05)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto backdrop-blur-lg bg-[rgba(255,255,255,0.1)] rounded-xl shadow-lg border border-[rgba(161,98,232,0.3)] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[rgba(161,98,232,0.3)] flex items-start justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 mb-4 text-[#121212] hover:text-[#a162e8] transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h2 className="text-3xl font-bold text-[#121212] bg-gradient-to-r from-[#a162e8] to-[#08e8de] bg-clip-text text-transparent">
              Admin Dashboard
            </h2>
            <p className="text-[#555]">Welcome back, {user.name}</p>
          </div>
        </div>

        {error && (
          <div className="backdrop-blur-sm bg-[rgba(161,98,232,0.2)] text-[#121212] p-4 mx-6 mt-4 rounded-xl text-center border border-[rgba(161,98,232,0.3)]">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-[rgba(161,98,232,0.3)]">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-3 font-medium transition-all duration-300 ${
                activeTab === "users" 
                  ? "text-[#121212] border-b-2 border-[#a162e8]" 
                  : "text-[#555] hover:text-[#121212] hover:bg-[rgba(161,98,232,0.1)]"
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-6 py-3 font-medium transition-all duration-300 ${
                activeTab === "posts" 
                  ? "text-[#121212] border-b-2 border-[#a162e8]" 
                  : "text-[#555] hover:text-[#121212] hover:bg-[rgba(161,98,232,0.1)]"
              }`}
            >
              Posts ({posts.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "users" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 font-medium text-[#121212] pb-2 border-b border-[rgba(161,98,232,0.3)]">
                <div className="col-span-4">Name</div>
                <div className="col-span-4">Email</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Actions</div>
              </div>
              
              {users.map((user) => (
                <div key={user._id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-[rgba(161,98,232,0.2)] hover:bg-[rgba(161,98,232,0.05)] transition-colors duration-200">
                  <div className="col-span-4 text-[#121212]">{user.name}</div>
                  <div className="col-span-4 text-[#555]">{user.email}</div>
                  <div className="col-span-2">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      user.role === "admin" 
                        ? "bg-gradient-to-r from-[#a162e8] to-[#08e8de] text-[#121212]" 
                        : "bg-[rgba(161,98,232,0.1)] text-[#121212] border border-[rgba(161,98,232,0.2)]"
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="px-3 py-1 rounded-lg text-sm bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(161,98,232,0.2)] text-[#a162e8] hover:text-[#121212] border border-[rgba(161,98,232,0.3)] transition-all duration-300 hover:shadow-[0_0_8px_rgba(161,98,232,0.2)]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 font-medium text-[#121212] pb-2 border-b border-[rgba(161,98,232,0.3)]">
                <div className="col-span-6">Title</div>
                <div className="col-span-3">Author</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-1">Actions</div>
              </div>
              
              {posts.map((post) => (
                <div key={post._id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-[rgba(161,98,232,0.2)] hover:bg-[rgba(161,98,232,0.05)] transition-colors duration-200">
                  <div className="col-span-6 text-[#121212] truncate">{post.title}</div>
                  <div className="col-span-3 text-[#555]">{post.author?.name || "Unknown"}</div>
                  <div className="col-span-2 text-sm text-[#555]">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() => deletePost(post._id)}
                      className="px-3 py-1 rounded-lg text-sm bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(161,98,232,0.2)] text-[#a162e8] hover:text-[#121212] border border-[rgba(161,98,232,0.3)] transition-all duration-300 hover:shadow-[0_0_8px_rgba(161,98,232,0.2)]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}