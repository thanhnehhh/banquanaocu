import type { PaymentType } from "../Checkout";

/* ================= ITEM COMPONENT ================= */

type ItemProps = {
  id: PaymentType;
  title: string;
  desc: string;
  selected: boolean;
  onSelect: (id: PaymentType) => void;
  icon?: React.ReactNode;
};

const PaymentItem = ({ id, title, desc, selected, onSelect, icon }: ItemProps) => {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`
        flex justify-between items-center px-4 py-3
        rounded-[10px] border cursor-pointer transition
        ${selected ? "bg-[#E6EFE6] border-[#2F4F2F]" : "bg-white border-[#E5E7E1]"}
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            w-[16px] h-[16px] rounded-full border flex items-center justify-center flex-shrink-0
            ${selected ? "border-[#2F4F2F]" : "border-[#C8CCBE]"}
          `}
        >
          {selected && <div className="w-[6px] h-[6px] bg-[#2F4F2F] rounded-full" />}
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#1A1C19]">{title}</p>
          <p className="text-[11px] text-[#7C8273]">{desc}</p>
        </div>
      </div>
      {icon && <div className="flex-shrink-0">{icon}</div>}
    </div>
  );
};

/* ================= VNPAY LOGO ================= */
const VNPayLogo = () => (
  <div className="flex items-center gap-1">
    <div className="bg-[#005BAA] text-white text-[10px] font-bold px-2 py-0.5 rounded">VN</div>
    <div className="bg-[#E31837] text-white text-[10px] font-bold px-2 py-0.5 rounded">PAY</div>
  </div>
);

/* ================= MAIN COMPONENT ================= */

type Props = {
  method: PaymentType;
  setMethod: (m: PaymentType) => void;
};

const PaymentMethod = ({ method, setMethod }: Props) => {
  return (
    <div className="bg-white p-6 rounded-[16px] border border-[#E5E7E1]">
      <h2 className="text-[20px] font-semibold mb-4 text-[#1A1C19]">
        Phương thức thanh toán
      </h2>

      <div className="space-y-3">
        <PaymentItem
          id="cod"
          title="Thanh toán khi nhận hàng (COD)"
          desc="Trả tiền mặt khi nhận được hàng"
          selected={method === "cod"}
          onSelect={setMethod}
        />
        <PaymentItem
          id="vnpay"
          title="Thanh toán qua VNPAY"
          desc="Thẻ ATM, Visa, Mastercard, QR Code"
          selected={method === "vnpay"}
          onSelect={setMethod}
          icon={<VNPayLogo />}
        />
      </div>

      {method === "vnpay" && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-[10px]">
          <p className="text-[12px] text-blue-700 leading-[18px]">
            🔒 Bạn sẽ được chuyển đến cổng thanh toán VNPAY an toàn sau khi xác nhận đơn hàng.
            Hỗ trợ thẻ ATM nội địa, Visa, Mastercard và QR Code.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
