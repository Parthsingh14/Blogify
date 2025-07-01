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
          className="w-full border border-[#efa3a0] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b597b] focus:border-transparent text-[#493129] bg-[#ffeedb]"
          placeholder="Share your thoughts..."
          required
          disabled={isSubmitting}
        ></textarea>
        <div className="absolute bottom-2 right-2 text-xs text-[#8b597b]">
          {charCount}/{maxChars}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
            !text.trim() || isSubmitting
              ? "bg-[#ffdec7] text-[#493129]/50 cursor-not-allowed"
              : "bg-[#8b597b] text-[#ffeedb] hover:bg-[#493129]"
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
        
        {error && (
          <p className="text-sm text-[#efa3a0] px-2 py-1 rounded">
            {error}
          </p>
        )}
      </div>
    </form>
  )
}