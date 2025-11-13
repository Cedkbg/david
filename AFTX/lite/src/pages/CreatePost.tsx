import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useInterests } from "@/hooks/useInterests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Video, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: interests } = useInterests();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [category, setCategory] = useState<string>("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const handlePublish = async () => {
    if (!user || !file) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("videos")
        .getPublicUrl(filePath);

      const hashtagsArray = hashtags
        .split(" ")
        .filter((tag) => tag.startsWith("#"))
        .map((tag) => tag.slice(1));

      const { error: insertError } = await supabase.from("videos").insert({
        user_id: user.id,
        video_url: publicUrl,
        thumbnail_url: publicUrl,
        caption,
        hashtags: hashtagsArray.length > 0 ? hashtagsArray : null,
        category: category || null,
      });

      if (insertError) throw insertError;

      toast.success("Publication créée avec succès!");
      navigate("/profile");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la publication");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="flex items-center justify-between px-4 pt-6 pb-4 border-b border-border">
        <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Créer une publication</h1>
        <Button onClick={handlePublish} disabled={uploading || !file}>
          {uploading ? "..." : "Publier"}
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {!file ? (
          <div className="space-y-4">
            <label
              htmlFor="video-upload"
              className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <Video className="h-12 w-12 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium">Ajouter une vidéo</span>
              <span className="text-xs text-muted-foreground mt-1">MP4, MOV, AVI</span>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>

            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <ImageIcon className="h-12 w-12 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium">Ajouter une image</span>
              <span className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP</span>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        ) : (
          <>
            <div className="relative rounded-lg overflow-hidden bg-card">
              {file.type.startsWith("video/") ? (
                <video src={preview} controls className="w-full max-h-96" />
              ) : (
                <img src={preview} alt="Preview" className="w-full max-h-96 object-cover" />
              )}
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => {
                  setFile(null);
                  setPreview("");
                }}
              >
                Supprimer
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="caption">Légende</Label>
                <Textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Écrivez une légende..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {interests?.map((interest) => (
                      <SelectItem key={interest.id} value={interest.name}>
                        {interest.icon} {interest.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hashtags">Hashtags</Label>
                <Input
                  id="hashtags"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="#fun #viral #trending"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
