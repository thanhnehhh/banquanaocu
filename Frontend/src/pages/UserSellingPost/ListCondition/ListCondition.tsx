import type Condition from "@/model/Condition";
import type UploadProduct from "@/model/UploadProduct";
import publicAxios from "@/service/publicAxios";
import { useEffect, useState } from "react";

type Props = {
  formData: UploadProduct;
  handleChange: <K extends keyof UploadProduct>(
    field: K,
    value: UploadProduct[K],
  ) => void;
};

function ListCondition({ formData, handleChange }: Props) {
  const [conditions, setConditions] = useState<Condition[]>([]);

  useEffect(() => {
    publicAxios
      .get("/statuses")
      .then((res) => {
        const data = res.data as Condition[];
        setConditions(data);
      })
      .catch((error) => {
        console.error("Failed to fetch conditions:", error);
      });
  }, []);

  return (
    <div className="space-y-4">
      <label className="font-semibold text-[15px]">Tình trạng</label>
      <div className="flex flex-wrap justify-center gap-4">
        {conditions.map((cond) => (
          <div
            key={cond.maTinhTrang}
            onClick={() =>
              handleChange("tinhTrangId", Number(cond.maTinhTrang))
            }
            className={`w-[30%] min-w-40 p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2
                                                ${formData.tinhTrangId === Number(cond.maTinhTrang) ? "border-gray-800 bg-gray-50" : "border-gray-300 hover:border-gray-400"}
                                            `}
          >
            <span className="font-bold text-[15px]">{cond.tenTinhTrang}</span>
            <span className="text-[11px] text-gray-400 leading-tight px-2">
              {cond.moTa}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListCondition;
