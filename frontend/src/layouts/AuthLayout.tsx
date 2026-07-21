import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const AuthLayout = () => {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[var(--color-background)]">
            <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0"><Sidebar /></aside>

            {mobileSidebarOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />}

            <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:hidden ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Sidebar mobile onClose={() => setMobileSidebarOpen(false)} />
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <Header onMenuClick={() => setMobileSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-6"><Outlet /></main>
                <Footer />
            </div>
        </div>
    );
};

export default AuthLayout;