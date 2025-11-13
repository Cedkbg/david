import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Users, Archive, ChevronRight } from "lucide-react";

const Messages = () => {
  const notifications = [
    {
      id: "1",
      type: "activity",
      icon: Bell,
      iconColor: "bg-cedlite-pink",
      title: "Activité",
      message: "Shadow a aimé ta vidéo.",
      unread: 7,
      time: "5min",
    },
    {
      id: "2",
      type: "followers",
      icon: Users,
      iconColor: "bg-blue-500",
      title: "Nouveaux followers",
      message: "Shadow s'est abonné(e) à ton compte",
      unread: 2,
      time: "10min",
    },
    {
      id: "3",
      type: "system",
      icon: Archive,
      iconColor: "bg-muted",
      title: "Notifications système",
      message: "Tu as passé 12 heure(s) et 5 min...",
      unread: 0,
      time: "5j",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-center">Messages</h1>
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-border">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div
              key={notification.id}
              className="flex items-center gap-4 p-4 hover:bg-card/50 cursor-pointer transition-colors"
            >
              {/* Icon */}
              <div className={`h-12 w-12 rounded-full ${notification.iconColor} flex items-center justify-center text-white`}>
                <Icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm">{notification.title}</h3>
                  {notification.unread > 0 && (
                    <Badge className="bg-cedlite-pink hover:bg-cedlite-pink text-white h-5 min-w-5 rounded-full flex items-center justify-center px-1.5">
                      {notification.unread}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate pr-2">{notification.message}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">· {notification.time}</span>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </div>
          );
        })}
      </div>

      {/* Empty State for Direct Messages */}
      <div className="mt-8 p-8 text-center text-muted-foreground">
        <p className="text-sm">Aucun message direct</p>
      </div>
    </div>
  );
};

export default Messages;
