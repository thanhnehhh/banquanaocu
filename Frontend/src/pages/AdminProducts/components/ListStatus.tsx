import type UploadProduct from "@/model/UploadProduct";
import publicAxios from "@/service/publicAxios";
import { useEffect, useState } from "react";

type Props = {
  statusId: number;
  handleChange: <K extends keyof UploadProduct>(
    field: K,
    value: UploadProduct[K],
  ) => void;
};

function ListStatus({ statusId, handleChange }: Props) {
  const [status, setStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    publicAxios
      .get("/statuses")
      .then((res) => {
        const data = (res as any).data as any[];
        setStatus(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch statuses:", err);
        setError("Không thể tải danh sách trạng thái");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-2">
      <label className="font-semibold text-[15px]">Trạng thái</label>
      <select
        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:border-[#4d5e45] bg-white appearance-none"
        value={statusId}
        onChange={(e) => handleChange("statusId" as any, Number(e.target.value) as any)}
      >
        <option value={0} disabled>Trạng thái</option>
        {status.map((item: any) => (
          <option key={item.id ?? item.maTrangThai} value={item.id ?? item.maTrangThai}>
            {item.tenTrangThai}
          </option>
        ))}
      </select>
      {loading && <p className="text-sm text-gray-500">Đang tải trạng thái...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default ListStatus;
