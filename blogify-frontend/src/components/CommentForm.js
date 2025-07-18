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
          className="w-full backdrop-blur-sm bg-[rgba(255,255,255,0.1)] border border-[rgba(161,98,232,0.3)] p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a162e8] focus:border-transparent text-[#121212] placeholder-[rgba(18,18,18,0.6)] transition-all duration-300 hover:border-[#08e8de]"
          placeholder="Share your cosmic thoughts..."
          required
          disabled={isSubmitting}
        ></textarea>
        <div className="absolute bottom-3 right-3 text-xs text-[#555] backdrop-blur-sm bg-[rgba(255,255,255,0.2)] px-2 py-1 rounded-full">
          {charCount}/{maxChars}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${
            !text.trim() || isSubmitting
              ? "bg-[rgba(161,98,232,0.1)] text-[#121212]/50 cursor-not-allowed border border-[rgba(161,98,232,0.2)]"
              : "bg-gradient-to-r from-[#a162e8] to-[#08e8de] text-[#121212] hover:shadow-[0_0_15px_rgba(161,98,232,0.5)] hover:scale-105"
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              Transmitting...
            </>
          ) : (
            "Post Comment"
          )}
        </button>
        
        {error && (
          <p className="text-sm text-[#a162e8] px-3 py-2 rounded-xl backdrop-blur-sm bg-[rgba(161,98,232,0.1)] border border-[rgba(161,98,232,0.3)]">
            {error}
          </p>
        )}
      </div>
    </form>
  )
}