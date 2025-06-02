"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleImageError = (articleId: string) => {
    setImageErrors((prev) => ({ ...prev, [articleId]: true }));
  };

  const handleArticleClick = (articleId: string) => {
    router.push(`/${articleId}`);
  };

  const retryFetch = () => {
    setError(null);
    fetchNews();
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await axios.get<NewsApiResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/news/`
      );

      const articles = result.data;

      setArticles(articles.articles);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Failed to load articles. Please try again.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="my-10 grid grid-cols-1 gap-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="border border-slate-300 p-2 rounded-lg flex items-center animate-pulse"
          >
            <div className="w-1/5">
              <div className="w-full h-32 bg-gray-300 rounded-lg"></div>
            </div>
            <div className="w-4/5 px-4">
              <div className="h-8 bg-gray-300 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-300 rounded-lg mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded-lg w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="my-10 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">{error}</p>
        <button
          onClick={retryFetch}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty State
  if (articles.length === 0) {
    return (
      <div className="my-10 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-6xl mb-4">📰</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          No Articles Available
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          There are no news articles at the moment. Please check back later.
        </p>
        <button
          onClick={retryFetch}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium cursor-pointer"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">latest News</h1>
        <button
          onClick={retryFetch}
          className="px-4 py-2 border rounded-lg text-blue-500 hover:text-white hover:bg-blue-500 transition-colors font-medium cursor-pointer"
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {articles.map((article) => (
          <div
            key={article.id}
            className="border border-slate-300 p-2 rounded-lg hover:scale-[101%] transition-all cursor-pointer flex items-center"
            onClick={() => handleArticleClick(article.id)}
          >
            <div className="w-1/5">
              <Image
                src={
                  imageErrors[article.id] || !article.image
                    ? "https://placehold.co/400x400/png"
                    : article.image
                }
                alt={article.title || "Article image"}
                width={400}
                height={400}
                className="w-fit h-fit object-contain rounded-lg"
                onError={() => handleImageError(article.id)}
              />
            </div>
            <div className="w-4/5 px-4">
              <h2 className="font-medium text-4xl line-clamp-2">
                {article.title}
              </h2>
              {article.description && (
                <p className="mt-2 text-xl text-gray-600 line-clamp-2">
                  {article.description}...
                </p>
              )}
              <p className="mt-2 text-lg text-gray-700 line-clamp-3">
                {article.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
