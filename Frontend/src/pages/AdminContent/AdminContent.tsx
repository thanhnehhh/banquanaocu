import ListProductPendingTable from "./ListProductPendingTable/ListProductPendingTable";

function AdminContent() {
  return (
    <div>
      <div className="flex items-center gap-3 text-sm px-4 m-2">
        <span className="text-gray-500">Kênh ADMIN</span>
        <span className="text-gray-400 font-bold">›</span>
        <span className="font-bold text-brand-heading">Duyệt sản phẩm</span>
      </div>
      <div className="text-3xl p-10 m-2 flex justify-center items-center">Duyệt sản phẩm</div>
      <ListProductPendingTable />
    </div>
  );
}

export default AdminContent;
