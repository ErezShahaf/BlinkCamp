// Not complete, a back-end solution is required.
export function SubscribeToNotificationsButtonClick() {
    window.addEventListener('Game:NotificationsButtonClick', () => {
        requestNotificationPermission();
    });
}
function requestNotificationPermission() {
    return Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            // Store permission in local storage
            localStorage.setItem("notificationPermission", "granted");
        }
        return permission;
    });
}
