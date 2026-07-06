import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import axiosClient from "@/service/axiosClient";
import Pagination from "@/components/common/Pagination";
import type ProductPending from "../interface/ProductPending";

interface PendingProductsPage {
  content: ProductPending[];
  totalPages: number;
  number: number;
}

interface ApiMessageResponse {
  message?: string;
}

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

  useEffect(() => {
    fetchPendingProducts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchPendingProducts = (page: number) => {
    setLoading(true);
    setError(null);
    axiosClient
      .get<PendingProductsPage>("/products/pending", {
        params: {
          page,
          size: PAGE_SIZE,
        },
      })
      .then((res) => {
        const payload = res.data as unknown as PendingProductsPage;
        console.log(payload);
        setData(payload.content || []);
        setTotalPages(payload.totalPages ?? 1);
        setCurrentPage(payload.number ?? page);
      })
      .catch((err) => {
        setError("Lỗi khi tải dữ liệu sản phẩm");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    setCurrentPage(page);
  };

  function handleApprove(maSanPham: number) {
    setApprovingId(maSanPham);
    setLoading(true);
    axiosClient
      .put<ApiMessageResponse>(`/products/${maSanPham}/approve`)
      .then((res) => {
        const payload = res as unknown as ApiMessageResponse;
        setSuccess(payload.message || "Duyệt thành công");
        setData((prev) =>
          prev.map((p) =>
            p.maSanPham === maSanPham ? { ...p, trangThai: "approved" } : p,
          ),
        );
      })
      .catch((err) => {
        console.error("Lỗi duyệt sản phẩm:", err);
      })
      .finally(() => {
        setApprovingId(null);
        setLoading(false);
      });
  }

  function handleReject(maSanPham: number) {
    setRejectingId(maSanPham);
    axiosClient
      .put<ApiMessageResponse>(`/products/${maSanPham}/reject`, {
        lyDo: "Sản phẩm không hợp lệ",
      })
      .then((res) => {
        const payload = res as unknown as ApiMessageResponse;
        setSuccess(payload.message || "Từ chối thành công");
        setData((prev) =>
          prev.map((p) =>
            p.maSanPham === maSanPham ? { ...p, trangThai: "rejected" } : p,
          ),
        );
      })
      .catch((err) => {
        console.error("Lỗi từ chối sản phẩm:", err);
      })
      .finally(() => {
        setRejectingId(null);
        setLoading(false);
      });
  }

  const columns = [
    { accessorKey: "maSanPham", header: "ID", size: 80 },
    { accessorKey: "tenSanPham", header: "Sản phẩm", size: 200 },
    { accessorKey: "emailSeller", header: "Email người bán", size: 180 },
    { accessorKey: "giaSanPham", header: "Giá bán", size: 120 },
    { accessorKey: "soLuong", header: "Số lượng", size: 100 },
    {
      id: "image",
      header: "Hình ảnh",
      size: 100,
      cell: ({ row }: any) => {
        const images = row.original.images || [];
        const firstImage = images[0];
        return firstImage ? (
          <img
            src={firstImage.duongDan}
            alt={firstImage.tenAnd || "Sản phẩm"}
            className="w-16 h-16 object-cover rounded-md"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
            Không có ảnh
          </div>
        );
      },
    },
    {
      accessorKey: "trangThai",
      header: "Trạng thái",
      size: 120,
      cell: ({ row }: any) => {
        const status = row.original.trangThai;
        let bgColor = "bg-yellow-100";
        let textColor = "text-yellow-800";
        if (status === "approved") {
          bgColor = "bg-green-100";
          textColor = "text-green-800";
        } else if (status === "rejected") {
          bgColor = "bg-red-100";
          textColor = "text-red-800";
        }
        return (
          <span
            className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-sm font-medium`}
          >
            {status === "PENDING"
              ? "Chờ duyệt"
              : status === "approved"
                ? "Đã duyệt"
                : "Đã từ chối"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }: any) => {
        const original = row.original as ProductPending;
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleApprove(original.maSanPham)}
              disabled={
                approvingId === original.maSanPham ||
                original.trangThai !== "PENDING"
              }
              className={`px-3 py-1 rounded-md text-white text-sm font-medium transition-colors ${
                approvingId === original.maSanPham
                  ? "bg-brand-primary cursor-wait opacity-70"
                  : original.trangThai !== "PENDING"
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-brand-primary hover:bg-[#3d4938] active:bg-[#2d3428]"
              }`}
            >
              {approvingId === original.maSanPham ? "Đang..." : "Duyệt"}
            </button>
            <button
              onClick={() => handleReject(original.maSanPham)}
              disabled={
                rejectingId === original.maSanPham ||
                original.trangThai !== "PENDING"
              }
              className={`px-3 py-1 rounded-md text-white text-sm font-medium transition-colors ${
                rejectingId === original.maSanPham
                  ? "bg-red-600 cursor-wait opacity-70"
                  : original.trangThai !== "PENDING"
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600 active:bg-red-700"
              }`}
            >
              {rejectingId === original.maSanPham ? "Đang..." : "Từ chối"}
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#49613E]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-semibold">Lỗi: {error}</p>
        <button
          onClick={() => fetchPendingProducts(currentPage)}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <>
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">
            Không có sản phẩm nào chờ duyệt
          </p>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          loading={loading}
        />
      </>
    );
  }

  return (
    <>
      {success && (
        <div className="mb-4 px-4 py-3 bg-[#EBF5E4] border border-[#CDE5BC] text-[#49613E] rounded-lg font-medium animate-pulse">
          ✓ {success}
        </div>
      )}
      <div className="w-full overflow-x-auto shadow-md rounded-lg">
        <table className="w-full border-collapse bg-white">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr
                key={hg.id}
                className="bg-gradient-to-r from-[#49613E] to-[#3d4938] text-white"
              >
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-200"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, idx) => (
              <tr
                key={row.id}
                className={`border-b border-gray-200 transition-colors ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-[#F9FAF4]`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-sm text-gray-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </>
  );
}

export default ListProductPendingTable;
