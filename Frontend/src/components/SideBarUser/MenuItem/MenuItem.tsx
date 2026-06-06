import { NavLink } from "react-router-dom";

interface MenuItemProps {
  icon: React.ReactNode;
  text: string;
  to: string;
}

function MenuItem({ icon, text, to }: MenuItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-row gap-3 p-2 rounded-2xl transition-all font-manrope
        ${isActive ? "bg-white text-brand-secondary font-bold" : "hover:bg-white hover:text-brand-secondary cursor-pointer"}`
      }
    >
      {icon}
      <span>{text}</span>
    </NavLink>
  );
}

export default MenuItem;
