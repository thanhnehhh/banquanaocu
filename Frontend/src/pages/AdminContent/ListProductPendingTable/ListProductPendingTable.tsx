import { useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import axiosClient from "@/service/axiosClient";
import Pagination from "@/components/common/Pagination";
import type ProductPending from "../interface/ProductPending";

const PAGE_SIZE = 5;

function ListProductPendingTable() {
  const [data, setData] = useState<ProductPending[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { fetchPendingProducts(currentPage); }, [currentPage]);
  useEffect(() => { if (success) { const t = setTimeout(() => setSuccess(""), 3000); return () => clearTimeout(t); } }, [success]);

  const fetchPendingProducts = (page: number) => {
    setLoading(true); setError(null);
    axiosClient.get("/products/pending", { params: { page, size: PAGE_SIZE } })
      .then((res) => { const p = (res as any).data; setData(p.content || []); setTotalPages(p.totalPages ?? 1); setCurrentPage(p.number ?? page); })
      .catch(() => setError("Lỗi khi tải dữ liệu sản phẩm"))
      .finally(() => setLoading(false));
  };

  const handleApprove = (maSanPham: number) => {
    setApprovingId(maSanPham); setLoading(true);
    axiosClient.put(`/products/${maSanPham}/approve`)
      .then((res) => { setSuccess((res as any).message || "Duyệt thành công"); setData((prev) => prev.map((p) => p.maSanPham === maSanPham ? { ...p, trangThai: "approved" } : p)); })
      .catch(console.error).finally(() => { setApprovingId(null); setLoading(false); });
  };

  const handleReject = (maSanPham: number) => {
    setRejectingId(maSanPham);
    axiosClient.put(`/products/${maSanPham}/reject`, { lyDo: "Sản phẩm không hợp lệ" })
      .then((res) => { setSuccess((res as any).message || "Từ chối thành công"); setData((prev) => prev.map((p) => p.maSanPham === maSanPham ? { ...p, trangThai: "rejected" } : p)); })
      .catch(console.error).finally(() => { setRejectingId(null); setLoading(false); });
  };

  const columns = [
    { accessorKey: "maSanPham", header: "ID", size: 80 },
    { accessorKey: "tenSanPham", header: "Sản phẩm", size: 200 },
    { accessorKey: "emailSeller", header: "Email người bán", size: 180 },
    { accessorKey: "giaSanPham", header: "Giá bán", size: 120 },
    { accessorKey: "soLuong", header: "Số lượng", size: 100 },
    { id: "image", header: "Hình ảnh", size: 100, cell: ({ row }: any) => {
      const img = row.original.images?.[0];
      return img ? <img src={img.duongDan} alt={img.tenAnd || "Sản phẩm"} className="w-16 h-16 object-cover rounded-md" /> : <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">Không có ảnh</div>;
    }},
    { accessorKey: "trangThai", header: "Trạng thái", size: 120, cell: ({ row }: any) => {
      const s = row.original.trangThai;
      return <span className={`px-3 py-1 rounded-full text-sm font-medium ${s === "approved" ? "bg-green-100 text-green-800" : s === "rejected" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>{s === "PENDING" ? "Chờ duyệt" : s === "approved" ? "Đã duyệt" : "Đã từ chối"}</span>;
    }},
    { id: "actions", header: "Hành động", cell: ({ row }: any) => {
      const p = row.original as ProductPending;
      return <div className="flex gap-2">
        <button onClick={() => handleApprove(p.maSanPham)} disabled={approvingId === p.maSanPham || p.trangThai !== "PENDING"} className={`px-3 py-1 rounded-md text-white text-sm font-medium ${p.trangThai !== "PENDING" ? "bg-gray-300 cursor-not-allowed" : "bg-brand-primary hover:bg-[#3d4938]"}`}>{approvingId === p.maSanPham ? "Đang..." : "Duyệt"}</button>
        <button onClick={() => handleReject(p.maSanPham)} disabled={rejectingId === p.maSanPham || p.trangThai !== "PENDING"} className={`px-3 py-1 rounded-md text-white text-sm font-medium ${p.trangThai !== "PENDING" ? "bg-gray-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}`}>{rejectingId === p.maSanPham ? "Đang..." : "Từ chối"}</button>
      </div>;
    }},
  ];

  const table = useReactTable({ data: data || [], columns, getCoreRowModel: getCoreRowModel() });

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#49613E]"></div></div>;
  if (error) return <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800"><p>{error}</p><button onClick={() => fetchPendingProducts(currentPage)} className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md">Thử lại</button></div>;
  if (data.length === 0) return <><div className="text-center py-8 bg-gray-50 rounded-lg"><p className="text-gray-600">Không có sản phẩm chờ duyệt</p></div><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} loading={loading} /></>;

  return (
    <>
      {success && <div className="mb-4 px-4 py-3 bg-[#EBF5E4] border border-[#CDE5BC] text-[#49613E] rounded-lg font-medium">✓ {success}</div>}
      <div className="w-full overflow-x-auto shadow-md rounded-lg">
        <table className="w-full border-collapse bg-white">
          <thead>{table.getHeaderGroups().map((hg) => (<tr key={hg.id} className="bg-gradient-to-r from-[#49613E] to-[#3d4938] text-white">{hg.headers.map((h) => <th key={h.id} className="px-6 py-3 text-left text-sm font-semibold">{flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>))}</thead>
          <tbody>{table.getRowModel().rows.map((row, idx) => (<tr key={row.id} className={`border-b border-gray-200 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-[#F9FAF4]`}>{row.getVisibleCells().map((cell) => <td key={cell.id} className="px-6 py-4 text-sm text-gray-800">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>))}</tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} loading={loading} />
    </>
  );
}

export default ListProductPendingTable;
