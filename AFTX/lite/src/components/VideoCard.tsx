import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLikeVideo, useCheckLike, useShareVideo } from "@/hooks/useVideo";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CommentSection } from "./CommentSection";

interface VideoCardProps {
  video: {
    id: string;
    user_id: string;
    caption: string;
    thumbnail_url: string;
    video_url: string;
    likes_count: number;
    comments_count: number;
    shares_count: number;
    profiles: {
      username: string;
      avatar_url?: string;
      is_verified?: boolean;
    };
  };
}

export const VideoCard = ({ video }: VideoCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const likeVideo = useLikeVideo();
  const shareVideo = useShareVideo();
  const { data: isLiked } = useCheckLike(video.id, user?.id);
  const [localLikesCount, setLocalLikesCount] = useState(video.likes_count);
  const [localSharesCount, setLocalSharesCount] = useState(video.shares_count);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Optimistic update
    setLocalLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    await likeVideo.mutateAsync({
      videoId: video.id,
      userId: user.id,
    });
  };

  const handleShare = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Optimistic update
    setLocalSharesCount((prev) => prev + 1);

    await shareVideo.mutateAsync({
      videoId: video.id,
    });
  };

  return (
    <div
      className="relative h-[calc(100vh-8rem)] w-full snap-start"
      style={{
        backgroundImage: `url(${video.thumbnail_url || video.video_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-4">
        {/* Left side - Video info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">@{video.profiles.username}</span>
          </div>
          <p className="text-sm text-foreground line-clamp-2">{video.caption}</p>
        </div>

        {/* Right side - Actions */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "h-12 w-12 rounded-full backdrop-blur",
                isLiked
                  ? "bg-cedlite-pink/80 text-white hover:bg-cedlite-pink"
                  : "bg-card/50 hover:bg-card/70"
              )}
              onClick={handleLike}
            >
              <Heart className={cn("h-6 w-6", isLiked && "fill-current")} />
            </Button>
            <span className="text-xs font-semibold">{localLikesCount}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-12 w-12 rounded-full bg-card/50 backdrop-blur hover:bg-card/70"
              onClick={() => setShowComments(true)}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            <span className="text-xs font-semibold">{video.comments_count}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-12 w-12 rounded-full bg-card/50 backdrop-blur hover:bg-card/70"
            >
              <Bookmark className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-12 w-12 rounded-full bg-card/50 backdrop-blur hover:bg-card/70"
              onClick={handleShare}
            >
              <Share2 className="h-6 w-6" />
            </Button>
            <span className="text-xs font-semibold">{localSharesCount}</span>
          </div>
        </div>
      </div>

      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Commentaires</DialogTitle>
          </DialogHeader>
          <CommentSection videoId={video.id} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
