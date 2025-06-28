"use client"
import { useEffect, useState } from "react"
import axios from "@/lib/api"
import PostCard from "@/components/PostCard"

export default function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get("/posts")
      setPosts(res.data.posts)
    }
    fetchPosts()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All Blog Posts</h1>
      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  )
}
