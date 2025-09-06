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
      }, 20)

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/summary}`, {
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
    <div className="max-w-4xl px-6 py-12 mx-6 md:ml-24">
      <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg text-center">
        <p className="font-medium text-gray-300 mb-4">{error}</p>
        <button 
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-all duration-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  )

  if (isLoading) return (
    <div className="max-w-4xl px-6 py-12 mx-6 md:ml-24 space-y-6">
      <div className="animate-pulse space-y-4">
        <div className="h-64 w-full bg-gray-700 rounded-lg"></div>
        <div className="h-8 w-3/4 bg-gray-700 rounded-full"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-full bg-gray-700 rounded-full"></div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-fit px-6 py-12 mx-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 px-4 py-2 mb-8 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-300"
        aria-label="Go Back"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </button>

      {/* Post Content */}
      <article className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg">
        <div className="relative overflow-hidden rounded-lg mb-6 h-64 group">
          <img
            src={post.coverImage || '/placeholder-image.jpg'}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent pointer-events-none" />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
          <h1 className="text-3xl font-bold text-white">{post.title}</h1>
          <button
            onClick={handleSummaryClick}
            disabled={isSummaryLoading}
            className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all duration-300 ${
              showSummary 
                ? 'bg-teal-600 text-white' 
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            aria-label="Generate AI Summary"
          >
            <Sparkles size={18} className={isSummaryLoading ? "animate-pulse" : ""} />
            <span>AI Summary</span>
          </button>
        </div>

        {showSummary && (
          <div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-teal-400" />
              <h3 className="font-medium text-white">AI-Generated Summary</h3>
            </div>
            {isSummaryLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-600 rounded-full animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-600 rounded-full animate-pulse"></div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-gray-300">
                {typedSummary}
                {typingIndex < summary.length && (
                  <span className="ml-1 inline-block w-2 h-4 bg-gray-300 animate-blink"></span>
                )}
              </p>
            )}
          </div>
        )}
        
        <div className="prose max-w-none text-gray-300 mb-6">
          {post.content.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-4">{paragraph}</p>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400 border-t border-gray-700 pt-4">
          <span>Posted by {post?.author?.name || 'Anonymous'}</span>
          <span>{post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
        </div>
      </article>

      {/* Comments Section */}
      <section className="mt-8 bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Comments ({comments.length})</h2>
        
        {isCommentsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse p-4 bg-gray-700 rounded-lg">
                <div className="h-4 w-1/4 bg-gray-600 rounded-full mb-3"></div>
                <div className="h-3 w-3/4 bg-gray-600 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment, i) => (
              comment ? (
              <li key={comment._id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                  <p className="font-medium text-white">
                    {comment.author?.name || "Anonymous"}
                  </p>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-300">{comment.text}</p>
              </li>
              ) : null
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
              <p className="text-gray-400 mb-2">Want to join the discussion?</p>
              <button
                onClick={() => router.push(`/login?redirect=/posts/${postId}`)}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-all duration-300"
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