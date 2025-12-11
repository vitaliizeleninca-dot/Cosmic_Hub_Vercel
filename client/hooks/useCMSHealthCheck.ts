import { useEffect, useState } from "react";

const PRIMARY_CMS_URL = "https://www.alphaross.com/cms";
const HEALTH_CHECK_INTERVAL = 30000; // Check every 30 seconds
const HEALTH_CHECK_TIMEOUT = 5000; // 5 second timeout

export interface CMSHealth {
  isPrimaryAvailable: boolean;
  currentURL: string;
  lastChecked: Date | null;
  isChecking: boolean;
}

export function useCMSHealthCheck() {
  const [health, setHealth] = useState<CMSHealth>({
    isPrimaryAvailable: true,
    currentURL: PRIMARY_CMS_URL,
    lastChecked: null,
    isChecking: false,
  });

  const checkURL = async (url: string): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        HEALTH_CHECK_TIMEOUT,
      );

      const response = await fetch(url, {
        method: "HEAD",
        mode: "no-cors",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      return false;
    }
  };

  const performHealthCheck = async () => {
    setHealth((prev) => ({ ...prev, isChecking: true }));

    const primaryAvailable = await checkURL(PRIMARY_CMS_URL);

    setHealth({
      isPrimaryAvailable: primaryAvailable,
      currentURL: PRIMARY_CMS_URL,
      lastChecked: new Date(),
      isChecking: false,
    });
  };

  useEffect(() => {
    // Perform initial health check
    performHealthCheck();

    // Set up interval for periodic checks
    const interval = setInterval(performHealthCheck, HEALTH_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return { health, performHealthCheck };
}

export function getCMSURL(): string {
  return PRIMARY_CMS_URL;
}
