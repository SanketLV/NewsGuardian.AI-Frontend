"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleImageError = (articleId: string) => {
    setImageErrors((prev) => ({ ...prev, [articleId]: true }));
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const result = await axios.get<NewsApiResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/news/`
        );

        const articles = result.data;

        setArticles(articles.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
        setArticles([]);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="my-10 grid grid-cols-1 gap-4">
      {articles.map((article) => (
        <div
          key={article.id}
          className="border border-slate-300 p-2 rounded-lg hover:scale-[101%] transition-all cursor-pointer flex items-center"
          onClick={() => console.log("Article ID:", article.id)}
        >
          <div className="w-1/5">
            <Image
              src={
                imageErrors[article.id] || !article.image
                  ? "https://placehold.co/400x400/png"
                  : article.image
              }
              alt="article"
              width={400}
              height={400}
              className="w-fit h-fit object-contain rounded-lg"
              onError={() => handleImageError(article.id)}
            />
          </div>
          <div className="w-4/5 px-4">
            <h2 className="font-medium text-4xl">{article.title}</h2>
            <p className="mt-2 text-xl">{article.description}</p>
            <p className="mt-2 text-lg">{article.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
