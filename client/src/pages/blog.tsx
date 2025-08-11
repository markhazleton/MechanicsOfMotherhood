import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Clock, ArrowRight } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import LoadingSpinner from "@/components/loading-spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: blogData, isLoading } = useQuery({
    queryKey: ["/api/blog-posts", { page, category: selectedCategory, limit: 9 }],
  });

  const posts = blogData?.posts || [];
  const pagination = blogData?.pagination;

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Search:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <Navigation />
      
      {/* Header */}
      <section className="bg-white py-12 border-b border-medium-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="font-mechanical text-4xl font-bold text-industrial-blue mb-4">
              MoM's Maintenance Manual
            </h1>
            <p className="text-tool-gray text-lg max-w-2xl mx-auto">
              Real stories, practical tips, and wisdom from the working motherhood trenches
            </p>
          </div>

          {/* Search */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tool-gray" size={16} />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="blog-search-input"
                />
              </div>
            </form>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-medium-gray rounded-lg focus:ring-2 focus:ring-workshop-teal"
              data-testid="blog-category-filter"
            >
              <option value="">All Categories</option>
              <option value="MoM Tips">MoM Tips</option>
              <option value="Strategy">Strategy</option>
              <option value="Parenting">Parenting</option>
              <option value="Technique">Technique</option>
              <option value="Family">Family</option>
            </select>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
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
                      <h3 className="font-bold text-xl mb-3 text-industrial-blue hover:text-energetic-orange transition-colors cursor-pointer">
                        {post.title}
                      </h3>
                      <p className="text-tool-gray mb-4 line-clamp-3">
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
                            <p className="font-medium text-sm">{post.authorName}</p>
                            <p className="text-tool-gray text-xs">
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-energetic-orange hover:text-red-600 font-semibold"
                          data-testid={`read-post-${post.id}`}
                        >
                          <ArrowRight size={16} className="mr-1" />
                          Read
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination && (
                <div className="flex items-center justify-center space-x-4 mt-12">
                  <Button
                    variant="outline"
                    disabled={!pagination.hasPrev}
                    onClick={() => setPage(page - 1)}
                    data-testid="blog-pagination-prev"
                  >
                    Previous
                  </Button>
                  <span className="text-tool-gray">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={!pagination.hasNext}
                    onClick={() => setPage(page + 1)}
                    data-testid="blog-pagination-next"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
