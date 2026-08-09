import { api } from "../api/api";

export async function getStays() {
  return api.get<{
    success: boolean;
    stays: Stay[];
  }>("/api/stays");
}

export async function getStay(
  id: string | number
) {
  return api.get<StayResponse>(
    `/api/stays/${id}`
  );
}

export async function getStayAvailability(
  stayId: number | string
) {
  return api.get<{
    success: boolean;
    stay_id: number;
    unavailable_dates: string[];
  }>(`/api/stays/${stayId}/availability`);
}