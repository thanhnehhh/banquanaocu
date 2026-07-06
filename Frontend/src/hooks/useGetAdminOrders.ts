import { useState, useEffect, useCallback } from "react";
import axiosClient from "@/service/axiosClient";
import type { DonHangDTO } from "./useGetSellOrders";

export interface PageResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function useGetAdminOrders(status: string = "all", page: number = 0, size: number = 10) {
  const [pageData, setPageData] = useState<PageResponse<DonHangDTO> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const fetchAdminOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get<ApiResponse<PageResponse<DonHangDTO>>>(
        `/admin/orders`,
        {
          params: { status, page, size },
        }
      ) as unknown as ApiResponse<PageResponse<DonHangDTO>>;
      
      setPageData(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
      setError(err instanceof Error ? err.message : "Không thể lấy danh sách đơn hàng");
      setPageData(null);
    } finally {
      setLoading(false);
    }
  }, [status, page, size, refreshTick]);

  useEffect(() => {
    fetchAdminOrders();
  }, [fetchAdminOrders]);

  const refetch = useCallback(() => {
    setRefreshTick((t) => t + 1);
  }, []);

  return { pageData, loading, error, refetch };
}
