"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "@/lib/api"
import { getUserFromToken } from "@/lib/auth"
import { ArrowLeft, Sparkle, Wand2 } from "lucide-react"

export default function EditPostPage() {
  const router = useRouter()
  const { postId } = useParams()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [suggestedTitles, setSuggestedTitles] = useState([])
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false)

  const user = getUserFromToken()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/posts/${postId}`)
        const post = res.data.post

        if (!user || user._id !== post.author._id) {
          router.push("/")
          return
        }

        setTitle(post.title)
        setContent(post.content)
        setCategory(post.category)
      } catch (err) {
        console.error(err)
        setError("Could not fetch post.")
      }
    }

    fetchPost()
  }, [postId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.put(`/posts/${postId}`, {
        title,
        content,
        category,
      })
      router.push(`/posts/${postId}`)
    } catch (err) {
      console.error(err)
      setError("Update failed.")
    } finally {
      setLoading(false)
    }
  }

  const suggestTitle = async () => {
    if (!content.trim()) {
      setError("Please enter some content to suggest a title")
      return
    }

    setIsSuggesting(true)
    setError("")
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/title-suggestion`, {
        content
      })
      setSuggestedTitles([response.data.title])
    } catch (err) {
      setError("Failed to suggest title. Please try again.")
      console.error("Title suggestion error:", err)
    } finally {
      setIsSuggesting(false)
    }
  }

  const checkGrammar = async () => {
    if (!content.trim()) {
      setError("Please enter some content to check grammar")
      return
    }

    setIsCheckingGrammar(true)
    setError("")
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/grammer-correct`, {
        content
      })
      setContent(response.data.corrected)
    } catch (err) {
      setError("Failed to check grammar. Please try again.")
      console.error("Grammar check error:", err)
    } finally {
      setIsCheckingGrammar(false)
    }
  }

  const selectTitle = (title) => {
    setTitle(title)
    setSuggestedTitles([])
  }

  return (
    <div className="min-h-screen py-12 px-6 bg-gray-900">
      <div className="max-w-3xl mx-6 md:ml-24 bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 text-gray-300 hover:text-teal-400 transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-teal-400 to-teal-500 bg-clip-text text-transparent">
          Edit Post
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
                Title
              </label>
              {content.trim() && (
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
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
                Content
              </label>
              {content.trim() && (
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
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="8"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white transition-all duration-300"
            >
              <option value="tech">Technology</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="education">Education</option>
              <option value="travel">Travel</option>
              <option value="food">Food</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push(`/posts/${postId}`)}
              disabled={loading}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 hover:border-teal-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
                loading
                  ? "bg-teal-600/60 text-white/70 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-500 text-white hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
                  Updating...
                </>
              ) : (
                "Update Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}