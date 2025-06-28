import Link from "next/link"

export default function PostCard({ post }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover rounded" />
      <h2 className="text-xl font-semibold mt-2">{post.title}</h2>
      <p className="text-sm text-gray-600 mt-1">{post.content.slice(0, 100)}...</p>
      <Link href={`/posts/${post._id}`} className="text-blue-600 mt-2 inline-block">
        Read More →
      </Link>
    </div>
  )
}
