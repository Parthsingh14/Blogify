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
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken) {
      router.push("/login?redirect=/create-post")
    }
  }, [])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setError("")
    
    if (name === "image") {
      const file = files[0]
      setFormData({ ...formData, image: file })
      
      // Create image preview
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewImage(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        setPreviewImage(null)
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isLoading) return
    
    setIsLoading(true)
    setError("")

    try {
      const data = new FormData()
      data.append("title", formData.title)
      data.append("content", formData.content)
      data.append("category", formData.category)
      if (formData.image) {
        data.append("coverImage", formData.image)
      }

      await axios.post("/posts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      router.push("/")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post. Please try again.")
      console.error("Create post error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#ffeedb] py-8 px-4">
      <div className="max-w-3xl mx-auto bg-[#ffdec7] p-8 rounded-lg shadow-lg border border-[#efa3a0]/30">
        <h2 className="text-3xl font-bold text-[#493129] mb-6 text-center">Create New Post</h2>
        
        {error && (
          <div className="bg-[#efa3a0] text-[#493129] p-3 rounded-md mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[#493129] mb-1">
              Post Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="An interesting title..."
              className="w-full px-4 py-3 rounded-lg border border-[#efa3a0] focus:outline-none focus:ring-2 focus:ring-[#8b597b] focus:border-transparent bg-[#ffeedb] text-[#493129]"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-[#493129] mb-1">
              Post Content
            </label>
            <textarea
              id="content"
              name="content"
              rows="8"
              placeholder="Write your post content here..."
              className="w-full px-4 py-3 rounded-lg border border-[#efa3a0] focus:outline-none focus:ring-2 focus:ring-[#8b597b] focus:border-transparent bg-[#ffeedb] text-[#493129]"
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-[#493129] mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="w-full px-4 py-3 rounded-lg border border-[#efa3a0] focus:outline-none focus:ring-2 focus:ring-[#8b597b] focus:border-transparent bg-[#ffeedb] text-[#493129]"
                onChange={handleChange}
                value={formData.category}
              >
                <option value="tech">Technology</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="education">Education</option>
                <option value="travel">Travel</option>
                <option value="food">Food</option>
              </select>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-[#493129] mb-1">
                Cover Image
              </label>
              <div className="flex flex-col items-start gap-3">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  className="block w-full text-sm text-[#493129] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#8b597b] file:text-[#ffeedb] hover:file:bg-[#493129] transition-colors duration-200"
                  onChange={handleChange}
                />
                {previewImage && (
                  <div className="mt-2 w-full h-40 rounded-lg overflow-hidden border border-[#efa3a0]">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center ${
              isLoading
                ? "bg-[#8b597b]/70 text-[#ffeedb] cursor-not-allowed"
                : "bg-[#8b597b] text-[#ffeedb] hover:bg-[#493129]"
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </>
            ) : (
              "Publish Post"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}