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
    const confirmDelete = confirm("Initiate post deletion sequence?")
    if (!confirmDelete) return

    setIsDeleting(true)
    try {
      await axios.delete(`/posts/${post._id}`)
      alert("Post successfully vaporized!")
      router.refresh()
    } catch (err) {
      alert("Deletion failed - quantum interference detected")
    } finally {
      setIsDeleting(false)
    }
  }

  if (!post) return null

  return (
    <div className="backdrop-blur-lg bg-[rgba(255,255,255,0.08)] p-6 rounded-xl border border-[rgba(161,98,232,0.3)] shadow-lg hover:shadow-[0_0_30px_rgba(161,98,232,0.3)] transition-all duration-500 hover:-translate-y-1">
      {/* Holographic Cover Image */}
      <div className="relative overflow-hidden rounded-xl mb-6 h-52 group">
        <img
          src={post.coverImage || '/placeholder-image.jpg'}
          alt={post.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,232,222,0.2)] to-transparent pointer-events-none" />
      </div>

      {/* Post Content */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[#22223b] hover:text-[#a162e8] transition-colors duration-300 hover:drop-shadow-[0_0_10px_rgba(161,98,232,0.7)]">
          {post.title}
        </h2>
        
        <p className="text-[#22223b] line-clamp-3">
          {post.content.slice(0, 150)}...
        </p>
        
        <div className="flex justify-between items-center pt-3">
          <Link 
            href={`/posts/${post._id}`} 
            className="text-[#08e8de] font-medium hover:text-white flex items-center gap-2 transition-all duration-300 group"
          >
            <span>Explore Post</span>
            <span className="text-xl group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
          
          {/* Author Info */}
          <span className="text-sm text-[rgba(255,255,255,0.6)]">
            by {post.author?.name || 'Cosmic Traveler'}
          </span>
        </div>
      </div>

      {/* Quantum Controls (only for author) */}
      {!isLoading && user && user._id === post.author._id && (
        <div className="flex gap-4 mt-6 pt-4 border-t border-[rgba(161,98,232,0.3)]">
          <Link 
            href={`/edit/${post._id}`} 
            className="text-[#22223b] hover:text-[#08e8de] px-4 py-2 rounded-lg hover:bg-[rgba(8,232,222,0.2)] border border-[rgba(255,255,255,0.1)] transition-all duration-300 hover:border-[#08e8de] hover:scale-105 text-sm font-medium"
          >
            Modify
          </Link>
          <button 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="text-[#22223b] hover:text-[#a162e8] px-4 py-2 rounded-lg hover:bg-[rgba(161,98,232,0.2)] border border-[rgba(255,255,255,0.1)] transition-all duration-300 hover:border-[#a162e8] hover:scale-105 text-sm font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-[#a162e8] border-t-transparent rounded-full animate-spin"></span>
                Erasing...
              </>
            ) : 'Delete'}
          </button>
        </div>
      )}
    </div>
  )
}