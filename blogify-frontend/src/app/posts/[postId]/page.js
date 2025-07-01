"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "@/lib/api"
import CommentForm from "@/components/CommentForm"

export default function PostDetailPage() {
  const { postId } = useParams()
  const router = useRouter()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [error, setError] = useState("")
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCommentsLoading, setIsCommentsLoading] = useState(true)

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

  if (error) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-[#ffdec7] text-[#493129] p-4 rounded-lg text-center">
        <p className="font-medium">{error}</p>
        <button 
          onClick={() => router.push("/")}
          className="mt-3 px-4 py-2 bg-[#efa3a0] text-[#493129] rounded-lg hover:bg-[#8b597b] hover:text-[#ffeedb] transition-colors duration-200"
        >
          Back to Home
        </button>
      </div>
    </div>
  )

  if (isLoading) return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="animate-pulse space-y-4">
        <div className="h-64 w-full bg-[#ffdec7] rounded-lg"></div>
        <div className="h-8 w-3/4 bg-[#ffdec7] rounded"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-full bg-[#ffdec7] rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Post Content */}
      <article className="bg-[#ffeedb] p-6 rounded-lg shadow-md border border-[#ffdec7]">
        <div className="relative overflow-hidden rounded-lg mb-6 h-64">
          <img
            src={post.coverImage || '/placeholder-image.jpg'}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-[#493129] mb-4">{post.title}</h1>
        
        <div className="prose max-w-none text-[#493129] mb-6">
          {post.content.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-4">{paragraph}</p>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-[#8b597b] border-t border-[#efa3a0]/30 pt-4">
          <span>Posted by {post.author?.name || 'Anonymous'}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </article>

      {/* Comments Section */}
      <section className="mt-8 bg-[#ffeedb] p-6 rounded-lg shadow-md border border-[#ffdec7]">
        <h2 className="text-2xl font-bold text-[#493129] mb-4">Comments ({comments.length})</h2>
        
        {isCommentsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse p-4 bg-[#ffdec7] rounded-lg">
                <div className="h-4 w-1/4 bg-[#efa3a0] rounded mb-3"></div>
                <div className="h-3 w-3/4 bg-[#efa3a0] rounded"></div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-[#8b597b] text-center py-4">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment._id} className="bg-[#ffdec7] p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-[#493129]">
                    {comment.user?.name || "Anonymous"}
                  </p>
                  <span className="text-xs text-[#8b597b]">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-[#493129]">{comment.text}</p>
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
              <p className="text-[#8b597b] mb-2">Want to join the discussion?</p>
              <button
                onClick={() => router.push(`/login?redirect=/posts/${postId}`)}
                className="px-4 py-2 bg-[#8b597b] text-[#ffeedb] rounded-lg hover:bg-[#493129] transition-colors duration-200"
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