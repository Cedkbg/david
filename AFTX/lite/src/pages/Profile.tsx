import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3x3, Bookmark, Heart, Lock, LogOut, Settings, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useFollowStats } from "@/hooks/useFollow";
import { useUserVideos } from "@/hooks/useVideo";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: profile } = useProfile(user?.id);
  const { data: stats } = useFollowStats(user?.id);
  const { data: videos } = useUserVideos(user?.id);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (!profile) {
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
      {/* Header with actions */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <h1 className="text-xl font-bold">@{profile.username}</h1>
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" onClick={() => navigate("/settings")}>
            <Settings className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 border-2 border-border">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback>{profile.username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>

          <h2 className="mt-4 text-xl font-bold">
            {profile.display_name || profile.username}
          </h2>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-6">
            <div className="text-center">
              <div className="text-lg font-bold">{stats?.following || 0}</div>
              <div className="text-xs text-muted-foreground">Suivis</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{stats?.followers || 0}</div>
              <div className="text-xs text-muted-foreground">Abonnés</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{videos?.length || 0}</div>
              <div className="text-xs text-muted-foreground">Vidéos</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-2 w-full max-w-md">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/edit-profile")}>
              Modifier le profil
            </Button>
            <Button variant="outline" onClick={() => navigate("/interests")}>
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="mt-4 text-sm text-center text-muted-foreground">{profile.bio}</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="w-full grid grid-cols-4 border-t border-b border-border bg-transparent rounded-none h-12">
          <TabsTrigger value="videos" className="data-[state=active]:bg-transparent">
            <Grid3x3 className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="saved" className="data-[state=active]:bg-transparent">
            <Bookmark className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="liked" className="data-[state=active]:bg-transparent">
            <Heart className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="private" className="data-[state=active]:bg-transparent">
            <Lock className="h-5 w-5" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="mt-0">
          {videos && videos.length > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="aspect-[9/16] relative overflow-hidden bg-card cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    backgroundImage: `url(${video.thumbnail_url || video.video_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute bottom-2 left-2 text-xs font-semibold text-white drop-shadow-lg flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {video.likes_count}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Grid3x3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Aucune vidéo</p>
              <Button className="mt-4" onClick={() => navigate("/create")}>
                Créer une vidéo
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved">
          <div className="p-8 text-center text-muted-foreground">
            <Bookmark className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Aucune vidéo sauvegardée</p>
          </div>
        </TabsContent>

        <TabsContent value="liked">
          <div className="p-8 text-center text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Aucune vidéo aimée</p>
          </div>
        </TabsContent>

        <TabsContent value="private">
          <div className="p-8 text-center text-muted-foreground">
            <Lock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Contenu privé</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
