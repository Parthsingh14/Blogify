"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "@/lib/api"

export default function CreatePostPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "tech",
    image: null,
  })

  const [error, setError] = useState("")
  const [token, setToken] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken) {
      router.push("/login")
    } else {
      setToken(storedToken)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === "image") {
      setFormData({ ...formData, image: files[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append("title", formData.title)
    data.append("content", formData.content)
    data.append("category", formData.category)
    data.append("coverImage", formData.image)

    try {
      await axios.post("/posts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      router.push("/")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post")
    }
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          rows="5"
          placeholder="Post Content"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        ></textarea>
        <select
          name="category"
          className="border p-2 rounded w-full"
          onChange={handleChange}
          value={formData.category}
        >
          <option value="tech">Tech</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="education">Education</option>
        </select>
        <input
          type="file"
          name="image"
          accept="image/*"
          className="w-full"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Submit Post
        </button>
      </form>
    </div>
  )
}
