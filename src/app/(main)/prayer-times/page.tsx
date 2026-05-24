"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRAYER_METHODS, PRAYER_NAMES, formatPrayerTime, getNextPrayer } from "@/lib/prayer-times";
import type { PrayerTimesData } from "@/types";

const PRAYER_KEYS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha", "Midnight"] as const;

export default function PrayerTimesPage() {
  const [data, setData] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [method, setMethod] = useState("2");

  const fetchTimes = useCallback(
    async (lat: number, lng: number) => {
      setLoading(true);
      setError(null);
      try {
        const today = new Date().toLocaleDateString("en-CA");
        const res = await fetch(
          `/api/prayer-times?lat=${lat}&lng=${lng}&date=${today}&method=${method}`
        );
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        setData(json.data);
      } catch {
        setError("Failed to load prayer times. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [method]
  );

  const requestLocation = useCallback(() => {
    const useIpFallback = async () => {
      try {
        const r = await fetch("https://ipapi.co/json/");
        if (!r.ok) throw new Error("IP lookup failed");
        const j = await r.json();
        if (typeof j.latitude !== "number" || typeof j.longitude !== "number") {
          throw new Error("No coordinates from IP");
        }
        setCoords({ lat: j.latitude, lng: j.longitude });
        setLocationName(
          j.city && j.country_name ? `${j.city}, ${j.country_name}` : `${j.latitude.toFixed(2)}, ${j.longitude.toFixed(2)}`
        );
        setError(null);
        fetchTimes(j.latitude, j.longitude);
      } catch {
        setError("Could not detect your location. Please enable location access.");
      }
    };

    if (!navigator.geolocation) {
      void useIpFallback();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setError(null);
        fetchTimes(latitude, longitude);
      },
      () => {
        // Geolocation denied/unavailable — fall back to IP-based lookup
        void useIpFallback();
      }
    );
  }, [fetchTimes]);

  useEffect(() => {
    requestLocation();
  }, []);

  useEffect(() => {
    if (coords) fetchTimes(coords.lat, coords.lng);
  }, [method]);

  const nextPrayer = data ? getNextPrayer(data.timings) : null;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 pb-24 md:pb-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Prayer Times
        </h1>
        <p className="text-muted-foreground">
          Accurate prayer times based on your location
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Calculation method" />
          </SelectTrigger>
          <SelectContent>
            {PRAYER_METHODS.map((m) => (
              <SelectItem key={m.id} value={String(m.id)}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={requestLocation}>
          <MapPin className="mr-1 h-4 w-4" />
          {locationName || "Get Location"}
        </Button>

        {data && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => coords && fetchTimes(coords.lat, coords.lng)}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {error && (
        <Card className="border-destructive/50 mb-6">
          <CardContent className="pt-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {/* Next prayer highlight */}
      {nextPrayer && !loading && (
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="pt-4 pb-4">
            <p className="text-sm text-muted-foreground">Next Prayer</p>
            <p className="text-xl font-bold text-primary">
              {PRAYER_NAMES[nextPrayer.name] || nextPrayer.name}
            </p>
            <p className="text-sm text-muted-foreground">in {nextPrayer.timeUntil}</p>
          </CardContent>
        </Card>
      )}

      {/* Prayer times list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {data?.date?.readable || new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : data ? (
            <div className="divide-y">
              {PRAYER_KEYS.map((prayer) => {
                const time = data.timings[prayer];
                if (!time) return null;
                const isNext = nextPrayer?.name === prayer;
                return (
                  <div
                    key={prayer}
                    className={`flex items-center justify-between py-3 px-2 rounded-lg -mx-2 transition-colors ${
                      isNext ? "bg-primary/10 text-primary font-semibold" : ""
                    }`}
                  >
                    <span className="text-sm">
                      {PRAYER_NAMES[prayer] || prayer}
                    </span>
                    <span className="text-sm tabular-nums">
                      {formatPrayerTime(time)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Allow location access to see prayer times
            </p>
          )}
        </CardContent>
      </Card>

      {data?.meta && (
        <p className="text-xs text-muted-foreground text-center mt-4">
          Method: {data.meta.method?.name}
        </p>
      )}
    </main>
  );
}
