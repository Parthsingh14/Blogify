"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getUserFromToken } from "@/lib/auth"
import axios from "@/lib/api"

export default function PostCard({ post }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const u = await getUserFromToken()
        setUser(u)
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this post?")
    if (!confirmDelete) return

    setIsDeleting(true)
    try {
      await axios.delete(`/posts/${post._id}`)
      alert("Post deleted successfully!")
      router.refresh()
    } catch (err) {
      alert("Failed to delete post.")
    } finally {
      setIsDeleting(false)
    }
  }

  if (!post) return null

  return (
    <div className="bg-[#ffeedb] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-[#ffdec7]">
      {/* Cover Image */}
      <div className="relative overflow-hidden rounded-lg mb-4 h-48">
        <img
          src={post.coverImage || '/placeholder-image.jpg'}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Post Content */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-[#493129] hover:text-[#8b597b] transition-colors duration-200">
          {post.title}
        </h2>
        
        <p className="text-[#493129] line-clamp-3">
          {post.content.slice(0, 150)}...
        </p>
        
        <div className="flex justify-between items-center pt-2">
          <Link 
            href={`/posts/${post._id}`} 
            className="text-[#8b597b] font-medium hover:text-[#493129] flex items-center gap-1 transition-colors duration-200"
          >
            Read More
            <span className="text-lg">→</span>
          </Link>
          
          {/* Author Info */}
          <span className="text-sm text-[#8b597b]">
            by {post.author?.name || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Edit/Delete Actions (only for author) */}
      {!isLoading && user && user._id === post.author._id && (
        <div className="flex gap-4 mt-4 pt-4 border-t border-[#efa3a0]/30">
          <Link 
            href={`/edit/${post._id}`} 
            className="text-[#493129] hover:text-[#8b597b] px-3 py-1 rounded-md hover:bg-[#ffdec7] transition-all duration-200 text-sm font-medium"
          >
            Edit
          </Link>
          <button 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="text-[#493129] hover:text-[#efa3a0] px-3 py-1 rounded-md hover:bg-[#ffdec7] transition-all duration-200 text-sm font-medium flex items-center gap-1 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-[#efa3a0] border-t-transparent rounded-full animate-spin"></span>
                Deleting...
              </>
            ) : 'Delete'}
          </button>
        </div>
      )}
    </div>
  )
}