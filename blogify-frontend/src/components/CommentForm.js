"use client"
import { useState } from "react"
import axios from "@/lib/api"

export default function CommentForm({ postId, onCommentAdded }) {
  const [text, setText] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    try {
      const res = await axios.post(`/posts/${postId}/comments`, { text })
      const updated = await axios.get(`/posts/${postId}/comments`)
      onCommentAdded(updated.data.comments)
      setText("")
    } catch (err) {
      setError("Failed to add comment")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="3"
        className="w-full border p-2 rounded"
        placeholder="Write your comment..."
        required
      ></textarea>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Submit Comment
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}
