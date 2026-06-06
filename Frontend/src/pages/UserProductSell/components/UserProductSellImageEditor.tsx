import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import type { ProductImageSeller } from "@/services/productSellerService";

const MAX_IMAGES = 3;

export type ExistingImageEdit = {
  maHinhAnh: number; tenHinhAnh: string; duongDan: string;
  preview: string; markedDelete: boolean; replaceFile: File | null; replacePreview: string | null;
};
export type NewImageEdit = { tempId: string; file: File; preview: string; };
type Props = { initialImages: ProductImageSeller[]; onChange: (state: { existing: ExistingImageEdit[]; added: NewImageEdit[] }) => void; };

function UserProductSellImageEditor({ initialImages, onChange }: Props) {
  const [existing, setExisting] = useState<ExistingImageEdit[]>(() =>
    initialImages.map((img) => ({ maHinhAnh: img.maHinhAnh, tenHinhAnh: img.tenHinhAnh, duongDan: img.duongDan, preview: img.duongDan, markedDelete: false, replaceFile: null, replacePreview: null }))
  );
  const [added, setAdded] = useState<NewImageEdit[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replacingIdRef = useRef<number | null>(null);
  const visibleCount = existing.filter((i) => !i.markedDelete).length + added.length;
  const canAddMore = visibleCount < MAX_IMAGES;

  useEffect(() => { onChange({ existing, added }); }, [existing, added, onChange]);

  const handleAddFiles = (files: FileList | null) => {
    if (!files) return;
    const slotsLeft = MAX_IMAGES - visibleCount;
    if (slotsLeft <= 0) return;
    const toAdd = Array.from(files).slice(0, slotsLeft).map((file) => ({ tempId: `${Date.now()}_${Math.random()}`, file, preview: URL.createObjectURL(file) }));
    setAdded((prev) => [...prev, ...toAdd]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReplaceFile = (files: FileList | null) => {
    const id = replacingIdRef.current;
    if (!files || id == null) return;
    const file = files[0]; if (!file) return;
    setExisting((prev) => prev.map((img) => img.maHinhAnh !== id ? img : { ...img, markedDelete: false, replaceFile: file, replacePreview: URL.createObjectURL(file) }));
    replacingIdRef.current = null;
    if (replaceInputRef.current) replaceInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">Ảnh sản phẩm (1–3)</label>
      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleAddFiles(e.target.files)} />
      <input ref={replaceInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleReplaceFile(e.target.files)} />
      <div className="flex flex-wrap gap-3">
        {existing.map((img) => img.markedDelete ? (
          <div key={img.maHinhAnh} className="relative flex h-24 w-24 flex-col items-center justify-center rounded-lg border border-dashed border-red-300 bg-red-50">
            <span className="text-xs text-red-600">Đã xóa</span>
            <button type="button" onClick={() => setExisting((p) => p.map((i) => i.maHinhAnh === img.maHinhAnh ? { ...i, markedDelete: false } : i))} className="mt-1 text-xs text-brand-primary underline">Hoàn tác</button>
          </div>
        ) : (
          <div key={img.maHinhAnh} className="relative">
            <img src={img.replacePreview ?? img.preview} alt="" className="h-24 w-24 rounded-lg border object-cover" />
            <button type="button" onClick={() => setExisting((p) => p.map((i) => i.maHinhAnh === img.maHinhAnh ? { ...i, markedDelete: true, replaceFile: null, replacePreview: null } : i))}
              disabled={visibleCount <= 1} className="absolute -right-1 -top-1 rounded-full bg-white p-1 shadow disabled:opacity-40">
              <X className="h-4 w-4 text-gray-700" />
            </button>
            <button type="button" onClick={() => { replacingIdRef.current = img.maHinhAnh; replaceInputRef.current?.click(); }} className="absolute bottom-1 left-1 right-1 rounded bg-black/55 py-0.5 text-center text-[10px] text-white">Đổi ảnh</button>
          </div>
        ))}
        {added.map((img) => (
          <div key={img.tempId} className="relative">
            <img src={img.preview} alt="" className="h-24 w-24 rounded-lg border border-green-300 object-cover" />
            <span className="absolute left-1 top-1 rounded bg-green-600 px-1 text-[10px] text-white">Mới</span>
            <button type="button" onClick={() => setAdded((p) => { const t = p.find((a) => a.tempId === img.tempId); if (t) URL.revokeObjectURL(t.preview); return p.filter((a) => a.tempId !== img.tempId); })} className="absolute -right-1 -top-1 rounded-full bg-white p-1 shadow">
              <X className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        ))}
        {canAddMore && (
          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-brand-primary hover:text-brand-primary">
            <Camera className="mb-1 h-6 w-6" /><span className="text-[10px]">Thêm</span>
          </button>
        )}
      </div>
      <p className="text-xs text-gray-400">{visibleCount} / {MAX_IMAGES} ảnh</p>
    </div>
  );
}

export function countVisibleImages(existing: ExistingImageEdit[], added: NewImageEdit[]) {
  return existing.filter((i) => !i.markedDelete).length + added.length;
}

export default UserProductSellImageEditor;
