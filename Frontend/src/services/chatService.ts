import axiosClient from "@/service/axiosClient";

export const chatWithSeller = (emailOpponent: string) =>
  axiosClient.post<{ emailOpponent: string }, unknown>("/conversations", {
    emailOpponent,
  });

export const chatWithBuyer = (emailOpponent: string) =>
  axiosClient.post<{ emailOpponent: string }, unknown>("/conversations", {
    emailOpponent,
  });
