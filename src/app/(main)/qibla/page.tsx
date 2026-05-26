"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Compass, MapPin, RefreshCw, Navigation2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Coordinates of the Kaaba in Makkah
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/**
 * Calculates the initial bearing (forward azimuth) from a given point to the Kaaba.
 * Returns a value in [0, 360).
 */
function calculateQiblaBearing(lat: number, lng: number): number {
  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA_LAT);
  const deltaLambda = toRad(KAABA_LNG - lng);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const theta = Math.atan2(y, x);
  return (toDeg(theta) + 360) % 360;
}

/**
 * Great-circle distance in km between two coordinates.
 */
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

interface DeviceOrientationEventWithPermission extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

interface DeviceOrientationEventConstructorWithPermission {
  requestPermission?: () => Promise<"granted" | "denied">;
}

export default function QiblaPage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [bearing, setBearing] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [heading, setHeading] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasCompass, setHasCompass] = useState<boolean>(false);
  const [permissionNeeded, setPermissionNeeded] = useState<boolean>(false);
  const orientationListenerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null);

  const requestLocation = useCallback(() => {
    setLoading(true);
    setError(null);

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
          j.city && j.country_name
            ? `${j.city}, ${j.country_name}`
            : `${j.latitude.toFixed(2)}, ${j.longitude.toFixed(2)}`
        );
      } catch {
        setError("تعذّر تحديد موقعك. الرجاء السماح بالوصول إلى الموقع.");
      } finally {
        setLoading(false);
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
        setLoading(false);
      },
      () => {
        void useIpFallback();
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Initial location fetch
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Compute bearing whenever coords change
  useEffect(() => {
    if (!coords) return;
    setBearing(calculateQiblaBearing(coords.lat, coords.lng));
    setDistance(haversineDistance(coords.lat, coords.lng, KAABA_LAT, KAABA_LNG));
  }, [coords]);

  const startCompass = useCallback(() => {
    setPermissionNeeded(false);

    const handler = (event: DeviceOrientationEvent) => {
      const e = event as DeviceOrientationEventWithPermission;
      let compassHeading: number | null = null;

      // iOS gives a direct compass heading
      if (typeof e.webkitCompassHeading === "number") {
        compassHeading = e.webkitCompassHeading;
      } else if (typeof e.alpha === "number") {
        // Android: alpha is rotation around z; convert to compass heading
        compassHeading = 360 - e.alpha;
      }

      if (compassHeading !== null && !Number.isNaN(compassHeading)) {
        setHeading(compassHeading);
        setHasCompass(true);
      }
    };

    orientationListenerRef.current = handler;
    window.addEventListener("deviceorientationabsolute", handler as EventListener);
    window.addEventListener("deviceorientation", handler);
  }, []);

  const requestCompassPermission = useCallback(async () => {
    const DOE = (window as unknown as {
      DeviceOrientationEvent?: DeviceOrientationEventConstructorWithPermission;
    }).DeviceOrientationEvent;

    if (DOE && typeof DOE.requestPermission === "function") {
      try {
        const result = await DOE.requestPermission();
        if (result === "granted") {
          startCompass();
        } else {
          setError("تم رفض إذن البوصلة. يمكنك الاعتماد على درجة الاتجاه أدناه.");
        }
      } catch {
        setError("تعذّر طلب إذن البوصلة.");
      }
    } else {
      startCompass();
    }
  }, [startCompass]);

  // Set up compass listeners (with iOS permission gate)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const DOE = (window as unknown as {
      DeviceOrientationEvent?: DeviceOrientationEventConstructorWithPermission;
    }).DeviceOrientationEvent;

    if (DOE && typeof DOE.requestPermission === "function") {
      // iOS: user must tap to grant
      setPermissionNeeded(true);
    } else {
      startCompass();
    }

    return () => {
      if (orientationListenerRef.current) {
        window.removeEventListener(
          "deviceorientationabsolute",
          orientationListenerRef.current as EventListener
        );
        window.removeEventListener(
          "deviceorientation",
          orientationListenerRef.current
        );
      }
    };
  }, [startCompass]);

  // Rotation: if compass is active, rotate compass face by -heading
  // and the arrow points at (bearing - heading). If no compass, arrow points at bearing directly (relative to North-up).
  const compassRotation = hasCompass ? -heading : 0;
  const arrowRotation = bearing !== null ? bearing + compassRotation : 0;
  const isAligned =
    hasCompass && bearing !== null
      ? Math.abs(((bearing - heading + 540) % 360) - 180) < 5
      : false;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 pb-24 md:pb-12" dir="rtl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          اتجاه القبلة
        </h1>
        <p className="text-muted-foreground text-sm">
          وَمِنْ حَيْثُ خَرَجْتَ فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={requestLocation} disabled={loading}>
          <MapPin className="ml-1 h-4 w-4" />
          {locationName || "تحديد الموقع"}
        </Button>
        {coords && (
          <Button
            variant="ghost"
            size="icon"
            onClick={requestLocation}
            aria-label="تحديث"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        )}
      </div>

      {permissionNeeded && (
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="pt-4 pb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm">
              لتشغيل البوصلة، يلزم منح إذن الوصول إلى مستشعر اتجاه الجهاز.
            </p>
            <Button size="sm" onClick={requestCompassPermission}>
              <Compass className="ml-1 h-4 w-4" />
              تفعيل البوصلة
            </Button>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive/50 mb-6">
          <CardContent className="pt-4 text-sm text-destructive text-center">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Compass */}
      <Card className="overflow-hidden">
        <CardContent className="py-8 flex flex-col items-center">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            {/* Outer ring with cardinal directions */}
            <div
              className="absolute inset-0 rounded-full border-4 border-primary/20 bg-gradient-to-br from-muted/30 to-background transition-transform duration-300 ease-out"
              style={{ transform: `rotate(${compassRotation}deg)` }}
            >
              {/* Cardinal labels */}
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-sm font-bold text-primary">
                N
              </span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-bold text-muted-foreground">
                S
              </span>
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                W
              </span>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                E
              </span>

              {/* Tick marks */}
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 origin-bottom"
                  style={{
                    height: "50%",
                    transform: `translate(-50%, -100%) rotate(${i * 10}deg)`,
                  }}
                >
                  <div
                    className={`w-px ${
                      i % 9 === 0 ? "h-3 bg-primary" : "h-2 bg-muted-foreground/40"
                    } mx-auto`}
                  />
                </div>
              ))}
            </div>

            {/* Qibla arrow (rotates inside compass) */}
            <div
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{ transform: `rotate(${arrowRotation}deg)` }}
            >
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center">
                <div
                  className={`flex flex-col items-center transition-colors ${
                    isAligned ? "text-emerald-500" : "text-primary"
                  }`}
                >
                  <Navigation2
                    className="h-12 w-12 drop-shadow-lg"
                    fill="currentColor"
                    strokeWidth={1.5}
                  />
                  <span className="font-arabic text-3xl leading-none mt-1">
                    ﷽
                  </span>
                </div>
              </div>
            </div>

            {/* Center dot */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-md" />
          </div>

          {/* Info */}
          <div className="mt-6 text-center space-y-1">
            {bearing !== null ? (
              <>
                <p className="text-3xl font-bold tabular-nums text-primary">
                  {bearing.toFixed(1)}°
                </p>
                <p className="text-sm text-muted-foreground">
                  زاوية القبلة من الشمال
                </p>
                {distance !== null && (
                  <p className="text-xs text-muted-foreground mt-2">
                    المسافة إلى الكعبة: {Math.round(distance).toLocaleString("ar-EG")} كم
                  </p>
                )}
                {hasCompass && (
                  <p
                    className={`text-sm font-medium mt-3 ${
                      isAligned ? "text-emerald-500" : "text-muted-foreground"
                    }`}
                  >
                    {isAligned
                      ? "✓ أنت تواجه القبلة الآن"
                      : "وجّه الجهاز حتى يصبح السهم متجهاً نحو الأعلى"}
                  </p>
                )}
                {!hasCompass && !permissionNeeded && (
                  <p className="text-xs text-muted-foreground mt-3 max-w-xs mx-auto">
                    لا تتوفر بوصلة على هذا الجهاز. السهم يشير إلى الاتجاه نسبةً
                    إلى الشمال الجغرافي (أعلى الدائرة).
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {loading ? "جاري تحديد موقعك..." : "اسمح بالوصول إلى موقعك لحساب اتجاه القبلة"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center mt-6">
        الدقة تعتمد على مستشعر الجهاز وقد تحتاج إلى معايرة البوصلة بتحريك الجهاز
        على شكل رقم 8.
      </p>
    </main>
  );
}
