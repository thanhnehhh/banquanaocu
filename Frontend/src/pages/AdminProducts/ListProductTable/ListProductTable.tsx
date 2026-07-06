import Pagination from "@/components/common/Pagination";
import axiosClient from "@/service/axiosClient";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import EditModal from "../components/EditModal";

interface ProductList {
  maSanPham: number;
  tenSanPham: string;
  soLuong: number;
  giaSanPham: number;
  emailSeller: string;
  trangThai: string;
  images: ProductImage;
}

interface ProductImage {
  tenAnd: string;
  duongDan: string;
}

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
  useEffect(() => {
    fetchPendingProducts(currentPage);
  }, [currentPage, reload]);
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
      .get("/products/admin", {
        params: {
          page,
          size: PAGE_SIZE,
        },
      })
      .then((res) => {
        const payload = res.data as any;
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

  const handleChangeActive = (data: any) => {
    if (data.active === true) {
      axiosClient
        .put(`/products/${data.maSanPham}/deactive`)
        .then((res) => {
          setSuccess(res.message);
          setData((prev) =>
            prev.map((p) =>
              p.maSanPham === data.maSanPham ? { ...p, active: false } : p,
            ),
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axiosClient
        .put(`/products/${data.maSanPham}/active`)
        .then((res) => {
          setSuccess(res.message);
          setData((prev) =>
            prev.map((p) =>
              p.maSanPham === data.maSanPham ? { ...p, active: true } : p,
            ),
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleChangeCondition = (data: any) => {};

  const handleSetEdit = (original: any) => {
    setEditModal(true);
    setProductId(original.maSanPham);
  };

  const columns = useMemo(
    () => [
      { accessorKey: "maSanPham", header: "ID", size: 80 },
      { accessorKey: "tenSanPham", header: "Sản phẩm", size: 200 },
      { accessorKey: "emailSeller", header: "Email người bán", size: 180 },
      { accessorKey: "giaSanPham", header: "Giá bán", size: 120 },
      { accessorKey: "active", header: "active", size: 100 },
      {
        id: "image",
        header: "Hình ảnh",
        size: 100,
        cell: ({ row }: any) => {
          const rawImages = row.original.images as
            | ProductImage
            | ProductImage[]
            | null
            | undefined;
          const firstImage = Array.isArray(rawImages)
            ? rawImages[0]
            : rawImages;

          return firstImage?.duongDan ? (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100">
              <img
                src={firstImage.duongDan}
                alt={firstImage.tenAnd || "Sản phẩm"}
                loading="lazy"
                decoding="async"
                className="h-16 w-16 object-cover"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-200 text-xs text-gray-500">
              Không có ảnh
            </div>
          );
        },
      },
      {
        accessorKey: "trangThai",
        header: "Trạng thái",
        size: 80,
        cell: ({ row }: any) => {
          const status = row.original.trangThai;
          let bgColor = "bg-yellow-100";
          let textColor = "text-yellow-800";
          if (status === "APPROVED") {
            bgColor = "bg-green-100";
            textColor = "text-green-800";
          } else if (status === "REJECTED") {
            bgColor = "bg-red-100";
            textColor = "text-red-800";
          }
          return (
            <span
              className={`${bgColor} ${textColor} px-2 py-1 rounded-full text-sm font-medium`}
            >
              {status === "PENDING"
                ? "Chờ duyệt"
                : status === "APPROVED"
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
          const original = row.original as any;
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleSetEdit(original)}
                className="px-3 py-1 rounded-md text-white text-sm font-medium bg-brand-primary hover:bg-[#3d4938] active:bg-[#2d3428]"
              >
                Sửa
              </button>
              <button
                onClick={() => handleChangeActive(original)}
                className={`w-20 py-1 rounded-md text-sm font-medium ${
                  original.active
                    ? "text-white bg-red-600 hover:bg-red-500 active:bg-red-700"
                    : "text-white bg-brand-primary hover:bg-[#3d4938] active:bg-[#2d3428]"
                }`}
              >
                {original.active ? "Deactive" : "Active"}
              </button>
            </div>
          );
        },
      },
    ],
    [handleSetEdit, handleChangeActive],
  );

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
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

  if (data === null || data.length === 0) {
    return (
      <>
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">Không có sản phẩm</p>
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
      <div className="w-full overflow-x-auto shadow-md rounded-lg relative">
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
                className={`border-b border-gray-200 ${
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
        {success && (
          <div className="absolute right-0 top-1 w-fit  mb-4 px-4 py-3 bg-[#EBF5E4] border border-[#CDE5BC] text-[#49613E] rounded-lg font-medium animate-pulse">
            ✓ {success}
          </div>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
      />
      {editModal && (
        <EditModal
          productId={productId}
          setEditModal={setEditModal}
          setSuccess={setSuccess}
          setData={setData}
          setReload={setReload}
        />
      )}
    </>
  );
}

export default ListProductTable;
