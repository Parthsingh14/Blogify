"use client"
import { useEffect, useState } from "react"
import axios from "@/lib/api"
import { useRouter } from "next/navigation"
import { getUserFromToken } from "@/lib/auth"

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [error, setError] = useState("")
  const user = getUserFromToken()

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
      return
    }

    const fetchData = async () => {
      try {
        const [usersRes, postsRes] = await Promise.all([
          axios.get("/users"),
          axios.get("/posts"),
        ])
        setUsers(usersRes.data.users)
        setPosts(postsRes.data.posts)
      } catch (err) {
        setError("You are not authorized.")
      }
    }

    fetchData()
  }, [])

  const deleteUser = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await axios.delete(`/users/${id}`)
      setUsers(users.filter((u) => u._id !== id))
    }
  }

  const deletePost = async (id) => {
    if (confirm("Delete this post?")) {
      await axios.delete(`/posts/${id}`)
      setPosts(posts.filter((p) => p._id !== id))
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow p-6 mt-6 rounded">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      {error && <p className="text-red-500">{error}</p>}

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Users</h3>
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user._id} className="flex justify-between items-center border p-2 rounded">
              <div>
                <p>{user.name} ({user.email})</p>
              </div>
              <button
                onClick={() => deleteUser(user._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Posts</h3>
        <ul className="space-y-2">
          {posts.map((post) => (
            <li key={post._id} className="flex justify-between items-center border p-2 rounded">
              <p>{post.title}</p>
              <button
                onClick={() => deletePost(post._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
