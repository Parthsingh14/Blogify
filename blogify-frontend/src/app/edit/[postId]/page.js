"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "@/lib/api"
import { getUserFromToken } from "@/lib/auth"

export default function EditPostPage() {
  const router = useRouter()
  const { postId } = useParams()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const user = getUserFromToken()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/posts/${postId}`)
        const post = res.data.post

        if (!user || user._id !== post.author._id) {
          router.push("/")
          return
        }

        setTitle(post.title)
        setContent(post.content)
        setCategory(post.category)
      } catch (err) {
        console.error(err)
        setError("Could not fetch post.")
      }
    }

    fetchPost()
  }, [postId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.put(`/posts/${postId}`, {
        title,
        content,
        category,
      })
      router.push(`/posts/${postId}`) // Redirect to post page
    } catch (err) {
      console.error(err)
      setError("Update failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            className="w-full border rounded p-2"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  )
}
