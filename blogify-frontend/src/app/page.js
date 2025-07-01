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

  // Memoized fetch function with debouncing
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

  // Debounce search input
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout)
    
    setSearchTimeout(setTimeout(() => {
      setPage(1) // Reset to first page on new search
      fetchPosts()
    }, 500))

    return () => clearTimeout(searchTimeout)
  }, [search, category])

  // Fetch posts when page changes
  useEffect(() => {
    fetchPosts()
  }, [page, fetchPosts])

  // Loading skeleton for posts
  const renderLoadingSkeletons = () => {
    return Array(limit).fill(0).map((_, index) => (
      <div key={index} className="border border-[#ffdec7] rounded-lg p-4 animate-pulse">
        <div className="h-6 w-3/4 bg-[#ffdec7] rounded mb-3"></div>
        <div className="h-4 w-full bg-[#ffdec7] rounded mb-2"></div>
        <div className="h-4 w-2/3 bg-[#ffdec7] rounded mb-4"></div>
        <div className="h-8 w-24 bg-[#efa3a0] rounded"></div>
      </div>
    ))
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#493129]">All Blog Posts</h1>

      {/* 🔍 Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search posts..."
          className="border border-[#efa3a0] p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#8b597b] focus:border-transparent text-[#493129]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-[#efa3a0] p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b597b] focus:border-transparent text-[#493129] bg-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="tech">Tech</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="education">Education</option>
        </select>
      </div>

      {/* 📦 Posts List */}
      {isLoading ? (
        <div className="space-y-4">
          {renderLoadingSkeletons()}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#8b597b] text-lg">No posts found matching your criteria.</p>
          <button 
            onClick={() => {
              setSearch("")
              setCategory("")
              setPage(1)
            }}
            className="mt-4 px-4 py-2 bg-[#efa3a0] text-[#493129] rounded-lg hover:bg-[#8b597b] hover:text-[#ffeedb] transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {/* 🔁 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            disabled={page === 1 || isLoading}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              page === 1 || isLoading
                ? "bg-[#ffdec7] text-[#493129]/50 cursor-not-allowed"
                : "bg-[#8b597b] text-[#ffeedb] hover:bg-[#493129]"
            }`}
          >
            Prev
          </button>
          <span className="px-4 py-2 text-[#493129] flex items-center">
            {`Page ${page} of ${totalPages}`}
          </span>
          <button
            disabled={page === totalPages || isLoading}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              page === totalPages || isLoading
                ? "bg-[#ffdec7] text-[#493129]/50 cursor-not-allowed"
                : "bg-[#8b597b] text-[#ffeedb] hover:bg-[#493129]"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}