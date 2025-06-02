"use client";

import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ArticleDetailsPage = () => {
  const { articleId } = useParams();
  const router = useRouter();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await axios.get<SingleNewsApiResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/news/${articleId}`
      );

      console.log(result.data);

      const article = result.data;

      setArticle(article.article);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching article:", error);
      if (error.response && error.response.status === 404) {
        setError("Article not found");
      } else {
        setError("Failed to load article. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const retryFetch = () => {
    setError(null);
    fetchArticle();
  };

  useEffect(() => {
    if (articleId) {
      fetchArticle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  // Loading State
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto my-10 px-4">
        <div className="mb-6">
          <div className="w-24 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
          <div className="h-96 w-full bg-gray-300"></div>

          <div className="p-8">
            <div className="h-10 bg-gray-300 rounded mb-4"></div>
            <div className="h-6 bg-gray-300 rounded mb-6 w-3/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-10 px-4">
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Back to Articles
        </button>

        <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white rounded-lg shadow-lg p-8">
          <div className=" text-6xl mb-4">
            {error === "Article not found" ? "📄" : "⚠️"}
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {error === "Article not found"
              ? "Article Not Found"
              : "Something went wrong."}
          </h2>
          <p className="text-gray-600 mb-6 max-w-md">
            {error === "Article not found"
              ? "The article you are looking for doesn't exist or has been removed."
              : error}
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Go Back
            </button>
            {error !== "Article not found" && (
              <button
                onClick={retryFetch}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Article not found (shouldn't happen with proper error handling above, but just in case)
  if (!article) {
    return (
      <div className="max-w-4xl mx-auto my-10 px-4">
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Back to Articles
        </button>

        <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white rounded-lg shadow-lg p-8">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Article Not Available
          </h2>
          <p className="text-gray-600 mb-6">
            This article is currently not available.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  console.log("Article:", article);

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        ← Back to Articles
      </button>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96 w-full">
          <Image
            src={
              imageError || !article.image
                ? "https://placehold.co/800x400/png"
                : article.image
            }
            alt={article.title || "Article image"}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        </div>

        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            {article.title}
          </h1>

          {article.description && (
            <p className="text-xl text-gray-600 mb-6 font-medium leading-relaxed">
              {article.description}
            </p>
          )}

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
              {article.content}
            </p>
          </div>

          {/* Article metadata */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {article.publishedAt && (
                <span>
                  Published:{" "}
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              )}
              {/* {article.author && <span>Author: {article.author}</span>} */}
              {article.source && <span>Source: {article.source.name} </span>}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetailsPage;
