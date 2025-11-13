import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useVideos, useFollowingVideos, usePersonalizedVideos } from "@/hooks/useVideo";
import { VideoCard } from "@/components/VideoCard";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"following" | "foryou">("foryou");
  const { data: allVideos, isLoading: isLoadingAll } = useVideos();
  const { data: followingVideos, isLoading: isLoadingFollowing } = useFollowingVideos(user?.id);
  const { data: personalizedVideos, isLoading: isLoadingPersonalized } = usePersonalizedVideos(user?.id);

  const videos = activeTab === "following" ? followingVideos : personalizedVideos || allVideos;
  const isLoading = activeTab === "following" ? isLoadingFollowing : isLoadingPersonalized || isLoadingAll;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center justify-center gap-8 px-4 py-3">
          <button
            onClick={() => setActiveTab("following")}
            className={`text-sm font-semibold transition-colors ${
              activeTab === "following" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Suivis
          </button>
          <button
            onClick={() => setActiveTab("foryou")}
            className={`text-lg font-bold transition-colors ${
              activeTab === "foryou" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Pour toi
          </button>
        </div>
      </div>

      {/* Video Feed */}
      <div className="pt-14">
        {videos && videos.length > 0 ? (
          videos.map((video) => <VideoCard key={video.id} video={video} />)
        ) : (
          <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Aucune vidéo pour le moment</p>
              <Button onClick={() => window.location.href = "/create"}>
                Créer la première vidéo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
