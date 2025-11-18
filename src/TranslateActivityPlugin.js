import React from "react";
import { FlexPlugin } from "@twilio/flex-plugin";
import { Manager } from "@twilio/flex-ui";

const PLUGIN_NAME = "TranslateActivityPlugin";

export default class TranslateActivityPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex, manager) {
    console.log(`[${PLUGIN_NAME}] initialized`);

    // Map of translations
    const translations = {
      Available: "Disponible",
      Break: "Pausa",
      Offline: "Fuera de línea",
      Unavailable: "No disponible",
    };

    // Wait for worker client to load
    const workerClient = Manager.getInstance().workerClient;

    if (!workerClient) {
      console.warn("Worker client not ready yet. Retrying...");
      const interval = setInterval(() => {
        const w = Manager.getInstance().workerClient;
        if (w) {
          clearInterval(interval);
          this.renameActivities(w, translations);
        }
      }, 1000);
    } else {
      this.renameActivities(workerClient, translations);
    }
  }

  renameActivities(workerClient, translations) {
    try {
      workerClient.activities.forEach((activity) => {
        if (translations[activity.name]) {
          console.log(
            `Renaming activity "${activity.name}" → "${
              translations[activity.name]
            }"`
          );
          activity.name = translations[activity.name];
        }
      });
      console.log("[TranslateActivityPlugin] Activity labels updated.");
    } catch (err) {
      console.error("Failed to rename activities:", err);
    }
  }
}
