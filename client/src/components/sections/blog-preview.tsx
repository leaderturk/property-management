import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Calendar, BookOpen } from "lucide-react";
import type { BlogPost } from "@shared/schema";

export default function BlogPreview() {
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts", { published: "true" }],
  });

  const featuredPosts = blogPosts?.slice(0, 3) || [];

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageForCategory = (category: string | null) => {
    switch (category) {
      case "Yönetim":
        return "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300";
      case "Muhasebe":
        return "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300";
      case "Hukuki":
        return "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300";
      default:
        return "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300";
    }
  };

  const getAltTextForCategory = (category: string | null) => {
    switch (category) {
      case "Yönetim":
        return "Modern office interior representing management consulting services";
      case "Muhasebe":
        return "Financial documents and calculator representing accounting services";
      case "Hukuki":
        return "Legal consultation meeting with documents representing legal advisory services";
      default:
        return "Professional business environment representing property management services";
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">Bloglar ve Haberler</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Kayseri'de bina ve site yönetimi konularında güncel haberler, 
            derinlemesine makaleler ve pratik ipuçları.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : featuredPosts.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Yakında yeni makaleler
            </h3>
            <p className="text-muted-foreground">
              Bina yönetimi konularında güncel içerikler hazırlanıyor
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover-lift group">
                <div className="relative h-48">
                  <img 
                    src={getImageForCategory(post.category)} 
                    alt={getAltTextForCategory(post.category)} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    {post.category && (
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                    )}
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(post.createdAt!)}
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt || post.content.substring(0, 150) + "..."}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Button 
                    variant="ghost" 
                    className="group-hover:text-primary transition-colors p-0 h-auto"
                    data-testid={`button-read-post-${post.id}`}
                  >
                    Devamını Oku
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/blog">
            <Button size="lg" data-testid="button-all-blog-posts">
              Tüm Makaleleri Görüntüle
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
