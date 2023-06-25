// Not complete, a back-end solution is required.
export function SubscribeToNotificationsButtonClick(): void 
{
    window.addEventListener('Game:NotificationsButtonClick', (): void => {
        requestNotificationPermission();
      });
}
  
function requestNotificationPermission(): Promise<NotificationPermission> {
    return Notification.requestPermission().then((permission: NotificationPermission) => {
      if (permission === "granted") {
        // Store permission in local storage
        localStorage.setItem("notificationPermission", "granted");
      }
      return permission;
    });
  }
