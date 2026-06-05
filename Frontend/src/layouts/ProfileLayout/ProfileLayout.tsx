import SideBarUser from "@/components/SideBarUser";
import { Outlet } from "react-router-dom";

function ProfileLayout() {
    return (
        <div className="grid grid-cols-12 gap-4">
            <aside className="col-span-2 bg-brand-input p-8">
                <SideBarUser />
            </aside>
            <main className="col-span-10 bg-brand-bg">
                <Outlet />
            </main>
        </div>
    );
}

export default ProfileLayout;
