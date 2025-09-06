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
      alert("Failed to delete post")
    } finally {
      setIsDeleting(false)
    }
  }

  if (!post) return null

  return (
    <div className="relative">
      {/* Main Card Container */}
      <div className="flex flex-col md:flex-row gap-6  p-6 rounded-lg border border-gray-600 hover:border-gray-600 transition-all duration-300">
        {/* Content on the left */}
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-bold text-white hover:text-teal-400 transition-colors duration-300">
            {post.title}
          </h2>
          
          <p className="text-gray-300 line-clamp-3">
            {post.content.slice(0, 150)}...
          </p>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-3">
            <Link 
              href={`/posts/${post._id}`} 
              className="text-teal-400 font-medium hover:text-teal-300 flex items-center gap-2 transition-all duration-300 group"
            >
              <span>Read More</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
            
            {/* Author Info */}
            <span className="text-sm text-gray-400">
              by {post.author?.name || 'Anonymous'}
            </span>
          </div>

          {/* Author Controls */}
          {!isLoading && user && user._id === post.author._id && (
            <div className="flex gap-4 mt-6 pt-4 border-t border-gray-700">
              <Link 
                href={`/edit/${post._id}`} 
                className="text-white hover:text-teal-400 px-4 py-2 rounded hover:bg-gray-700 border border-gray-600 transition-all duration-300 text-sm font-medium"
              >
                Edit
              </Link>
              <button 
                onClick={handleDelete} 
                disabled={isDeleting}
                className="text-white hover:text-red-400 px-4 py-2 rounded hover:bg-gray-700 border border-gray-600 transition-all duration-300 text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
                    Deleting...
                  </>
                ) : 'Delete'}
              </button>
            </div>
          )}
        </div>

        {/* Image on the right */}
        <div className="w-full md:w-1/3 lg:w-1/4 aspect-[4/3] relative overflow-hidden rounded-lg group">
          <img
            src={post.coverImage || '/placeholder-image.jpg'}
            alt={post.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Subtle separator line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8"></div>
    </div>
  )
}