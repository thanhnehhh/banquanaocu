import { useEffect, useState } from "react";
import { X } from "lucide-react";
import axiosClient from "@/service/axiosClient";
import ListCategory from "@/pages/AdminPostProduct/ListCategory/ListCategory";
import ListCondition from "@/pages/AdminPostProduct/ListCondition/ListCondition";
import ImageEditor from "./ImageEditor";
import supabase from "@/lib/supabaseClient";
import Loading from "@/components/common/Loading";

function EditModal({ productId, setEditModal, setSuccess, setData, setReload }: any) {
  const [form, setForm] = useState<any>({ tenSanPham: "", soLuong: 0, giaBan: 0, moTa: "", mauSac: "", thuongHieu: "", soLuongDaBan: 0, categoryId: 0, tinhTrangId: 0, kichThuoc: "", images: [], deleteImageIds: [] });
  const [images, setImages] = useState<any>();
  const [deleteImage, setDeleteImage] = useState<any>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosClient.get(`/products/${productId}`).then((res) => {
      const data = (res as any).data;
      setForm({ tenSanPham: data.tenSanPham, soLuong: data.soLuong, giaBan: data.giaSanPham, moTa: data.moTa, mauSac: data.mauSac, thuongHieu: data.thuongHieu, soLuongDaBan: data.soLuongDaBan, categoryId: data.maTheLoai, tinhTrangId: data.maTinhTrang, kichThuoc: data.kichCo, images: data.images });
    }).catch(console.log);
  }, []);

  const handleChange = <K extends keyof any>(field: K, value: any) => setForm((prev: any) => ({ ...prev, [field]: value }));

  const submit = async (e: any) => {
    setLoading(true); e.preventDefault();
    try {
      const uploadedImages = await Promise.all(images.map(async (img: any) => {
        if (!img.file) return { maHinhAnh: img.maHinhAnh, tenHinhAnh: img.tenHinhAnh, duongDan: img.duongDan };
        const fileName = `${Date.now()}_${img.tenHinhAnh}`;
        const { error } = await supabase.storage.from("product").upload(fileName, img.file);
        if (error) throw error;
        const { data } = supabase.storage.from("product").getPublicUrl(fileName);
        return { maHinhAnh: img.maHinhAnh, tenAnh: img.tenHinhAnh, duongDan: data.publicUrl };
      }));
      const payload = { ...form, images: uploadedImages, deleteImageIds: deleteImage };
      const res = await axiosClient.put(`/products/${productId}`, payload);
      setSuccess((res as any).message);
      setData((prev: any[]) => prev.map((p: any) => p.maSanPham === productId ? { ...p, tenSanPham: form.tenSanPham, giaSanPham: form.giaBan } : p));
      setReload([]); setEditModal(false);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
            <h2 className="text-lg font-bold text-brand-heading">Chỉnh sửa sản phẩm</h2>
            <button onClick={() => setEditModal(false)} type="button" className="rounded-full p-1 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
          </div>
          <form onSubmit={submit} className="space-y-5 px-6 py-5">
            <ImageEditor initialImages={form.images} setImages={setImages} setDeleteImage={setDeleteImage} />
            <ListCategory categoryId={form.categoryId} handleChange={handleChange} />
            <div className="space-y-1"><label className="text-sm font-semibold">Tên sản phẩm</label><input type="text" value={form.tenSanPham} onChange={(e) => handleChange("tenSanPham", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none" /></div>
            <ListCondition formData={form} handleChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-sm font-semibold">Số lượng</label><input type="number" value={form.soLuong} onChange={(e) => handleChange("soLuong", Math.max(0, Number(e.target.value)))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none" /></div>
              <div className="space-y-1"><label className="text-sm font-semibold">Giá bán (VNĐ)</label><input type="number" min={1} value={form.giaBan || ""} onChange={(e) => handleChange("giaBan", Number(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none" /></div>
            </div>
            <div className="space-y-1"><label className="text-sm font-semibold">Mô tả</label><textarea rows={3} value={form.moTa} onChange={(e) => handleChange("moTa", e.target.value)} className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none" /></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1"><label className="text-sm font-semibold">Màu sắc</label><input type="text" value={form.mauSac} onChange={(e) => handleChange("mauSac", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none" /></div>
              <div className="space-y-1"><label className="text-sm font-semibold">Thương hiệu</label><input type="text" value={form.thuongHieu} onChange={(e) => handleChange("thuongHieu", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none" /></div>
              <div className="space-y-1"><label className="text-sm font-semibold">Kích cỡ</label><input type="text" value={form.kichThuoc} onChange={(e) => handleChange("kichThuoc", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none" /></div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button onClick={() => setEditModal(false)} type="button" className="rounded-full border border-gray-200 px-5 py-2 text-sm text-gray-700 hover:bg-gray-50">Hủy</button>
              <button type="submit" className="rounded-full bg-brand-primary px-5 py-2 text-sm font-medium text-white hover:bg-[#3d4938]">Lưu</button>
            </div>
          </form>
        </div>
      </div>
      {loading && <Loading />}
    </>
  );
}

export default EditModal;
