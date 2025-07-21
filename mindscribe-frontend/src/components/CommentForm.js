"use client"
import { useState, useRef } from "react"
import axios from "@/lib/api"

export default function CommentForm({ postId, onCommentAdded }) {
  const [text, setText] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const textareaRef = useRef(null)
  const maxChars = 500

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim() || isSubmitting) return

    setIsSubmitting(true)
    setError("")
    
    try {
      // Optimistic update
      const tempComment = {
        _id: `temp-${Date.now()}`,
        text,
        user: { name: "You" },
        createdAt: new Date().toISOString()
      }
      onCommentAdded(tempComment)
      
      // Actual API call
      const res = await axios.post(`/posts/${postId}/comments`, { text })
      
      // Replace optimistic comment with real one
      onCommentAdded({
        ...res.data.comment,
        user: { name: "You" } // Temporary until refresh
      })
      
      setText("")
      setCharCount(0)
      textareaRef.current?.focus()
    } catch (err) {
      setError("Failed to add comment - please try again")
      // Remove optimistic comment on error
      onCommentAdded(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTextChange = (e) => {
    const value = e.target.value
    if (value.length <= maxChars) {
      setText(value)
      setCharCount(value.length)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          rows="4"
          className="w-full bg-gray-700 border border-gray-600 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
          placeholder="Share your thoughts..."
          required
          disabled={isSubmitting}
        ></textarea>
        <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
          {charCount}/{maxChars}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        {error && (
          <p className="text-sm text-red-400 px-3 py-2 rounded bg-gray-700 border border-gray-600">
            {error}
          </p>
        )}
        
        <button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
            !text.trim() || isSubmitting
              ? "bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600"
              : "bg-teal-600 hover:bg-teal-500 text-white hover:shadow-lg"
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              Posting...
            </>
          ) : (
            "Post Comment"
          )}
        </button>
      </div>
    </form>
  )
}