"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getUserFromToken } from "@/lib/auth"
import axios from "@/lib/api"

export default function PostCard({ post }) {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = getUserFromToken()
    console.log("Decoded User ➤", u)
    setUser(u)
  }, [])

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this post?")
    if (!confirmDelete) return

    try {
      await axios.delete(`/posts/${post._id}`)
      alert("Post deleted successfully!")
      router.refresh()
    } catch (err) {
      alert("Failed to delete post.")
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow space-y-2">
      <img
        src={post.coverImage}
        alt={post.title}
        className="w-full h-48 object-cover rounded"
      />
      <h2 className="text-xl font-semibold">{post.title}</h2>
      <p className="text-sm text-gray-600">{post.content.slice(0, 100)}...</p>
      <Link href={`/posts/${post._id}`} className="text-blue-600 inline-block">
        Read More →
      </Link>

      {user && user.id === post.author._id && (
        <div className="flex gap-4 mt-2">
          <Link href={`/edit-post/${post._id}`} className="text-blue-600 hover:underline">
            Edit
          </Link>
          <button onClick={handleDelete} className="text-red-600 hover:underline">
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
