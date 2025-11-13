import { Button } from "@/components/ui/button";
import { Video, Image as ImageIcon, Music, Sparkles } from "lucide-react";

const Create = () => {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-center">Créer</h1>
        </div>
      </div>

      {/* Create Options */}
      <div className="p-4 space-y-4 mt-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Créer du contenu</h2>
          <p className="text-muted-foreground">Choisissez comment vous souhaitez créer</p>
        </div>

        <Button
          className="w-full h-20 text-lg bg-gradient-to-r from-cedlite-pink to-cedlite-cyan hover:opacity-90"
          size="lg"
        >
          <Video className="h-6 w-6 mr-3" />
          Enregistrer une vidéo
        </Button>

        <Button variant="outline" className="w-full h-20 text-lg" size="lg">
          <ImageIcon className="h-6 w-6 mr-3" />
          Importer depuis la galerie
        </Button>

        <Button variant="outline" className="w-full h-20 text-lg" size="lg">
          <Music className="h-6 w-6 mr-3" />
          Utiliser un son
        </Button>

        <Button variant="outline" className="w-full h-20 text-lg" size="lg">
          <Sparkles className="h-6 w-6 mr-3" />
          Effet et filtres
        </Button>
      </div>

      {/* Template Section */}
      <div className="p-4 mt-8">
        <h3 className="text-lg font-bold mb-4">Templates populaires</h3>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="aspect-[9/16] rounded-lg bg-card border border-border flex items-center justify-center cursor-pointer hover:bg-card/80 transition-colors"
            >
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Create;
