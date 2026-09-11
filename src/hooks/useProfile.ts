import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  EMPTY_PROFILE,
  fetchRemoteProfile,
  readGuestProfile,
  saveRemoteProfile,
  writeGuestProfile,
  type AllergenProfile,
} from "@/lib/allergen-profile";

/**
 * Single source of truth for the allergen profile. Signed-in users read and
 * write Supabase; guests fall back to localStorage so the app still scores
 * against a real profile before an account exists.
 */
export function useProfile() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<AllergenProfile>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (authLoading) return;

    async function load() {
      if (!user) {
        if (!cancelled) {
          setProfile(readGuestProfile() ?? EMPTY_PROFILE);
          setLoading(false);
        }
        return;
      }
      const remote = await fetchRemoteProfile(user.id);
      if (cancelled) return;
      const guest = readGuestProfile();
      const hasRemote = Object.keys(remote.allergens).length > 0;
      setProfile(hasRemote ? remote : (guest ?? remote));
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const save = useCallback(
    async (next: AllergenProfile) => {
      const stamped = { ...next, completedAt: new Date().toISOString() };
      setProfile(stamped);
      if (user) {
        await saveRemoteProfile(user.id, stamped);
      } else {
        writeGuestProfile(stamped);
      }
    },
    [user],
  );

  return {
    profile,
    setProfile,
    save,
    loading: loading || authLoading,
    isGuest: !user,
    user,
  };
}
