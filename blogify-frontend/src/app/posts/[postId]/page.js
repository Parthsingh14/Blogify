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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/posts/${postId}`)
        setPost(res.data.post)
      } catch (err) {
        setError("Post not found")
      }
    }

    const fetchComments = async () => {
      try {
        const res = await axios.get(`/posts/${postId}/comments`)
        setComments(res.data.comments)
      } catch (err) {
        console.error(err)
      }
    }

    fetchPost()
    fetchComments()
    setToken(localStorage.getItem("token"))
  }, [postId])

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>
  if (!post) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <img src={post.coverImage} alt={post.title} className="w-full h-64 object-cover rounded mb-4" />
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-700 mb-6">{post.content}</p>

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-2">Comments</h2>
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <ul className="space-y-2">
            {comments.map((c) => (
              <li key={c._id} className="border p-2 rounded">
                <p className="font-medium">{c.user?.name || "Anonymous"}</p>
                <p className="text-sm text-gray-700">{c.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {token ? (
        <CommentForm postId={postId} onCommentAdded={setComments} />
      ) : (
        <p className="text-blue-600 mt-4">Login to comment on this post.</p>
      )}
    </div>
  )
}
