import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import Loading from "@/components/common/Loading";
import ListCategory from "@/pages/UserSellingPost/ListCategory/ListCategory";
import ListCondition from "@/pages/UserSellingPost/ListCondition/ListCondition";
import { uploadProductImage } from "@/service/productPostService";
import type UploadProduct from "@/model/UploadProduct";
import { patchSellProduct, updateSellerProduct, type ProductImageSeller, type ProductImageUpdatePayload, type SellProduct } from "@/services/productSellerService";
import UserProductSellImageEditor, { countVisibleImages, type ExistingImageEdit, type NewImageEdit } from "./UserProductSellImageEditor";

type Props = { product: SellProduct; onClose: () => void; onSaved: (updated: SellProduct, imagesChanged: boolean) => void; };
type ImageEditorState = { existing: ExistingImageEdit[]; added: NewImageEdit[]; };

async function buildImagePayload(state: ImageEditorState) {
  const deleteImageIds = state.existing.filter((i) => i.markedDelete).map((i) => i.maHinhAnh);
  const images: ProductImageUpdatePayload[] = [];
  const finalImages: ProductImageSeller[] = [];
  for (const img of state.existing) {
    if (img.markedDelete) continue;
    if (img.replaceFile) {
      const duongDan = await uploadProductImage(img.replaceFile);
      images.push({ maHinhAnh: img.maHinhAnh, tenAnh: img.replaceFile.name, duongDan });
      finalImages.push({ maHinhAnh: img.maHinhAnh, tenHinhAnh: img.replaceFile.name, duongDan });
    } else { finalImages.push({ maHinhAnh: img.maHinhAnh, tenHinhAnh: img.tenHinhAnh, duongDan: img.duongDan }); }
  }
  for (const neu of state.added) {
    const duongDan = await uploadProductImage(neu.file);
    images.push({ maHinhAnh: 0, tenAnh: neu.file.name, duongDan });
    finalImages.push({ maHinhAnh: 0, tenHinhAnh: neu.file.name, duongDan });
  }
  return { deleteImageIds, images, finalImages, changed: deleteImageIds.length > 0 || images.length > 0 || state.added.length > 0 };
}

function UserProductSellEditModal({ product, onClose, onSaved }: Props) {
  const [form, setForm] = useState<UploadProduct>({ tenSanPham: product.name, soLuong: product.inStock, giaBan: product.priceValue, moTa: product.moTa, mauSac: product.mauSac, kichThuoc: product.kichCo, thuongHieu: product.thuongHieu, categoryId: product.maTheLoai, tinhTrangId: product.maTinhTrang, images: [] });
  const [imageState, setImageState] = useState<ImageEditorState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleImageChange = useCallback((state: ImageEditorState) => setImageState(state), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleChange = <K extends keyof UploadProduct>(field: K, value: UploadProduct[K]) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tenSanPham.trim() || form.categoryId === 0 || form.tinhTrangId === 0 || form.giaBan <= 0 || !form.moTa.trim()) { setError("Vui lòng điền đầy đủ các trường bắt buộc."); return; }
    if (form.soLuong < product.soLuongDaBan) { setError(`Số lượng không được nhỏ hơn số đã bán (${product.soLuongDaBan}).`); return; }
    if (!imageState) { setError("Ảnh chưa sẵn sàng."); return; }
    const visibleCount = countVisibleImages(imageState.existing, imageState.added);
    if (visibleCount < 1) { setError("Sản phẩm phải có ít nhất 1 ảnh."); return; }
    if (visibleCount > 3) { setError("Tối đa 3 ảnh cho mỗi sản phẩm."); return; }
    setSaving(true); setError(null);
    try {
      const imagePayload = await buildImagePayload(imageState);
      await updateSellerProduct(product.id, { tenSanPham: form.tenSanPham.trim(), soLuong: form.soLuong, giaBan: form.giaBan, moTa: form.moTa.trim(), mauSac: form.mauSac.trim(), kichThuoc: form.kichThuoc.trim(), thuongHieu: form.thuongHieu.trim(), categoryId: form.categoryId, tinhTrangId: form.tinhTrangId, ...(imagePayload.deleteImageIds.length > 0 && { deleteImageIds: imagePayload.deleteImageIds }), ...(imagePayload.images.length > 0 && { images: imagePayload.images }) });
      onSaved(patchSellProduct(product, { name: form.tenSanPham.trim(), inStock: form.soLuong, priceValue: form.giaBan, moTa: form.moTa.trim(), mauSac: form.mauSac.trim(), kichCo: form.kichThuoc.trim(), thuongHieu: form.thuongHieu.trim(), maTheLoai: form.categoryId, maTinhTrang: form.tinhTrangId, images: imagePayload.finalImages, image: imagePayload.finalImages[0]?.duongDan ?? product.image }), imagePayload.changed);
      onClose();
    } catch { setError("Không lưu được thay đổi. Vui lòng thử lại."); }
    finally { setSaving(false); }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={saving ? undefined : onClose}>
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
            <h2 className="text-lg font-bold text-brand-heading">Chỉnh sửa sản phẩm</h2>
            <button type="button" onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
            {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <UserProductSellImageEditor initialImages={product.images} onChange={handleImageChange} />
            <ListCategory categoryId={form.categoryId} handleChange={handleChange} />
            <div className="space-y-1"><label className="text-sm font-semibold">Tên sản phẩm</label><input type="text" value={form.tenSanPham} onChange={(e) => handleChange("tenSanPham", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none" /></div>
            <ListCondition formData={form} handleChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-sm font-semibold">Số lượng</label><input type="number" min={product.soLuongDaBan} value={form.soLuong} onChange={(e) => handleChange("soLuong", Math.max(0, Number(e.target.value)))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none" /></div>
              <div className="space-y-1"><label className="text-sm font-semibold">Giá bán (VNĐ)</label><input type="number" min={1} value={form.giaBan || ""} onChange={(e) => handleChange("giaBan", Number(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none" /></div>
            </div>
            <div className="space-y-1"><label className="text-sm font-semibold">Mô tả</label><textarea rows={3} value={form.moTa} onChange={(e) => handleChange("moTa", e.target.value)} className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none" /></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1"><label className="text-sm font-semibold">Màu sắc</label><input type="text" value={form.mauSac} onChange={(e) => handleChange("mauSac", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none" /></div>
              <div className="space-y-1"><label className="text-sm font-semibold">Thương hiệu</label><input type="text" value={form.thuongHieu} onChange={(e) => handleChange("thuongHieu", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none" /></div>
              <div className="space-y-1"><label className="text-sm font-semibold">Kích cỡ</label><input type="text" value={form.kichThuoc} onChange={(e) => handleChange("kichThuoc", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none" /></div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button type="button" onClick={onClose} className="rounded-full border border-gray-200 px-5 py-2 text-sm text-gray-700 hover:bg-gray-50">Hủy</button>
              <button type="submit" disabled={saving} className="rounded-full bg-brand-primary px-5 py-2 text-sm font-medium text-white hover:bg-[#3d4938] disabled:opacity-60">{saving ? "Đang lưu..." : "Lưu thay đổi"}</button>
            </div>
          </form>
        </div>
      </div>
      {saving && <Loading />}
    </>
  );
}

export default UserProductSellEditModal;
