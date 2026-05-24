"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock, MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getNextPrayer, formatPrayerTime, PRAYER_NAMES } from "@/lib/prayer-times";
import type { PrayerTimesData } from "@/types";

export function PrayerTimesWidget() {
  const [data, setData] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("");

  const fetchTimes = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date().toLocaleDateString("en-CA");
      const res = await fetch(
        `/api/prayer-times?lat=${lat}&lng=${lng}&date=${today}`
      );
      if (!res.ok) throw new Error("Failed to fetch prayer times");
      const json = await res.json();
      setData(json.data);
    } catch {
      setError("Unable to load prayer times");
    } finally {
      setLoading(false);
    }
  }, []);

  const requestLocation = useCallback(() => {
    const useIpFallback = async () => {
      try {
        const r = await fetch("https://ipapi.co/json/");
        if (!r.ok) throw new Error("IP lookup failed");
        const j = await r.json();
        if (typeof j.latitude !== "number" || typeof j.longitude !== "number") {
          throw new Error("No coordinates from IP");
        }
        setLocation(
          j.city && j.country_name ? `${j.city}, ${j.country_name}` : `${j.latitude.toFixed(2)}, ${j.longitude.toFixed(2)}`
        );
        setError(null);
        fetchTimes(j.latitude, j.longitude);
      } catch {
        setError("Unable to detect location");
      }
    };

    if (!navigator.geolocation) {
      void useIpFallback();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(`${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`);
        fetchTimes(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        void useIpFallback();
      }
    );
  }, [fetchTimes]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Prayer Times
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-5 gap-2">
          {PRAYER_KEYS.map((p) => (
            <div key={p} className="text-center">
              <Skeleton className="h-4 w-12 mx-auto mb-1" />
              <Skeleton className="h-5 w-14 mx-auto" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="ghost" size="sm" onClick={requestLocation}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const nextPrayer = getNextPrayer(data.timings);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Prayer Times
          </CardTitle>
          {location && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {location}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {PRAYER_KEYS.map((prayer) => {
            const isNext = nextPrayer?.name === prayer;
            return (
              <div
                key={prayer}
                className={`text-center p-2 rounded-lg transition-colors ${
                  isNext
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <p className={`text-xs font-medium mb-1 ${isNext ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {PRAYER_NAMES[prayer] || prayer}
                </p>
                <p className={`text-sm font-bold ${isNext ? "text-primary-foreground" : ""}`}>
                  {formatPrayerTime(data.timings[prayer])}
                </p>
              </div>
            );
          })}
        </div>
        {nextPrayer && (
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Next: <span className="text-primary font-medium">{PRAYER_NAMES[nextPrayer.name] || nextPrayer.name}</span>
            {" in "}{nextPrayer.timeUntil}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
