import { useState, useEffect } from "react";
import { articles as defaultArticles } from "../data/articles";
import { Article } from "../types";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Calendar, Newspaper, Loader2 } from "../lib/icons";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { projectId } from "../utils/supabase/info";

export function Articles() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>(defaultArticles);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server/articles`
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setArticles(data);
        } else {
          setArticles(defaultArticles);
        }
      }
    } catch (error) {
      console.log("Using default articles:", error);
      setArticles(defaultArticles);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedArticle(null)}
            className="mb-4 sm:mb-6 hover:bg-green-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Artikel
          </Button>

          <article>
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-6 sm:mb-8 shadow-lg">
              <ImageWithFallback
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center space-x-2 text-gray-500 mb-4 text-sm">
                <div className="w-8 h-8 bg-linear-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <span>{formatDate(selectedArticle.date)}</span>
              </div>

              <h1 className="bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-6 text-2xl sm:text-3xl lg:text-4xl">
                {selectedArticle.title}
              </h1>

              <div className="prose prose-green max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {selectedArticle.content}
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-orange-100 to-orange-200 rounded-full mb-4 shadow-md">
            <Newspaper className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600" />
          </div>
          <h1 className="bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent mb-2 text-2xl sm:text-3xl md:text-4xl font-bold">
            Artikel Kesehatan
          </h1>
          <p className="text-gray-700 text-sm sm:text-base px-4">
            Pelajari tips dan informasi tentang pola makan sehat
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((article, index) => {
            const cardColors = [
              {
                bg: "from-green-50 to-emerald-50",
                border: "border-green-200",
                badge: "bg-green-600",
              },
              {
                bg: "from-blue-50 to-cyan-50",
                border: "border-blue-200",
                badge: "bg-blue-600",
              },
              {
                bg: "from-purple-50 to-pink-50",
                border: "border-purple-200",
                badge: "bg-purple-600",
              },
            ];
            const colorScheme = cardColors[index % cardColors.length];

            return (
              <Card
                key={article.id}
                className={`overflow-hidden hover:shadow-xl transition-all cursor-pointer group bg-linear-to-br ${colorScheme.bg} border-2 ${colorScheme.border} hover:-translate-y-1`}
                onClick={() => setSelectedArticle(article)}
              >
                <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
                  <ImageWithFallback
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge
                    className={`absolute top-3 left-3 ${colorScheme.badge} text-white shadow-md`}
                  >
                    Artikel
                  </Badge>
                </div>
                <CardContent className="pt-5 sm:pt-6">
                  <div className="flex items-center space-x-2 text-gray-500 text-xs sm:text-sm mb-3">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{formatDate(article.date)}</span>
                  </div>
                  <h3 className="text-gray-900 mb-3 text-base sm:text-lg font-semibold line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-green-600 hover:text-green-700 font-semibold text-sm"
                  >
                    Baca Selengkapnya →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
