import PostDetailPage from './PostDetailPage'
import { getPostForSEO } from '@/lib/getPostForSEO'

export async function generateMetadata({ params }) {

  const { postId } = await params;


  const post = await getPostForSEO(postId)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'This post does not exist.',
    }
  }

  return {
    title: post.title,
    description: post.content?.slice(0, 150),
    openGraph: {
      title: post.title,
      description: post.content?.slice(0, 150),
      url: `https://blogify.netlify.app/posts/${postId}`,
      images: [
        {
          url: post.coverImage || '/default-og.png',
          width: 800,
          height: 600,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.content?.slice(0, 150),
      images: [post.coverImage || '/default-og.png'],
    },
  }
}

export default function Page({ params }) {
  return <PostDetailPage />
}
