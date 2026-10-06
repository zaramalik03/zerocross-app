import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export type MapMarker = {
  id: number;
  name: string;
  address: string;
  lng: number;
  lat: number;
};

export default function PlacesMap({
  markers,
  userPoint,
}: {
  markers: MapMarker[];
  /** Optional "you are here" point — the map centres on it once granted. */
  userPoint?: { lat: number; lng: number } | null;
}) {
  const container = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = import.meta.env["VITE_LOVABLE_CONNECTOR_MAPBOX_PUBLIC_TOKEN"];
    if (!token || !container.current || map.current) return;
    mapboxgl.accessToken = token;
    const m = new mapboxgl.Map({
      container: container.current,
      style: "mapbox://styles/zarammalik/cmspgbeuy01fh01qo86ir0uod",
      center: [-98.5, 39.8],
      zoom: 3,
    });
    map.current = m;
    m.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-right",
    );
    // Markers can only be drawn once the style has loaded; without this gate a
    // fast data fetch renders into a map that is not ready and silently drops.
    m.on("load", () => setReady(true));
    return () => {
      m.remove();
      map.current = null;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    const m = map.current;
    if (!m || !ready || markers.length === 0) return;
    const drawn = markers.map((mk) => {
      const el = document.createElement("div");
      el.className =
        "rounded-full border-2 border-white bg-emerald-600 shadow-md";
      el.style.width = "14px";
      el.style.height = "14px";
      return new mapboxgl.Marker(el)
        .setLngLat([mk.lng, mk.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 14 }).setHTML(
            `<strong>${mk.name}</strong><br/><span>${mk.address}</span>`,
          ),
        )
        .addTo(m);
    });

    const bounds = new mapboxgl.LngLatBounds();
    for (const mk of markers) bounds.extend([mk.lng, mk.lat]);
    if (userPoint) bounds.extend([userPoint.lng, userPoint.lat]);
    m.fitBounds(bounds, { padding: 60, maxZoom: 12, duration: 600 });

    return () => drawn.forEach((d) => d.remove());
  }, [markers, ready, userPoint]);

  // "You are here" pin plus a zoom-in when location is granted, even if no
  // places were mapped nearby.
  useEffect(() => {
    const m = map.current;
    if (!m || !ready) return;
    userMarker.current?.remove();
    userMarker.current = null;
    if (!userPoint) return;

    const el = document.createElement("div");
    el.className = "rounded-full border-2 border-white bg-sky-600 shadow-md";
    el.style.width = "16px";
    el.style.height = "16px";
    userMarker.current = new mapboxgl.Marker(el)
      .setLngLat([userPoint.lng, userPoint.lat])
      .addTo(m);

    if (markers.length === 0) {
      m.easeTo({
        center: [userPoint.lng, userPoint.lat],
        zoom: 10,
        duration: 600,
      });
    }
    return () => {
      userMarker.current?.remove();
      userMarker.current = null;
    };
  }, [userPoint, ready, markers.length]);

  return <div ref={container} className="h-[420px] w-full rounded-[12px]" />;
}
