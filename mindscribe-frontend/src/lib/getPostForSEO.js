import axios from './serverApi' // uses server-safe axios instance

export async function getPostForSEO(postId) {
  try {
    const response = await axios.get(`/posts/${postId}`)
    return response.data.post
  } catch (err) {
    console.error('SEO fetch error:', err.message)
    return null
  }
}
