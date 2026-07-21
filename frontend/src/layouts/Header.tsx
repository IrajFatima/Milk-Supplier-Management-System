import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    title?: string;
    breadcrumb?: string;
    onMenuClick?: () => void;
}

const Header = ({ title = "Dashboard", breadcrumb, onMenuClick }: HeaderProps) => {
    const { user, logout } = useAuth();
    const [openProfile, setOpenProfile] = useState(false);
    const navigate = useNavigate();

    return (
        <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="flex items-center gap-3">
                <button onClick={onMenuClick} className="lg:hidden rounded-md p-2 text-[var(--color-text-secondary)] hover:bg-slate-100 transition" aria-label="Open sidebar">
                    <FiMenu size={22} />
                </button>

                <div>
                    <h1 className="text-lg font-semibold text-[var(--color-text)]">{title}</h1>
                    {breadcrumb && <p className="text-sm text-[var(--color-text-secondary)]">{breadcrumb}</p>}
                </div>
            </div>

            <div className="flex items-center gap-5">
                <button
                    className="relative rounded-md p-2 text-[var(--color-text-secondary)] hover:bg-slate-100 transition"
                    aria-label="Notifications"
                >
                    <FiBell size={20} />

                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                </button>

                <div className="relative">
                    <button onClick={() => setOpenProfile((prev) => !prev)} className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-slate-100 transition">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-sm font-medium">
                            {user?.username?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-[var(--color-text)]">{user?.username || "User"}</p>
                            <p className="text-xs text-[var(--color-text-secondary)] capitalize">{user?.role?.replace("_", " ").toLowerCase()}</p>
                        </div>
                    </button>

                    {openProfile && (
                        <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-[var(--color-border)] bg-white shadow-md">
                            <div className="border-b border-[var(--color-border)] px-4 py-3">
                                <p className="text-sm font-medium">{user?.username}</p>
                                <p className="text-xs text-slate-500">{user?.email}</p>
                            </div>

                            <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                                onClick={async () => {
                                    setOpenProfile(false);
                                    navigate('/profile')
                                }}
                            >
                                Profile
                            </button>

                            <button onClick={logout} className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;