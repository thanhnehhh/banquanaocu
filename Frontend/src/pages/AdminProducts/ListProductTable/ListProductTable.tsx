import Pagination from "@/components/common/Pagination";
import axiosClient from "@/service/axiosClient";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import EditModal from "../components/EditModal";

interface ProductList { maSanPham: number; tenSanPham: string; soLuong: number; giaSanPham: number; emailSeller: string; trangThai: string; active: boolean; images: { tenAnd: string; duongDan: string }; }

const PAGE_SIZE = 5;

function ListProductTable() {
  const [data, setData] = useState<ProductList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [editModal, setEditModal] = useState(false);
  const [productId, setProductId] = useState<Number | null>(null);
  const [reload, setReload] = useState([]);

  useEffect(() => { fetchProducts(currentPage); }, [currentPage, reload]);
  useEffect(() => { if (success) { const t = setTimeout(() => setSuccess(""), 3000); return () => clearTimeout(t); } }, [success]);

  const fetchProducts = (page: number) => {
    setLoading(true); setError(null);
    axiosClient.get("/products/admin", { params: { page, size: PAGE_SIZE } })
      .then((res) => { const p = (res as any).data; setData(p.content || []); setTotalPages(p.totalPages ?? 1); setCurrentPage(p.number ?? page); })
      .catch(() => setError("Lỗi khi tải dữ liệu sản phẩm"))
      .finally(() => setLoading(false));
  };

  const handleChangeActive = (row: any) => {
    const endpoint = row.active ? `/products/${row.maSanPham}/deactive` : `/products/${row.maSanPham}/active`;
    axiosClient.put(endpoint)
      .then((res) => { setSuccess((res as any).message); setData((prev) => prev.map((p) => p.maSanPham === row.maSanPham ? { ...p, active: !row.active } : p)); })
      .catch(console.log);
  };

  const columns = [
    { accessorKey: "maSanPham", header: "ID", size: 80 },
    { accessorKey: "tenSanPham", header: "Sản phẩm", size: 200 },
    { accessorKey: "emailSeller", header: "Email người bán", size: 180 },
    { accessorKey: "giaSanPham", header: "Giá bán", size: 120 },
    { accessorKey: "active", header: "Active", size: 100 },
    { id: "image", header: "Hình ảnh", size: 100, cell: ({ row }: any) => {
      const img = row.original.images;
      return img ? <img src={img.duongDan} alt={img.tenAnd || "Sản phẩm"} className="w-16 h-16 object-cover rounded-md" /> : <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">Không có ảnh</div>;
    }},
    { accessorKey: "trangThai", header: "Trạng thái", size: 100, cell: ({ row }: any) => {
      const s = row.original.trangThai;
      return <span className={`px-2 py-1 rounded-full text-sm font-medium ${s === "APPROVED" ? "bg-green-100 text-green-800" : s === "REJECTED" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>{s === "PENDING" ? "Chờ duyệt" : s === "APPROVED" ? "Đã duyệt" : "Đã từ chối"}</span>;
    }},
    { id: "actions", header: "Hành động", cell: ({ row }: any) => {
      const original = row.original;
      return <div className="flex gap-2">
        <button onClick={() => { setEditModal(true); setProductId(original.maSanPham); }} className="px-3 py-1 rounded-md text-white text-sm font-medium bg-brand-primary hover:bg-[#3d4938]">Sửa</button>
        <button onClick={() => handleChangeActive(original)} className="w-24 py-1 rounded-md text-white text-sm font-medium bg-red-600 hover:bg-red-500">{original.active ? "Deactive" : "Active"}</button>
      </div>;
    }},
  ];

  const table = useReactTable({ data: data || [], columns, getCoreRowModel: getCoreRowModel() });

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div></div>;
  if (error) return <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800"><p>{error}</p><button onClick={() => fetchProducts(currentPage)} className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md">Thử lại</button></div>;
  if (!data.length) return <><div className="text-center py-8 bg-gray-50 rounded-lg"><p className="text-gray-600 text-lg">Không có sản phẩm</p></div><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} loading={loading} /></>;

  return (
    <>
      <div className="w-full overflow-x-auto shadow-md rounded-lg relative">
        <table className="w-full border-collapse bg-white">
          <thead>{table.getHeaderGroups().map((hg) => (<tr key={hg.id} className="bg-gradient-to-r from-[#49613E] to-[#3d4938] text-white">{hg.headers.map((h) => <th key={h.id} className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-200">{flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>))}</thead>
          <tbody>{table.getRowModel().rows.map((row, idx) => (<tr key={row.id} className={`border-b border-gray-200 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-[#F9FAF4]`}>{row.getVisibleCells().map((cell) => <td key={cell.id} className="px-6 py-4 text-sm text-gray-800">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>))}</tbody>
        </table>
        {success && <div className="absolute right-0 top-1 mb-4 px-4 py-3 bg-[#EBF5E4] border border-[#CDE5BC] text-[#49613E] rounded-lg font-medium">✓ {success}</div>}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} loading={loading} />
      {editModal && productId && <EditModal productId={productId} setEditModal={setEditModal} setSuccess={setSuccess} setData={setData} setReload={setReload} />}
    </>
  );
}

export default ListProductTable;
