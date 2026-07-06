import React, { useState, useRef, useEffect } from "react";
import { Camera, X, ChevronRight } from "lucide-react";
import { usePostProduct } from "@/hooks/usePostProduct";
import type UploadProduct from "@/model/UploadProduct";
import Loading from "@/components/common/Loading";
import ListCategory from "./ListCategory/ListCategory";
import ListCondition from "./ListCondition/ListCondition";

// --- Types ---

const initialFormData: UploadProduct = {
  tenSanPham: "",
  soLuong: 1,
  giaBan: 0,
  moTa: "",
  mauSac: "",
  kichThuoc: "",
  thuongHieu: "",
  categoryId: 0,
  tinhTrangId: 0,
  images: [],
};

function AdminPostProduct() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<UploadProduct>(initialFormData);
  const [alertMessage, setAlertMessage] = useState<string>("");
  // Image upload state: allow multiple images (min 1, max 3)
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { postProduct, isLoading, error, success, setError, setSuccess } =
    usePostProduct();

  // Xử lý thay đổi dữ liệu
  const handleChange = <K extends keyof UploadProduct>(
    field: K,
    value: UploadProduct[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearField = (field: keyof UploadProduct) => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
  };

  // Xử lý số lượng
  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "decrease" && formData.soLuong > 1) {
      handleChange("soLuong", formData.soLuong - 1);
    } else if (type === "increase") {
      handleChange("soLuong", formData.soLuong + 1);
    }
  };

  const handleSubmit = async () => {
    if (images.length < 1) {
      setAlertMessage("Vui lòng tải lên ít nhất 1 ảnh (tối đa 3 ảnh).");
      setStep(1);
      return;
    }
    if (
      formData.categoryId === 0 ||
      formData.tenSanPham === "" ||
      formData.tinhTrangId === 0 ||
      formData.giaBan === 0 ||
      formData.moTa === "" ||
      formData.mauSac === "" ||
      formData.thuongHieu === "" ||
      formData.kichThuoc === ""
    ) {
      setAlertMessage(
        "Vui lòng điền đầy đủ thông tin trước khi hoàn tất đăng bán!",
      );
      return;
    }
    console.log("Submitting product:", formData, images);
    await postProduct(formData, images);
    setFormData(initialFormData);
    setImages([]);
    setPreviews([]);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    console.log("Selected files:", selected);
    if (!selected) return;

    //Chuyển FileList thành mảng để dễ xử lý
    const selectedFiles = Array.from(selected);

    if (selectedFiles.length + images.length > 3) {
      setAlertMessage("Tối đa 3 ảnh thôi nhé.");
      return;
    }
    // Đoạn mã URL.createObjectURL tạo URL tạm thời cho mỗi file để hiển thị preview
    const newPreviews = selectedFiles.map((f) => {
      console.log("Creating preview for file:", f);
      const url = URL.createObjectURL(f);
      console.log("Created preview URL:", url);
      return url;
    });
    setImages((prev) => [...prev, ...selectedFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    // clear input value to allow re-uploading same files if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const url = prev[index];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
  };

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p));
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] py-10 font-sans text-brand-heading">
      <div className="max-w-4xl mx-auto px-6">
        {/* Title & Breadcrumb */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-[#4d5e45] mb-6">
            Đăng bán
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-600 ml-4 lg:ml-0">
            <span
              className={`cursor-pointer ${step === 1 ? "font-bold text-black" : "hover:underline"}`}
              onClick={() => setStep(1)}
            >
              Bước 1
            </span>
            <ChevronRight className="w-4 h-4" />
            <span
              className={`cursor-pointer ${step === 2 ? "font-bold text-black" : "hover:underline"}`}
              onClick={() => {
                // Tùy chọn: Thêm validate trước khi cho phép bấm sang bước 2
                setStep(2);
              }}
            >
              Bước 2
            </span>
          </div>
        </div>

        {alertMessage && (
          <div
            className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{alertMessage}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setAlertMessage("")}
            >
              <X className="w-5 h-5 text-red-500" />
            </span>
          </div>
        )}
        {error && (
          <div
            className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError("")}
            >
              <X className="w-5 h-5 text-red-500" />
            </span>
          </div>
        )}
        {success && (
          <div
            className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">
              Đăng bán thành công! hãy chờ admin duyệt sản phẩm
            </span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setSuccess(false)}
            >
              <X className="w-5 h-5 text-green-500" />
            </span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-8 border border-[#eaeaea]">
          {/* BƯỚC 1: Thông tin cơ bản */}
          {step === 1 && (
            <div className="space-y-8 max-w-3xl mx-auto">
              {/* Upload Ảnh */}
              <div className="space-y-2">
                <label className="font-semibold text-[15px]">Ảnh</label>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Camera className="w-10 h-10 text-gray-600 mb-3" />
                    <span className="font-semibold text-gray-800">
                      Nhấn để chọn ảnh hoặc kéo thả (tối đa 3 ảnh)
                    </span>
                    <span className="text-sm text-gray-500 mt-2">
                      Đã chọn {images.length} / 3
                    </span>
                  </div>

                  {previews.length > 0 && (
                    <div className="mt-4 flex items-center gap-3">
                      {previews.map((p, i) => (
                        <div
                          key={i}
                          className="relative w-24 h-24 rounded overflow-hidden border"
                        >
                          <img
                            src={p}
                            alt={`preview-${i}`}
                            className="object-cover w-full h-full"
                          />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow hover:cursor-pointer"
                            aria-label={`Remove image ${i + 1}`}
                          >
                            <X className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-gray-500 mt-2">
                    Tối thiểu 1 ảnh, tối đa 3 ảnh.
                  </p>
                </div>
              </div>

              <ListCategory
                categoryId={formData.categoryId}
                handleChange={handleChange}
              />

              {/* Tên sản phẩm */}
              <div className="space-y-2">
                <label className="font-semibold text-[15px]">
                  Tên sản phẩm
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="nhập vào"
                    className="w-full border border-gray-300 rounded-md p-3 pr-10 focus:outline-none focus:border-[#4d5e45]"
                    value={formData.tenSanPham}
                    onChange={(e) => handleChange("tenSanPham", e.target.value)}
                  />
                  {formData.tenSanPham && (
                    <X
                      className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 cursor-pointer hover:text-black"
                      onClick={() => handleClearField("tenSanPham")}
                    />
                  )}
                </div>
              </div>

              {/* Tình trạng */}
              <ListCondition formData={formData} handleChange={handleChange} />
            </div>
          )}

          {/* BƯỚC 2: Chi tiết sản phẩm */}
          {step === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Số lượng */}
              <div className="flex items-center gap-8">
                <label className="font-semibold text-[15px] min-w-30">
                  Số lượng
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <div className="w-16 h-8 rounded-md border border-black flex items-center justify-center font-medium">
                    {formData.soLuong}
                  </div>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Giá bán */}
              <div className="space-y-2">
                <label className="font-semibold text-[15px]">Giá bán</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="nhập vào"
                    className="w-full border border-black rounded-md p-3 pr-10 focus:outline-none"
                    value={formData.giaBan}
                    onChange={(e) =>
                      handleChange("giaBan", Number(e.target.value))
                    }
                  />
                  {formData.giaBan !== 0 && (
                    <X
                      className="absolute right-3 top-3.5 w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
                      onClick={() => handleClearField("giaBan")}
                    />
                  )}
                </div>
              </div>

              {/* Mô tả sản phẩm */}
              <div className="space-y-2">
                <label className="font-semibold text-[15px]">
                  Mô tả sản phẩm
                </label>
                <div className="relative">
                  <textarea
                    placeholder="nhập vào"
                    rows={4}
                    className="w-full border border-black rounded-[20px] p-4 pr-10 focus:outline-none resize-none"
                    value={formData.moTa}
                    onChange={(e) => handleChange("moTa", e.target.value)}
                  />
                  {formData.moTa && (
                    <X
                      className="absolute right-4 top-4 w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
                      onClick={() => handleClearField("moTa")}
                    />
                  )}
                </div>
              </div>

              {/* Màu sắc */}
              <div className="space-y-2">
                <label className="font-semibold text-[15px]">Màu sắc</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="nhập màu sắc"
                    className="w-full border border-black rounded-md p-3 pr-10 focus:outline-none"
                    value={formData.mauSac}
                    onChange={(e) => handleChange("mauSac", e.target.value)}
                  />
                  {formData.mauSac && (
                    <X
                      className="absolute right-3 top-3.5 w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
                      onClick={() => handleClearField("mauSac")}
                    />
                  )}
                </div>
              </div>

              {/* Thương hiệu */}
              <div className="space-y-2">
                <label className="font-semibold text-[15px]">Thương hiệu</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="nhập thương hiệu"
                    className="w-full border border-black rounded-md p-3 pr-10 focus:outline-none"
                    value={formData.thuongHieu}
                    onChange={(e) => handleChange("thuongHieu", e.target.value)}
                  />
                  {formData.thuongHieu && (
                    <X
                      className="absolute right-3 top-3.5 w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
                      onClick={() => handleClearField("thuongHieu")}
                    />
                  )}
                </div>
              </div>

              {/* Kích cỡ */}
              <div className="space-y-2">
                <label className="font-semibold text-[15px]">Kích cỡ</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Size XL /Size 37"
                    className="w-full border border-black rounded-md p-3 pr-10 focus:outline-none"
                    value={formData.kichThuoc}
                    onChange={(e) => handleChange("kichThuoc", e.target.value)}
                  />
                  {formData.kichThuoc && (
                    <X
                      className="absolute right-3 top-3.5 w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
                      onClick={() => handleClearField("kichThuoc")}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions / Buttons */}
        <div className="flex justify-center mt-6 gap-4">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="w-40 py-3 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Quay lại
            </button>
          )}

          <button
            onClick={() => (step === 1 ? setStep(2) : handleSubmit())}
            className="w-40 bg-[#4d5e45] text-white py-3 rounded-lg font-medium tracking-wide hover:bg-[#3A4930] transition-colors"
          >
            {step === 1 ? "Tiếp theo" : "Hoàn tất"}
          </button>
        </div>
      </div>
      {isLoading && <Loading />}
    </div>
  );
}

export default AdminPostProduct;
