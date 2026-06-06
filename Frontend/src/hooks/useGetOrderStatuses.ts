import { useState, useEffect } from "react";
import publicAxios from "@/service/publicAxios";

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
        // /api/order-statuses là public endpoint — dùng publicAxios không cần token
        const response = await publicAxios.get(
          `/order-statuses`
        ) as unknown as ApiResponse<TrangThaiDTO[]>;
        const data = response.data || [];
        setStatuses(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
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
