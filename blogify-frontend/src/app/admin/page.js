"use client"
import { useEffect, useState } from "react"
import axios from "@/lib/api"
import { useRouter } from "next/navigation"
import { getUserFromToken } from "@/lib/auth"

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
    <div className="min-h-screen flex items-center justify-center bg-[#ffeedb]">
      <div className="bg-[#ffdec7] p-8 rounded-lg shadow-lg border border-[#efa3a0]/30 text-center">
        <p className="text-[#493129]">Verifying admin access...</p>
      </div>
    </div>
  )

  if (isLoading) return (
    <div className="min-h-screen bg-[#ffeedb] p-8">
      <div className="max-w-4xl mx-auto bg-[#ffdec7] p-6 rounded-lg shadow-lg border border-[#efa3a0]/30">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/3 bg-[#efa3a0] rounded"></div>
          <div className="h-6 w-full bg-[#ffdec7] rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-[#ffdec7] rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#ffeedb] p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-[#ffdec7] rounded-lg shadow-lg border border-[#efa3a0]/30 overflow-hidden">
        <div className="p-6 border-b border-[#efa3a0]/30">
          <h2 className="text-3xl font-bold text-[#493129]">Admin Dashboard</h2>
          <p className="text-[#8b597b]">Welcome back, {user.name}</p>
        </div>

        {error && (
          <div className="bg-[#efa3a0] text-[#493129] p-3 mx-6 mt-4 rounded-md text-center">
            {error}
          </div>
        )}

        <div className="border-b border-[#efa3a0]/30">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-3 font-medium ${activeTab === "users" ? "text-[#493129] border-b-2 border-[#8b597b]" : "text-[#8b597b] hover:text-[#493129]"}`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-6 py-3 font-medium ${activeTab === "posts" ? "text-[#493129] border-b-2 border-[#8b597b]" : "text-[#8b597b] hover:text-[#493129]"}`}
            >
              Posts ({posts.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "users" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 font-medium text-[#493129] pb-2 border-b border-[#efa3a0]/30">
                <div className="col-span-4">Name</div>
                <div className="col-span-4">Email</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Actions</div>
              </div>
              
              {users.map((user) => (
                <div key={user._id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-[#efa3a0]/30">
                  <div className="col-span-4 text-[#493129]">{user.name}</div>
                  <div className="col-span-4 text-[#8b597b]">{user.email}</div>
                  <div className="col-span-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.role === "admin" ? "bg-[#8b597b] text-[#ffeedb]" : "bg-[#ffdec7] text-[#493129]"}`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="text-[#efa3a0] hover:text-[#493129] font-medium text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 font-medium text-[#493129] pb-2 border-b border-[#efa3a0]/30">
                <div className="col-span-6">Title</div>
                <div className="col-span-3">Author</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-1">Actions</div>
              </div>
              
              {posts.map((post) => (
                <div key={post._id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-[#efa3a0]/30">
                  <div className="col-span-6 text-[#493129] truncate">{post.title}</div>
                  <div className="col-span-3 text-[#8b597b]">{post.author?.name || "Unknown"}</div>
                  <div className="col-span-2 text-sm text-[#8b597b]">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() => deletePost(post._id)}
                      className="text-[#efa3a0] hover:text-[#493129] font-medium text-sm"
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