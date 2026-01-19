"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { useSession, signOut } from "next-auth/react"; 
import { 
  Users, Banknote, ChevronRight, 
  Shield, LayoutDashboard, Wallet, 
  LogOut, User as UserIcon
} from "lucide-react";

export default function Sidebar() {
  const { data: session } = useSession(); 
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);


  // @ts-ignore
  const userRole = session?.user?.role || "staff"; 

  const isActive = (href: string) => {
    if (href === "/dash/inventory") return pathname === "/dash/inventory";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const navItems = [
    { label: "Inventory", href: "/dash/inventory", icon: <LayoutDashboard size={20} /> },
    { label: "Sales", href: "/dash/sales", icon: <Banknote size={20} /> },
  ];

  const adminItems = [
    { label: "User Management", href: "/dash/admin", icon: <Users size={20} /> },
  ];

  return (
    <>
      <aside className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-30 flex flex-col shadow-sm ${isOpen ? "w-64" : "w-20"}`}>
        {/* Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="absolute -right-3 top-10 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md z-50 hover:bg-indigo-700 transition-colors"
        >
          <ChevronRight size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Logo */}
        <div className="p-6 flex items-center gap-3 h-20 flex-shrink-0">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-indigo-100 shadow-lg">
             <Wallet size={20} />
          </div>
          {isOpen && <span className="font-bold text-xl tracking-tight text-slate-900">E-Duuka</span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.label} href={item.href} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${active ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"}`}>
                <span className={`${active ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}`}>
                  {item.icon}
                </span>
                {isOpen && <span className="font-semibold text-sm">{item.label}</span>}
              </Link>
            );
          })}

          {/* Admin Section - Show for admin or finance */}
          {(userRole === "admin" || userRole === "finance") && (
            <>
              <div className="pt-4 pb-2">
                {isOpen && (
                  <div className="px-3 mb-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Shield size={14} />
                      <span>Admin</span>
                    </div>
                  </div>
                )}
              </div>
              {adminItems.map((item) => (
                <Link key={item.label} href={item.href} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${isActive(item.href) ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
                   <span className="text-slate-400 group-hover:text-indigo-600">{item.icon}</span>
                   {isOpen && <span className="font-semibold text-sm">{item.label}</span>}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* Footer Profile Section */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className={`flex items-center gap-3 p-2 rounded-2xl transition-all ${!isOpen && "justify-center"}`}>
            <div className="h-10 w-10 rounded-full bg-linear-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-sm flex-shrink-0">
               <span className="font-bold text-sm">{session?.user?.email?.charAt(0).toUpperCase() || "U"}</span>
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-[10px] text-slate-500 truncate font-medium">{session?.user?.email}</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })} 
            className={`mt-2 w-full flex items-center gap-3 px-3 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 group ${!isOpen && "justify-center"}`}
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            {isOpen && <span className="text-sm font-bold">Logout</span>}
          </button>
        </div>
      </aside>
      <div className={`transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`} />
    </>
  );
}