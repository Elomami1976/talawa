import { NextRequest } from "next/server";
import {
  apiOk,
  apiError,
  preflight,
  enforceRateLimit,
  CACHE_STATIC,
} from "@/lib/api-response";

// Coordinates of the Kaaba in Makkah
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;
const EARTH_RADIUS_KM = 6371;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

function qiblaBearing(lat: number, lng: number): number {
  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA_LAT);
  const dLambda = toRad(KAABA_LNG - lng);
  const y = Math.sin(dLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLambda);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

export async function GET(request: NextRequest) {
  const limited = enforceRateLimit(request);
  if (limited) return limited;

  const { searchParams } = new URL(request.url);
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");

  if (!latParam || !lngParam) {
    return apiError("Both ?lat and ?lng query parameters are required.", 400);
  }

  const lat = parseFloat(latParam);
  const lng = parseFloat(lngParam);

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return apiError("Invalid coordinates. lat ∈ [-90, 90], lng ∈ [-180, 180].", 400);
  }

  const bearing = qiblaBearing(lat, lng);
  const distance = haversineKm(lat, lng, KAABA_LAT, KAABA_LNG);

  return apiOk(
    {
      from: { latitude: lat, longitude: lng },
      kaaba: { latitude: KAABA_LAT, longitude: KAABA_LNG },
      qibla: {
        bearing: Number(bearing.toFixed(4)),
        bearingDegreesFromNorth: Number(bearing.toFixed(2)),
        distanceKm: Number(distance.toFixed(2)),
      },
    },
    { cache: CACHE_STATIC }
  );
}

export const OPTIONS = preflight;
