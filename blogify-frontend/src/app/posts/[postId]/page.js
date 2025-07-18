"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "@/lib/api"
import CommentForm from "@/components/CommentForm"
import { Sparkles } from "lucide-react"

export default function PostDetailPage() {
  const { postId } = useParams()
  const router = useRouter()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [error, setError] = useState("")
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCommentsLoading, setIsCommentsLoading] = useState(true)
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)
  const [summary, setSummary] = useState("")
  const [showSummary, setShowSummary] = useState(false)
  const [typedSummary, setTypedSummary] = useState("")
  const [typingIndex, setTypingIndex] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [postRes, commentsRes] = await Promise.all([
          axios.get(`/posts/${postId}`),
          axios.get(`/posts/${postId}/comments`)
        ])
        setPost(postRes.data.post)
        setComments(commentsRes.data.comments)
      } catch (err) {
        setError("Post not found or failed to load")
        console.error(err)
      } finally {
        setIsLoading(false)
        setIsCommentsLoading(false)
      }
    }

    fetchData()
    setToken(localStorage.getItem("token"))
  }, [postId])

  useEffect(() => {
    if (summary && showSummary) {
      setTypedSummary("")
      setTypingIndex(0)
    }
  }, [summary, showSummary])

  useEffect(() => {
    if (typingIndex < summary.length && showSummary) {
      const timeout = setTimeout(() => {
        setTypedSummary(prev => prev + summary[typingIndex])
        setTypingIndex(prev => prev + 1)
      }, 20) // Adjust typing speed here

      return () => clearTimeout(timeout)
    }
  }, [typingIndex, summary, showSummary])

  const handleSummaryClick = async () => {
    if (showSummary) {
      setShowSummary(false)
      return
    }

    setIsSummaryLoading(true)
    setShowSummary(true)
    try {
      const response = await fetch("http://localhost:8000/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: post.content
        })
      })
      const data = await response.json()
      setSummary(data.summary)
    } catch (err) {
      console.error("Failed to generate summary:", err)
      setSummary("Failed to generate summary. Please try again.")
    } finally {
      setIsSummaryLoading(false)
    }
  }

  if (error) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="backdrop-blur-lg bg-[rgba(255,255,255,0.1)] border border-[rgba(161,98,232,0.3)] p-6 rounded-xl text-center shadow-lg">
        <p className="font-medium text-[#121212] mb-4">{error}</p>
        <button 
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-gradient-to-r from-[#a162e8] to-[#08e8de] text-[#121212] font-medium rounded-xl hover:shadow-[0_0_20px_rgba(161,98,232,0.5)] transition-all duration-300 hover:scale-105"
        >
          Back to Home
        </button>
      </div>
    </div>
  )

  if (isLoading) return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="animate-pulse space-y-4">
        <div className="h-64 w-full bg-[rgba(161,98,232,0.1)] rounded-xl"></div>
        <div className="h-8 w-3/4 bg-[rgba(161,98,232,0.1)] rounded-full"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-full bg-[rgba(161,98,232,0.1)] rounded-full"></div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 px-4 py-2 mb-6 bg-gradient-to-r from-[#a162e8] to-[#08e8de] text-[#121212] font-medium rounded-xl shadow hover:scale-105 transition-all duration-300"
        aria-label="Go Back"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2" viewBox="0 0 24 24">
          <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </button>
      {/* Post Content */}
      <article className="backdrop-blur-lg bg-[rgba(255,255,255,0.1)] p-6 rounded-xl shadow-lg border border-[rgba(161,98,232,0.3)]">
        <div className="relative overflow-hidden rounded-xl mb-6 h-64 group">
          <img
            src={post.coverImage || '/placeholder-image.jpg'}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,232,222,0.2)] to-transparent pointer-events-none" />
        </div>
        
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-[#121212]">{post.title}</h1>
          <button
            onClick={handleSummaryClick}
            disabled={isSummaryLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              showSummary 
                ? 'bg-gradient-to-r from-[#a162e8] to-[#08e8de] text-[#121212]' 
                : 'bg-[rgba(161,98,232,0.2)] text-[#121212] hover:bg-[rgba(161,98,232,0.3)]'
            }`}
            aria-label="Generate AI Summary"
          >
            <Sparkles size={18} className={isSummaryLoading ? "animate-pulse" : ""} />
            <span className="hidden sm:inline">AI Summary</span>
          </button>
        </div>

        {showSummary && (
          <div className="mb-6 p-4 bg-gradient-to-br from-[rgba(161,98,232,0.2)] to-[rgba(8,232,222,0.2)] rounded-xl border border-[rgba(161,98,232,0.3)]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-[#a162e8]" />
              <h3 className="font-medium text-[#121212]">AI-Generated Summary</h3>
            </div>
            {isSummaryLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-full bg-[rgba(161,98,232,0.2)] rounded-full animate-pulse"></div>
                <div className="h-4 w-3/4 bg-[rgba(161,98,232,0.2)] rounded-full animate-pulse"></div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-[#121212]">
                {typedSummary}
                {typingIndex < summary.length && (
                  <span className="ml-1 inline-block w-2 h-4 bg-[#121212] animate-blink"></span>
                )}
              </p>
            )}
          </div>
        )}
        
        <div className="prose max-w-none text-[#121212] mb-6">
          {post.content.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-4">{paragraph}</p>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-[#555] border-t border-[rgba(161,98,232,0.3)] pt-4">
          <span>Posted by {post.author?.name || 'Anonymous'}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </article>

      {/* Comments Section */}
      <section className="mt-8 backdrop-blur-lg bg-[rgba(255,255,255,0.1)] p-6 rounded-xl shadow-lg border border-[rgba(161,98,232,0.3)]">
        <h2 className="text-2xl font-bold text-[#121212] mb-4">Comments ({comments.length})</h2>
        
        {isCommentsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse p-4 bg-[rgba(161,98,232,0.1)] rounded-xl">
                <div className="h-4 w-1/4 bg-[rgba(161,98,232,0.2)] rounded-full mb-3"></div>
                <div className="h-3 w-3/4 bg-[rgba(161,98,232,0.2)] rounded-full"></div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-[#555] text-center py-4">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment._id} className="backdrop-blur-sm bg-[rgba(255,255,255,0.1)] p-4 rounded-xl border border-[rgba(161,98,232,0.2)]">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-[#121212]">
                    {comment.user?.name || "Anonymous"}
                  </p>
                  <span className="text-xs text-[#555]">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-[#121212]">{comment.text}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Comment Form */}
        <div className="mt-6">
          {token ? (
            <CommentForm postId={postId} onCommentAdded={(newComment) => {
              setComments(prev => [newComment, ...prev])
            }} />
          ) : (
            <div className="text-center py-4">
              <p className="text-[#555] mb-2">Want to join the discussion?</p>
              <button
                onClick={() => router.push(`/login?redirect=/posts/${postId}`)}
                className="px-6 py-3 bg-gradient-to-r from-[#a162e8] to-[#08e8de] text-[#121212] font-medium rounded-xl hover:shadow-[0_0_20px_rgba(161,98,232,0.5)] transition-all duration-300 hover:scale-105"
              >
                Login to Comment
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}