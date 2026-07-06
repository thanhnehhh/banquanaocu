import { useState, useEffect } from "react";
import axiosClient from "@/service/axiosClient";

export interface TrangThaiDTO {
  id: number;
  tenTrangThai: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function useGetOrderStatuses() {
  const [statuses, setStatuses] = useState<TrangThaiDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        setLoading(true);
        // axiosClient interceptor đã return response.data
        // nên 'response' ở đây chính là ApiResponse { success, message, data: [...] }
        const response = await axiosClient.get<ApiResponse<TrangThaiDTO[]>>(
          `/order-statuses`
        ) as unknown as ApiResponse<TrangThaiDTO[]>;
        const statuses = response.data || [];
        setStatuses(Array.isArray(statuses) ? statuses : []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch order statuses:", err);
        setError(err instanceof Error ? err.message : "Không thể lấy danh sách trạng thái");
        setStatuses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, []);

  return { statuses, loading, error };
}
