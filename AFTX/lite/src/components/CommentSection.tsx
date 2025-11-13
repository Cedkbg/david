import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useComments, useAddComment, useDeleteComment, useReplies } from "@/hooks/useComments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CommentSectionProps {
  videoId: string;
}

const Comment = ({ comment, videoId }: { comment: any; videoId: string }) => {
  const { user } = useAuth();
  const deleteComment = useDeleteComment();
  const addComment = useAddComment();
  const { data: replies } = useReplies(comment.id);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = async () => {
    if (!user || !replyText.trim()) return;

    await addComment.mutateAsync({
      videoId,
      userId: user.id,
      text: replyText,
      parentCommentId: comment.id,
    });

    setReplyText("");
    setShowReplyInput(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.profiles?.avatar_url} />
          <AvatarFallback>{comment.profiles?.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{comment.profiles?.username}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm">{comment.text}</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Répondre
            </Button>
            {user?.id === comment.user_id && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-destructive"
                onClick={() => deleteComment.mutate({ commentId: comment.id, videoId })}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>

          {showReplyInput && (
            <div className="flex gap-2 mt-2">
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Écrire une réponse..."
                className="h-8 text-sm"
              />
              <Button size="sm" className="h-8" onClick={handleReply}>
                Envoyer
              </Button>
            </div>
          )}

          {replies && replies.length > 0 && (
            <div className="ml-4 mt-2 space-y-2 border-l-2 border-border pl-3">
              {replies.map((reply) => (
                <div key={reply.id} className="flex gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={reply.profiles?.avatar_url} />
                    <AvatarFallback>{reply.profiles?.username[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs">{reply.profiles?.username}</span>
                      {user?.id === reply.user_id && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0 text-destructive"
                          onClick={() => deleteComment.mutate({ commentId: reply.id, videoId })}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs">{reply.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CommentSection = ({ videoId }: CommentSectionProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: comments, isLoading } = useComments(videoId);
  const addComment = useAddComment();
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!newComment.trim()) return;

    await addComment.mutateAsync({
      videoId,
      userId: user.id,
      text: newComment,
    });

    setNewComment("");
  };

  if (isLoading) {
    return <div className="p-4 text-center text-sm text-muted-foreground">Chargement...</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex gap-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ajouter un commentaire..."
          onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
        />
        <Button onClick={handleAddComment} disabled={!newComment.trim()}>
          Publier
        </Button>
      </div>

      <div className="space-y-4">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <Comment key={comment.id} comment={comment} videoId={videoId} />
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground">Aucun commentaire</p>
        )}
      </div>
    </div>
  );
};
