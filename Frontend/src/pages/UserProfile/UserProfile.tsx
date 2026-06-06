import { useSelector } from "react-redux";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  Camera,
  LeafyGreen,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
// Google icon — dùng URL thay vì import local để tránh lỗi file không tồn tại
const googleImage = "https://www.svgrepo.com/show/475656/google-color.svg";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import type { UpdateProfileRequest } from "@/service/userProfileService";
import dinhDangThoiGian from "@/utils/DinhDangThoiGian";
import Loading from "@/components/common/Loading";

const GENDER_OPTIONS: { value: string; label: string }[] = [
  { value: "M", label: "Nam" },
  { value: "F", label: "Nữ" },
  { value: "O", label: "Khác" },
];

function UserProfile() {
  const user = useSelector((state: any) => state.auth.user);
  const { submit, isLoading, error, success } = useUpdateProfile();

  // ─── Form state (khởi tạo từ Redux user) ─────────────────────────
  const [hoDem, setHoDem] = useState<string>(user?.hoDem ?? "");
  const [ten, setTen] = useState<string>(user?.name ?? "");
  const [birthday, setBirthday] = useState<string>(user?.birthday ?? "");
  const [gioiTinh, setGioiTinh] = useState<string>(user?.gioiTinh ?? "");
  const [diaChi, setDiaChi] = useState<string>(user?.address ?? "");
  const [soDienThoai, setSoDienThoai] = useState<string>(user?.phone ?? "");
  const [hobby, setHobby] = useState<string>(user?.hobby ?? "");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    user?.avatar ?? "",
  );

  useEffect(() => {
    if (user) {
      setHoDem(user.hoDem ?? "");
      setTen(user.name ?? "");
      setBirthday(user.birthday ?? "");
      setGioiTinh(user.gioiTinh ?? "");
      setDiaChi(user.address ?? "");
      setSoDienThoai(user.phone ?? "");
      setHobby(user.hobby ?? "");
      setAvatarPreview(user.avatar ?? "");
    }
  }, [user]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filledFields = [
    hoDem,
    ten,
    birthday,
    gioiTinh,
    diaChi,
    soDienThoai,
    hobby,
    avatarPreview,
  ].filter(Boolean).length;
  const verificationProgress = Math.round((filledFields / 8) * 100);
  const circleRadius = 16;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const progressOffset =
    circleCircumference - (verificationProgress / 100) * circleCircumference;

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    // Chỉ gửi những field thay đổi so với giá trị gốc
    const payload: UpdateProfileRequest = {};
    if (hoDem !== (user?.hoDem ?? "")) payload.hoDem = hoDem;
    if (ten !== (user?.name ?? "")) payload.ten = ten;
    if (birthday !== (user?.birthday ?? "")) payload.birthDay = birthday;
    if (gioiTinh !== (user?.gioiTinh ?? "")) payload.gioiTinh = gioiTinh;
    if (diaChi !== (user?.address ?? "")) payload.diaChi = diaChi;
    if (soDienThoai !== (user?.phone ?? "")) payload.soDienThoai = soDienThoai;
    if (hobby !== (user?.hobby ?? "")) payload.hobby = hobby;

    await submit(payload, avatarFile, user?.email ?? "");
  };

  const inputClass =
    "mt-2 px-4 py-3 bg-brand-input rounded-2xl font-manrope font-medium leading-6 w-full outline-none focus:ring-2 focus:ring-brand-primary/40 transition-all placeholder:text-gray-400 text-sm";

  return (
    <div className="py-16 px-12">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        Trang chủ &gt;{" "}
        <span className="text-brand-primary font-bold underline">
          Hồ sơ của tôi
        </span>
      </div>

      <div className="grid grid-cols-10 gap-6 mt-8">
        {/* ── Left column ── */}
        <div className="col-span-7 flex flex-col gap-6">
          {/* Avatar + tên card */}
          <div className="p-8 bg-white rounded-2xl flex flex-row items-center gap-8">
            {/* Avatar có thể click để đổi */}
            <div
              className="relative cursor-pointer group shrink-0ex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
              title="Nhấn để thay đổi ảnh đại diện"
            >
              <img
                src={
                  avatarPreview ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(
                      (hoDem + " " + ten).trim() || user?.email || "U",
                    ) +
                    "&background=4E6A4E&color=fff&size=160"
                }
                alt="Avatar"
                className="rounded-full w-40 h-40 object-cover ring-4 ring-brand-input"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                <Camera className="text-white w-8 h-8" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Thông tin tóm tắt */}
            <div className="flex flex-col gap-2 flex-1">
              <h2 className="font-manrope text-3xl font-extrabold leading-9 tracking-tighter">
                {(hoDem + " " + ten).trim() || user?.email}
              </h2>
              <span className="font-manrope leading-6 text-sm text-gray-500">
                Thành viên từ{" "}
                {user?.createAt
                  ? dinhDangThoiGian(user.createAt)
                  : "tháng 1 năm 2023"}
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="px-4 py-1 bg-[#CEE9A2] rounded-2xl text-xs w-fit font-bold text-brand-primary">
                  Người bán uy tín
                </span>
                <span className="px-4 py-1 bg-[#EBE2C4] rounded-2xl text-xs w-fit font-bold text-brand-primary">
                  Thời trang bền vững
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Camera className="w-3 h-3" />
                Nhấn vào ảnh để thay đổi
              </p>
            </div>

            {/* Progress circle */}
            <div className="ml-auto flex flex-col items-center gap-3 shrink-0">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 36 36" className="w-32 h-32">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#4E6A4E"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={progressOffset}
                    transform="rotate(-90 18 18)"
                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-[#1F2937]">
                    {verificationProgress}%
                  </span>
                  <span className="text-xs text-slate-500">Hoàn thành</span>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600">
                Xác minh hồ sơ
              </div>
            </div>
          </div>

          {/* ── Form chỉnh sửa ── */}
          <div className="bg-white rounded-2xl p-8 flex flex-col gap-6">
            {/* Toast thông báo */}
            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                <CheckCircle className="w-4 h-4 shrink-0" />
                Cập nhật thông tin thành công!
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                <XCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Hàng 1: Họ đệm + Tên */}
            <div className="flex flex-row gap-6">
              <div className="flex-1">
                <label className="font-manrope font-bold text-[14px] text-gray-700">
                  Họ đệm
                </label>
                <input
                  type="text"
                  value={hoDem}
                  onChange={(e) => setHoDem(e.target.value)}
                  placeholder="Nhập họ đệm..."
                  className={inputClass}
                />
              </div>
              <div className="flex-1">
                <label className="font-manrope font-bold text-[14px] text-gray-700">
                  Tên
                </label>
                <input
                  type="text"
                  value={ten}
                  onChange={(e) => setTen(e.target.value)}
                  placeholder="Nhập tên..."
                  className={inputClass}
                />
              </div>
            </div>

            {/* Hàng 2: Ngày sinh + Số điện thoại */}
            <div className="flex flex-row gap-6">
              <div className="flex-1">
                <label className="font-manrope font-bold text-[14px] text-gray-700">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex-1">
                <label className="font-manrope font-bold text-[14px] text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={soDienThoai}
                  onChange={(e) => setSoDienThoai(e.target.value)}
                  placeholder="Nhập số điện thoại..."
                  className={inputClass}
                />
              </div>
            </div>

            {/* Hàng 3: Giới tính */}
            <div>
              <label className="font-manrope font-bold text-[14px] text-gray-700 block mb-2">
                Giới tính
              </label>
              <ul className="flex flex-row items-center gap-2 bg-brand-input px-3 py-1 rounded-2xl w-fit">
                {GENDER_OPTIONS.map((opt) => (
                  <li
                    key={opt.value}
                    onClick={() =>
                      setGioiTinh(gioiTinh === opt.value ? "" : opt.value)
                    }
                    className={`px-6 py-2.5 rounded-2xl font-bold text-sm cursor-pointer select-none transition-all duration-200 ${
                      gioiTinh === opt.value
                        ? "bg-white text-brand-primary shadow-sm"
                        : "text-gray-500 hover:text-brand-primary"
                    }`}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Địa chỉ */}
            <div>
              <label className="font-manrope font-bold text-[14px] text-gray-700">
                Địa chỉ
              </label>
              <input
                type="text"
                value={diaChi}
                onChange={(e) => setDiaChi(e.target.value)}
                placeholder="Nhập địa chỉ..."
                className={inputClass}
              />
            </div>

            {/* Giới thiệu bản thân */}
            <div>
              <label className="font-manrope font-bold text-[14px] text-gray-700">
                Giới thiệu bản thân
              </label>
              <textarea
                value={hobby}
                onChange={(e) => setHobby(e.target.value)}
                rows={5}
                placeholder="Viết vài dòng về phong cách thời trang của bạn..."
                className={inputClass + " resize-none"}
              />
            </div>

            {/* Nút lưu */}
            <div className="flex flex-row-reverse pt-2">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-brand-primary text-white px-12 py-3 rounded-full font-semibold hover:opacity-90 hover:cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="col-span-3 flex flex-col gap-4">
          {/* Tài khoản liên kết */}
          <div className="p-6 bg-white rounded-2xl">
            <h1 className="font-bold text-base mb-3">Tài khoản liên kết</h1>
            <div className="flex flex-row items-center gap-3 p-3 bg-brand-input rounded-2xl">
              <img
                src={googleImage}
                alt="Google"
                className="w-5 h-5 object-contain shrink-0"
              />
              <p className="font-medium text-sm flex-1">Google</p>
              <p className="text-sm text-gray-500 truncate max-w-25">
                {user?.googleId ? user.googleId : "Chưa kết nối"}
              </p>
            </div>
          </div>

          {/* Mẹo hay */}
          <div className="p-6 bg-brand-primary rounded-2xl">
            <div className="flex flex-row items-center text-white gap-2 mb-3">
              <LeafyGreen size={20} />
              <h1 className="text-white font-bold">Mẹo hay</h1>
            </div>
            <p className="text-white text-sm leading-relaxed">
              Hồ sơ đầy đủ giúp tỷ lệ chốt đơn của bạn tăng lên 40%. Hãy thêm
              một vài dòng về phong cách thời trang của bạn nhé!
            </p>
          </div>
        </div>
      </div>
      {isLoading && <Loading />}
    </div>
  );
}

export default UserProfile;
