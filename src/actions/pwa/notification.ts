"use server";

import webpush from "web-push";
import { env as serverEnv } from "@/env/server";
import { env as clientEnv } from "@/env/client";

webpush.setVapidDetails(
  "mailto:futdraft@alastisolutions.org",
  clientEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  serverEnv.VAPID_PRIVATE_KEY
);

let subscription: webpush.PushSubscription | null = null;

export async function subscribeUser(sub: webpush.PushSubscription) {
  subscription = sub;
  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })
  return { success: true };
}

export async function unsubscribeUser() {
  subscription = null;
  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true };
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error("No Subscription Found");
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({ title: "Futdraft", body: message, icon: "/icon.png " })
    );

    return { success: true };
  } catch (error) {
    console.error("error sending notification", error);
    return { success: false, error: "Error sending notification" };
  }
}
