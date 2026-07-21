import { NavLink } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { navigationItems } from "../constants/navigation";
import { useAuth } from "../hooks/useAuth";

interface SidebarProps {
    mobile?: boolean;
    onClose?: () => void;
}

const Sidebar = ({ mobile = false, onClose }: SidebarProps) => {
    const { user } = useAuth();

    const filteredNavigation = navigationItems.filter(item =>
        user?.role && item.roles.includes(user.role)
    );

    return (
        <aside className="flex h-full w-64 flex-col bg-[var(--color-sidebar)] text-white">

            <div className="flex h-16 items-center justify-between border-b border-slate-700 px-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--color-primary)] font-bold">
                        M
                    </div>

                    <div>
                        <h2 className="font-semibold">MSMS</h2>
                        <p className="text-xs text-slate-400">Milk Management</p>
                    </div>
                </div>

                {mobile && (
                    <button
                        onClick={onClose}
                        className="rounded-md p-2 text-slate-300 hover:bg-slate-700"
                    >
                        <FiX size={20} />
                    </button>
                )}
            </div>

            <nav className="flex-1 space-y-1 px-3 py-5">
                {filteredNavigation.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center rounded-md px-3 py-2.5 text-sm transition ${
                                isActive
                                    ? "bg-[var(--color-sidebar-hover)] text-white"
                                    : "text-slate-300 hover:bg-[var(--color-sidebar-hover)]"
                            }`
                        }
                    >
                        {item.title}
                    </NavLink>
                ))}
            </nav>

            <div className="border-t border-slate-700 px-5 py-4 text-xs text-slate-400">
                Version 1.0.0
            </div>
        </aside>
    );
};

export default Sidebar;