import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Heart, MessageCircle, UserPlus, Share2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications, useMarkNotificationAsRead } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

type NotificationWithActor = {
  id: string;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  actor?: {
    username: string;
    avatar_url?: string;
  };
};

const Notifications = () => {
  const { user } = useAuth();
  const { data: notifications, isLoading } = useNotifications(user?.id);
  const markAsRead = useMarkNotificationAsRead();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return Heart;
      case "comment":
        return MessageCircle;
      case "follow":
        return UserPlus;
      case "share":
        return Share2;
      default:
        return Bell;
    }
  };

  const handleNotificationClick = (notification: NotificationWithActor) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-center">Notifications</h1>
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-border">
        {notifications && notifications.length > 0 ? (
          (notifications as NotificationWithActor[]).map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            return (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-4 hover:bg-card/50 cursor-pointer transition-colors ${
                  !notification.is_read ? "bg-primary/5" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                {/* Avatar */}
                {notification.actor ? (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={notification.actor.avatar_url} />
                    <AvatarFallback>
                      {notification.actor.username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    {notification.actor && (
                      <span className="font-semibold">@{notification.actor.username} </span>
                    )}
                    {notification.message}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </span>
                </div>

                {/* Unread indicator */}
                {!notification.is_read && (
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucune notification</p>
            <p className="text-xs mt-2">
              Vous serez notifié des likes, commentaires et nouveaux abonnés
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
