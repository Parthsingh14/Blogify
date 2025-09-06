"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "@/lib/api"
import { Sparkle, Wand2, ArrowLeft } from "lucide-react"

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
  const [suggestedTitles, setSuggestedTitles] = useState([])
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false)

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

  const suggestTitle = async () => {
    if (!formData.content.trim()) {
      setError("Please enter some content to suggest a title")
      return
    }

    setIsSuggesting(true)
    setError("")
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/title-suggestion`, {
        content: formData.content
      })
      setSuggestedTitles([response.data.title])
    } catch (err) {
      setError(err.response?.data?.message || "Failed to suggest title. Please try again.")
      console.error("Title suggestion error:", err)
    } finally {
      setIsSuggesting(false)
    }
  }

  const checkGrammar = async () => {
    if (!formData.content.trim()) {
      setError("Please enter some content to check grammar")
      return
    }

    setIsCheckingGrammar(true)
    setError("")
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/grammar-correct`, {
        content: formData.content
      })
      setFormData({ ...formData, content: response.data.corrected })
    } catch (err) {
      setError(err.response?.data?.message || "Failed to check grammar. Please try again.")
      console.error("Grammar check error:", err)
    } finally {
      setIsCheckingGrammar(false)
    }
  }

  const selectTitle = (title) => {
    setFormData({ ...formData, title })
    setSuggestedTitles([])
  }

  const handleCancel = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen py-12 px-6 bg-gray-900">
      <div className="w-full bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 text-gray-300 hover:text-teal-400 transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-teal-400 to-teal-500 bg-clip-text text-transparent">
          Create New Post
        </h2>
        
        {error && (
          <div className="bg-gray-700 text-red-400 p-4 rounded-lg mb-6 text-center border border-gray-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                Post Title
              </label>
              {formData.content.trim() && (
                <button
                  type="button"
                  onClick={suggestTitle}
                  disabled={isSuggesting}
                  className={`text-xs font-medium flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isSuggesting
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600"
                      : "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 hover:border-teal-400"
                  }`}
                  title="Suggest AI Title"
                >
                  <Sparkle className="w-4 h-4" />
                  {isSuggesting ? (
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                      Thinking...
                    </span>
                  ) : (
                    "Suggest Title"
                  )}
                </button>
              )}
            </div>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              placeholder="An interesting title..."
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
              onChange={handleChange}
              required
            />
            {suggestedTitles.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-gray-400">Suggested titles:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTitles.map((title, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectTitle(title)}
                      className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 border border-gray-600 hover:border-teal-400"
                    >
                      {title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
              <label htmlFor="content" className="block text-sm font-medium text-gray-300">
                Post Content
              </label>
              {formData.content.trim() && (
                <button
                  type="button"
                  onClick={checkGrammar}
                  disabled={isCheckingGrammar}
                  className={`text-xs font-medium flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isCheckingGrammar
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600"
                      : "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 hover:border-teal-400"
                  }`}
                  title="Check Grammar"
                >
                  <Wand2 className="w-4 h-4" />
                  {isCheckingGrammar ? (
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                      Checking...
                    </span>
                  ) : (
                    "Check Grammar"
                  )}
                </button>
              )}
            </div>
            <textarea
              id="content"
              name="content"
              rows="8"
              placeholder="Write your post content here..."
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
              onChange={handleChange}
              value={formData.content}
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white transition-all duration-300"
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
              <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
                Cover Image
              </label>
              <div className="flex flex-col items-start gap-3">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  className="block w-full text-sm text-gray-300
                    file:mr-4 file:py-2 file:px-4 
                    file:rounded-lg file:border-0 
                    file:text-sm file:font-medium 
                    file:bg-gray-700 file:text-white
                    hover:file:bg-gray-600
                    transition-all duration-300"
                  onChange={handleChange}
                />
                {previewImage && (
                  <div className="mt-2 w-full h-40 rounded-lg overflow-hidden border border-gray-600">
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

          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 hover:border-teal-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
                isLoading
                  ? "bg-teal-600/60 text-white/70 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-500 text-white hover:shadow-lg"
              }`}
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
                  Publishing...
                </>
              ) : (
                "Publish Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}