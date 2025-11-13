import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVideos } from "@/hooks/useVideo";
import { useInterests } from "@/hooks/useInterests";

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: videos, isLoading } = useVideos();
  const { data: interests } = useInterests();

  // Get trending hashtags from real videos
  const getTrendingHashtags = () => {
    if (!videos) return [];
    
    const hashtagCounts = new Map<string, number>();
    videos.forEach((video) => {
      if (video.hashtags) {
        video.hashtags.forEach((tag: string) => {
          hashtagCounts.set(tag, (hashtagCounts.get(tag) || 0) + 1);
        });
      }
    });

    return Array.from(hashtagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({
        tag: `#${tag}`,
        count,
        views: `${(count * 127).toLocaleString()}`,
      }));
  };

  const trendingHashtags = getTrendingHashtags();

  // Get videos by category
  const getVideosByCategory = (category: string | null) => {
    if (!videos) return [];
    if (!category) return videos.slice(0, 12);
    return videos.filter((v) => v.category === category).slice(0, 12);
  };

  const filteredVideos = getVideosByCategory(selectedCategory);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold mb-4">Découvrir</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des utilisateurs, des hashtags..."
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="w-full grid grid-cols-2 bg-transparent border-b border-border rounded-none h-12">
          <TabsTrigger value="trending">Tendances</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="mt-0">
          {/* Trending Hashtags */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Hashtags tendances</h2>
            </div>
            {trendingHashtags.length > 0 ? (
              <div className="space-y-3">
                {trendingHashtags.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-card/80 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-semibold">{item.tag}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.count} publications · {item.views} vues
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Aucun hashtag tendance pour le moment</p>
              </div>
            )}
          </div>

          {/* Trending Videos */}
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Vidéos populaires</h2>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              </div>
            ) : filteredVideos.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    className="aspect-[9/16] relative overflow-hidden bg-card cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      backgroundImage: `url(${video.thumbnail_url || video.video_url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 text-xs font-semibold text-white drop-shadow-lg">
                      {video.likes_count > 0 && `❤️ ${video.likes_count}`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Aucune vidéo pour le moment</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-0">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Explorer par catégorie</h2>
            {interests && interests.length > 0 ? (
              <div className="space-y-3">
                {interests.map((interest) => {
                  const categoryVideos = videos?.filter((v) => v.category === interest.name) || [];
                  return (
                    <div
                      key={interest.id}
                      className="p-4 rounded-lg bg-card hover:bg-card/80 cursor-pointer transition-colors"
                      onClick={() => setSelectedCategory(interest.name)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{interest.icon}</span>
                          <div>
                            <h3 className="font-semibold">{interest.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {categoryVideos.length} vidéos
                            </p>
                          </div>
                        </div>
                      </div>
                      {categoryVideos.length > 0 && (
                        <div className="grid grid-cols-4 gap-1">
                          {categoryVideos.slice(0, 4).map((video) => (
                            <div
                              key={video.id}
                              className="aspect-square rounded overflow-hidden"
                              style={{
                                backgroundImage: `url(${video.thumbnail_url || video.video_url})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Aucune catégorie disponible</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Discover;
