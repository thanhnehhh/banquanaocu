import { Link } from "react-router-dom";
import ListProductTable from "./ListProductTable/ListProductTable";

function AdminProducts() {
  return (
    <div>
      <div className="flex items-center gap-3 text-sm px-4 m-2">
        <span className="text-gray-500">Kênh ADMIN</span>
        <span className="text-gray-400 font-bold">›</span>
        <span className="font-bold text-brand-heading">Quản lý sản phẩm </span>
      </div>
      <div className="text-3xl p-10 m-2 flex justify-center items-center">
        Quản lý sản phẩm
      </div>
      <div className="my-4">
        <Link
          to="/admin/post"
          className="p-3 bg-brand-primary w-fit rounded-2xl text-white hover:cursor-pointer hover:opacity-85"
        >
          Thêm sản phẩm
        </Link>
      </div>

      <ListProductTable />
    </div>
  );
}

export default AdminProducts;
