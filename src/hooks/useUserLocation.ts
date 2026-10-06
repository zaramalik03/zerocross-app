import { useCallback, useEffect, useState } from "react";
import { reverseGeocode } from "@/lib/geocode.functions";

export type UserLocation = {
  city: string;
  state: string;
  label: string;
  lat?: number;
  lng?: number;
};

const STORAGE_KEY = "zerocross.location";

/** Browser-granted location, reverse-geocoded to a "City, ST" label and cached locally. */
export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLocation(JSON.parse(raw) as UserLocation);
    } catch {
      /* ignore */
    }
  }, []);

  const enable = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("error");
      setError("Location isn't available on this device.");
      return;
    }
    setStatus("loading");
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const result = await reverseGeocode({
            data: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          });
          const withCoords: UserLocation = {
            ...result,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setLocation(withCoords);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(withCoords));
          setStatus("idle");
        } catch {
          setStatus("error");
          setError("Couldn't determine your area. Try again.");
        }
      },
      () => {
        setStatus("error");
        setError("Location permission denied.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, []);

  const clear = useCallback(() => {
    setLocation(null);
    setStatus("idle");
    setError(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { location, status, error, enable, clear };
}
