import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useWebSocket } from '../../hooks/useWebSocket';
import NotificationPopup from './NotificationPopup';

const GlobalNotificationManager: React.FC = () => {
  const { notifications } = useWebSocket();
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentNotification, setCurrentNotification] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);

  // Reset when user changes
  useEffect(() => {
    setCurrentNotification(null);
    setShowPopup(false);
  }, [user?.id]);

  // Show latest notification
  useEffect(() => {
    if (notifications.length > 0 && user) {
      const latestNotification = notifications[notifications.length - 1];
      
      // Show notification to current user if:
      // 1. It's a team-related notification (member added/removed)
      // 2. It's a todo-related notification and user is involved
      // 3. It's a general notification for the user
      const shouldShow = 
        latestNotification.type === 'team_member_added' ||
        latestNotification.type === 'team_member_removed' ||
        latestNotification.data?.assigneeId === user.id ||
        latestNotification.data?.createdById === user.id ||
        latestNotification.data?.team?.members?.some((member: any) => member.id === user.id) ||
        latestNotification.data?.team?.ownerId === user.id;
      
      if (shouldShow) {
        // Always show the latest notification
        setCurrentNotification(latestNotification);
        setShowPopup(true);
      }
    }
  }, [notifications, user]);

  const handleClosePopup = () => {
    setShowPopup(false);
    setCurrentNotification(null);
  };

  if (!user) return null;

  return (
    <NotificationPopup
      key={currentNotification?.timestamp || 'no-notification'}
      notification={currentNotification}
      open={showPopup}
      onClose={handleClosePopup}
    />
  );
};

export default GlobalNotificationManager; 