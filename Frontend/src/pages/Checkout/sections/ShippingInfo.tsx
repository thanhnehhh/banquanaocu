import type { ShippingData } from "../Checkout";

type Props = {
  data: ShippingData;
  setData: (d: ShippingData) => void;
};

const inputClass = `
  w-full h-[42px] px-3 rounded-[8px]
  bg-[#F6F7F2] border border-[#E5E7E1]
  text-[13px] text-[#1A1C19]
  placeholder:text-[#B8BCB2]
  focus:outline-none focus:ring-1 focus:ring-[#2F4F2F]
`;

const labelClass = `
  text-[11px] tracking-[1px] font-semibold text-[#6B705C] mb-1 block
`;

const ShippingInfo = ({ data, setData }: Props) => {
  function update<K extends keyof ShippingData>(key: K, value: ShippingData[K]) {
    setData({ ...data, [key]: value });
  }

  return (
    <div className="bg-white p-6 rounded-[16px] border border-[#E5E7E1]">
      <h2 className="text-[20px] font-semibold text-[#1A1C19] mb-6">
        Thông tin giao hàng
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>HỌ TÊN NGƯỜI NHẬN</label>
          <input
            value={data.hoTen}
            onChange={(e) => update("hoTen", e.target.value)}
            placeholder="Nguyễn Văn A"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>SỐ ĐIỆN THOẠI</label>
          <input
            value={data.soDienThoai}
            onChange={(e) => update("soDienThoai", e.target.value)}
            placeholder="0901234567"
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className={labelClass}>ĐỊA CHỈ CHI TIẾT</label>
        <input
          value={data.diaChiChiTiet}
          onChange={(e) => update("diaChiChiTiet", e.target.value)}
          placeholder="Số nhà, tên đường, phường/xã..."
          className={inputClass}
        />
      </div>

      <div className="mt-4">
        <label className={labelClass}>THÀNH PHỐ / TỈNH</label>
        <input
          value={data.thanhPho}
          onChange={(e) => update("thanhPho", e.target.value)}
          placeholder="Hồ Chí Minh"
          className={inputClass}
        />
      </div>
    </div>
  );
};

export default ShippingInfo;
