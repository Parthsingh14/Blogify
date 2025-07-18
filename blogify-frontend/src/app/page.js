"use client"
import { useEffect, useState, useCallback } from "react"
import axios from "@/lib/api"
import PostCard from "@/components/PostCard"

export default function Home() {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTimeout, setSearchTimeout] = useState(null)

  const limit = 4 // posts per page

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`/posts`, {
        params: {
          search,
          category,
          page,
          limit,
        },
      })
      setPosts(res.data.posts)
      setTotalPages(res.data.pages)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [search, category, page, limit])

  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout)
    
    setSearchTimeout(setTimeout(() => {
      setPage(1)
      fetchPosts()
    }, 500))

    return () => clearTimeout(searchTimeout)
  }, [search, category])

  useEffect(() => {
    fetchPosts()
  }, [page, fetchPosts])

  const renderLoadingSkeletons = () => {
    return Array(limit).fill(0).map((_, index) => (
      <div 
        key={index} 
        className="backdrop-blur-md bg-[rgba(255,255,255,0.05)] border border-[rgba(161,98,232,0.3)] rounded-xl p-6 animate-pulse"
      >
        <div className="h-7 w-3/4 bg-[rgba(161,98,232,0.2)] rounded-full mb-4"></div>
        <div className="h-4 w-full bg-[rgba(255,255,255,0.1)] rounded-full mb-2"></div>
        <div className="h-4 w-2/3 bg-[rgba(255,255,255,0.1)] rounded-full mb-6"></div>
        <div className="h-10 w-28 bg-gradient-to-r from-[rgba(161,98,232,0.3)] to-[rgba(8,232,222,0.3)] rounded-full"></div>
      </div>
    ))
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-6 py-8">

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search across the cosmos..."
          className="backdrop-blur-md bg-[rgba(255,255,255,0.1)] border border-[rgba(161,98,232,0.3)] p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a162e8] focus:border-transparent text-[#e0e0ff] placeholder-[rgba(224,224,255,0.6)] transition-all duration-300 hover:border-[#08e8de]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="backdrop-blur-md bg-[rgba(255,255,255,0.1)] border border-[rgba(161,98,232,0.3)] p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a162e8] focus:border-transparent text-[#e0e0ff] transition-all duration-300 hover:border-[#08e8de]"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Dimensions</option>
          <option value="tech">Quantum Tech</option>
          <option value="lifestyle">Nebula Lifestyle</option>
          <option value="education">Cosmic Education</option>
        </select>
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div className="space-y-6">
          {renderLoadingSkeletons()}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 backdrop-blur-md bg-[rgba(255,255,255,0.05)] rounded-xl border border-[rgba(161,98,232,0.3)]">
          <p className="text-[#08e8de] text-xl mb-6">No celestial posts found in this quadrant.</p>
          <button 
            onClick={() => {
              setSearch("")
              setCategory("")
              setPage(1)
            }}
            className="px-6 py-3 bg-gradient-to-r from-[#a162e8] to-[#08e8de] text-[#121212] font-medium rounded-xl hover:shadow-[0_0_20px_rgba(161,98,232,0.5)] transition-all duration-300 hover:scale-105"
          >
            Reset Stellar Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-12">
          <button
            disabled={page === 1 || isLoading}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-6 py-3 rounded-xl transition-all duration-300 ${
              page === 1 || isLoading
                ? "bg-[rgba(255,255,255,0.05)] text-[rgba(224,224,255,0.5)] border border-[rgba(255,255,255,0.1)] cursor-not-allowed"
                : "bg-[rgba(161,98,232,0.3)] text-[#e0e0ff] hover:bg-[rgba(161,98,232,0.5)] hover:shadow-[0_0_15px_rgba(161,98,232,0.3)] hover:scale-105"
            }`}
          >
            ← Previous
          </button>
          <span className="px-6 py-3 text-[#e0e0ff] flex items-center backdrop-blur-md bg-[rgba(255,255,255,0.05)] rounded-xl border border-[rgba(161,98,232,0.3)]">
            {`Stellar Page ${page} of ${totalPages}`}
          </span>
          <button
            disabled={page === totalPages || isLoading}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-6 py-3 rounded-xl transition-all duration-300 ${
              page === totalPages || isLoading
                ? "bg-[rgba(255,255,255,0.05)] text-[rgba(224,224,255,0.5)] border border-[rgba(255,255,255,0.1)] cursor-not-allowed"
                : "bg-[rgba(161,98,232,0.3)] text-[#e0e0ff] hover:bg-[rgba(161,98,232,0.5)] hover:shadow-[0_0_15px_rgba(161,98,232,0.3)] hover:scale-105"
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}