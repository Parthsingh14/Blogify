"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "@/lib/api";
import PostCard from "@/components/PostCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const limit = 4; // posts per page

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/posts`, {
        params: {
          search,
          category,
          page,
          limit,
        },
      });
      setPosts(res.data.posts);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [search, category, page, limit]);

  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);

    setSearchTimeout(
      setTimeout(() => {
        setPage(1);
        fetchPosts();
      }, 500)
    );

    return () => clearTimeout(searchTimeout);
  }, [search, category]);

  useEffect(() => {
    fetchPosts();
  }, [page, fetchPosts]);

  // Show cold start toast if loading takes more than 10s
  useEffect(() => {
    let timer;
    if (isLoading && !sessionStorage.getItem("shownColdStartMessage")) {
      timer = setTimeout(() => {
        toast.info(
          "⚡ This project is hosted on free-tier services. First load may take a few seconds due to cold start.",
          {
            position: "right-top",
            theme: "dark",
          }
        );
        sessionStorage.setItem("shownColdStartMessage", "true");
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  const renderLoadingSkeletons = () => {
    return Array(limit)
      .fill(0)
      .map((_, index) => (
        <div
          key={index}
          className="bg-gray-800 border border-gray-700 rounded-lg p-6 animate-pulse space-y-4"
        >
          <div className="h-7 w-3/4 bg-gray-700 rounded-full"></div>
          <div className="h-4 w-full bg-gray-700 rounded-full"></div>
          <div className="h-4 w-2/3 bg-gray-700 rounded-full"></div>
          <div className="h-10 w-28 bg-gray-700 rounded-full mt-4"></div>
        </div>
      ));
  };

  return (
    <div className="space-y-8 px-2 py-8 ml-0 md:ml-12 lg:ml-24 lg:mr-24">
      {/* Toast notifications */}
      <ToastContainer
        position="right-top"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{
          zIndex: 9999,
          top: 50,
        }}
      />

      {/* Search + Filter - Left aligned */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full">
        <input
          type="text"
          placeholder="Search posts..."
          className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 w-full sm:w-auto flex-grow"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white transition-all duration-300 w-full sm:w-auto"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="tech">Tech</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="education">Education</option>
        </select>
      </div>

      {/* Posts List - Left aligned */}
      {isLoading ? (
        <div className="space-y-6">{renderLoadingSkeletons()}</div>
      ) : posts.length === 0 ? (
        <div className="py-16 bg-gray-800 rounded-lg border border-gray-700 text-left">
          <p className="text-teal-400 text-xl mb-6">
            No posts found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("");
              setPage(1);
            }}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-all duration-300"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination - Left aligned */}
      {totalPages > 1 && (
        <div className="flex flex-wrap gap-4 mt-12">
          <button
            disabled={page === 1 || isLoading}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              page === 1 || isLoading
                ? "bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed"
                : "bg-gray-700 text-white hover:bg-gray-600 hover:text-teal-400"
            }`}
          >
            ← Previous
          </button>
          <span className="px-6 py-3 text-white flex items-center bg-gray-800 rounded-lg border border-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages || isLoading}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              page === totalPages || isLoading
                ? "bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed"
                : "bg-gray-700 text-white hover:bg-gray-600 hover:text-teal-400"
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
