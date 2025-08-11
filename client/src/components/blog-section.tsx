import { useQuery } from "@tanstack/react-query";
import { Wrench, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "./loading-spinner";
import type { BlogPost } from "@shared/schema";

export default function BlogSection() {
  const { data: featuredContent, isLoading } = useQuery({
    queryKey: ["/api/featured-content"],
  });

  const posts = featuredContent?.posts || [];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "MoM Tips": "#F56565",
      "Strategy": "#38B2AC",
      "Parenting": "#F59E0B",
      "Technique": "#38B2AC",
      "Family": "#10B981",
    };
    return colors[category] || "#6B7280";
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-kitchen-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-16 bg-kitchen-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Wrench className="text-tool-gray text-2xl mr-3" />
            <h2 className="font-industrial text-3xl md:text-4xl font-bold text-industrial-blue">
              MoM's Maintenance Manual
            </h2>
            <Wrench className="text-tool-gray text-2xl ml-3" />
          </div>
          <p className="text-tool-gray text-lg max-w-2xl mx-auto">
            Real stories, practical tips, and maintenance logs from the trenches of working motherhood.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: BlogPost) => (
            <Card key={post.id} className="bg-white rounded-xl overflow-hidden mechanical-shadow hover:transform hover:scale-105 transition-all duration-300" data-testid={`blog-card-${post.id}`}>
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <Badge
                    className="text-white px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: getCategoryColor(post.category) }}
                  >
                    {post.category}
                  </Badge>
                  <span className="text-tool-gray text-sm ml-3 flex items-center">
                    <Clock size={14} className="mr-1" />
                    {post.readTime} min read
                  </span>
                </div>
                <h3 className="font-bold text-xl mb-3 text-industrial-blue hover:text-energetic-orange transition-colors cursor-pointer" data-testid={`blog-title-${post.id}`}>
                  {post.title}
                </h3>
                <p className="text-tool-gray mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium text-sm" data-testid={`author-name-${post.id}`}>
                        {post.authorName}
                      </p>
                      <p className="text-tool-gray text-xs">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-energetic-orange hover:text-red-600 font-semibold"
                    data-testid={`button-read-post-${post.id}`}
                  >
                    <ArrowRight size={16} className="mr-1" />
                    Read
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="gear-border bg-white hover:bg-gray-50 text-tool-gray px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            data-testid="button-view-complete-manual"
          >
            <Wrench className="mr-2" size={20} />
            View Complete Manual
          </Button>
        </div>
      </div>
    </section>
  );
}
