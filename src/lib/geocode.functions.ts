import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type GeoPoint = { id: number; lng: number; lat: number };

const schema = z.object({
  /** Place ids only — addresses are resolved server-side so this is not an open geocoding proxy. */
  ids: z.array(z.number().int().positive()).max(60),
});

/** Geocodes place addresses through the Mapbox connector gateway (secret token). */
export const geocodePlaces = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }): Promise<GeoPoint[]> => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const mapboxKey = process.env["MAPBOX_API_KEY"];
    if (!lovableKey || !mapboxKey)
      throw new Error("Mapbox connection is not configured");
    if (data.ids.length === 0) return [];

    const supabasePublic = createClient<Database>(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_PUBLISHABLE_KEY"]!,
      {
        auth: {
          storage: undefined,
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );
    const { data: rows, error } = await supabasePublic
      .from("places")
      .select("id, street_address, city, state, zipcode")
      .in("id", data.ids);
    if (error) throw error;

    const targets = (rows ?? [])
      .map((r) => ({
        id: r.id,
        address: [r.street_address, r.city, r.state, r.zipcode]
          .filter(Boolean)
          .join(", "),
      }))
      .filter((t) => t.address.length > 3);

    const results = await Promise.all(
      targets.map(async ({ id, address }) => {
        const url = `https://connector-gateway.lovable.dev/mapbox/geocoding/v5/mapbox.places/${encodeURIComponent(
          address,
        )}.json?limit=1&country=us`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${lovableKey}`,
            "X-Connection-Api-Key": mapboxKey,
          },
        });
        if (!res.ok) {
          const body = await res.text();
          console.error(`Mapbox geocoding failed [${res.status}]: ${body}`);
          return null;
        }
        const json = (await res.json()) as {
          features?: { center?: [number, number] }[];
        };
        const center = json.features?.[0]?.center;
        if (!center) return null;
        return { id, lng: center[0], lat: center[1] } satisfies GeoPoint;
      }),
    );

    return results.filter((r): r is GeoPoint => r !== null);
  });

const reverseSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

/** Reverse geocodes browser coordinates into a "City, ST" label. */
export const reverseGeocode = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => reverseSchema.parse(data))
  .handler(
    async ({
      data,
    }): Promise<{ city: string; state: string; label: string }> => {
      const lovableKey = process.env["LOVABLE_API_KEY"];
      const mapboxKey = process.env["MAPBOX_API_KEY"];
      if (!lovableKey || !mapboxKey)
        throw new Error("Mapbox connection is not configured");

      // Mapbox rejects limit > 1 when several `types` are requested, so ask for the
      // single place feature and read the region out of its context chain.
      const url = `https://connector-gateway.lovable.dev/mapbox/geocoding/v5/mapbox.places/${data.lng},${data.lat}.json?types=place&limit=1`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": mapboxKey,
        },
      });
      if (!res.ok) {
        const body = await res.text();
        console.error(
          `Mapbox reverse geocoding failed [${res.status}]: ${body}`,
        );
        throw new Error(`Reverse geocoding failed (${res.status})`);
      }
      type Ctx = { id?: string; text?: string; short_code?: string };
      const json = (await res.json()) as {
        features?: { text?: string; context?: Ctx[] }[];
      };
      const feature = json.features?.[0];
      const city = feature?.text ?? "";
      const region = feature?.context?.find((c) => c.id?.startsWith("region"));
      const state = region?.short_code?.split("-")[1] ?? region?.text ?? "";
      const label = [city, state].filter(Boolean).join(", ");

      return { city, state, label };
    },
  );
