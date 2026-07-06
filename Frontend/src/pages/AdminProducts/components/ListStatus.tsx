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
    publicAxios
      .get("/conditions")
      .then((res) => {
        const data = res.data as any[];
        setStatus(data);
      })
      .catch((error) => {
        console.error("Failed to fetch conditions:", error);
      });
  }, []);

  return (
    <div className="space-y-2">
      <label className="font-semibold text-[15px]">Trạng thái</label>
      <select
        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:border-[#4d5e45] bg-white appearance-none"
        value={statusId}
        onChange={(e) => handleChange("statusId", Number(e.target.value))}
      >
        <option value={0} disabled>
          Trạng thái
        </option>
        {status.map((item: any) => (
          <option key={item.id} value={item.id}>
            {item.tenTrangThai}
          </option>
        ))}
      </select>
      {loading && (
        <p className="text-sm text-gray-500">Đang tải trạng thái...</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default ListStatus;
