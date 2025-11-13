import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useInterests, useSaveUserInterests } from "@/hooks/useInterests";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Interests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: interests, isLoading } = useInterests();
  const saveInterests = useSaveUserInterests();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId) ? prev.filter((id) => id !== interestId) : [...prev, interestId]
    );
  };

  const handleContinue = async () => {
    if (!user || selectedInterests.length === 0) return;

    await saveInterests.mutateAsync({
      userId: user.id,
      interestIds: selectedInterests,
    });

    navigate("/");
  };

  const handleSkip = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Vos centres d'intérêt</h1>
          <p className="text-muted-foreground">
            Sélectionnez au moins 3 catégories pour personnaliser votre fil d'actualité
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {interests?.map((interest) => (
            <Card
              key={interest.id}
              className={cn(
                "p-4 cursor-pointer transition-all hover:scale-105",
                selectedInterests.includes(interest.id)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card hover:bg-accent"
              )}
              onClick={() => toggleInterest(interest.id)}
            >
              <div className="text-center space-y-2">
                <div className="text-4xl">{interest.icon}</div>
                <p className="font-semibold">{interest.name}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={handleSkip}>
            Passer
          </Button>
          <Button
            onClick={handleContinue}
            disabled={selectedInterests.length < 3 || saveInterests.isPending}
          >
            {saveInterests.isPending ? "Sauvegarde..." : "Continuer"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Interests;
