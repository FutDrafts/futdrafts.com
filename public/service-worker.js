const { ClientPageRoot } = require("next/dist/client/components/client-page");

self.addEventListener("push", function(event) {
    if(event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: data.icon || "/icon.png",
            badge: "/badge.png",
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: '2',
            },
        }

        event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

self.addEventListener("notificationclick", function(event) {
    console.log("Notification Click received.");
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.url));
})