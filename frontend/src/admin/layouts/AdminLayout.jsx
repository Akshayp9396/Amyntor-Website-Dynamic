import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Home,
    LogOut,
    Server,
    Briefcase,
    FileText,
    Menu,
    Image as ImageIcon,
    Mail,
    Users,
    MessageSquare,
    Info,
    Handshake,
    Target,
    UserCheck
} from 'lucide-react';

// Import Logo
import amyntorLogo from '../../assets/images/amyntor-logo.png';
import shieldIcon from '../../assets/images/shield-icon.png';

/**
 * Developer Narrative: AdminLayout.jsx
 * 
 * Purpose: The foundational "Fixed Shell" layout for the Admin section.
 * It provides a persistent Sidebar and Topbar while rendering active sub-pages via `<Outlet />`.
 */

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Configuration array for dynamic sidebar generation
    const sidebarLinks = [
        { title: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { title: 'Home Page', path: '/admin/home', icon: Home },
        { title: 'About Us', path: '/admin/about', icon: Info },
        { title: 'Services', path: '/admin/services', icon: Server },
        { title: 'Case Studies', path: '/admin/case-studies', icon: Briefcase },
        { title: 'Blogs', path: '/admin/blogs', icon: FileText },
        { title: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
        { title: 'Partners', path: '/admin/partners', icon: Handshake },
        { title: 'Careers', path: '/admin/careers', icon: Target },
        { title: 'Applications', path: '/admin/applications', icon: UserCheck },
        { title: 'Lead Inquiries', path: '/admin/inquiries', icon: MessageSquare },
        { title: 'Contact', path: '/admin/contact', icon: Mail },
    ];

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const renderLink = (link) => {
        const Icon = link.icon;
        return (
            <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/admin'}
                className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-[15px] whitespace-nowrap ${isActive
                        ? 'bg-blue-50/50 text-[#02a1fd]'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-[#2563eb]'
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        <Icon
                            size={20}
                            strokeWidth={2.5}
                            className={`shrink-0 ${isActive ? 'text-[#02a1fd]' : ''}`}
                        />
                        <span className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} ${isActive ? 'bg-clip-text text-transparent bg-gradient-to-r from-[#02a1fd] to-[#2563eb]' : ''}`}>
                            {link.title}
                        </span>
                    </>
                )}
            </NavLink>
        );
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">

                {/* ====== SIDEBAR (Dynamic Width, White Glass style) ====== */}
                <aside 
                    className={`flex-shrink-0 bg-white/70 backdrop-blur-lg border-r border-slate-200/60 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 transition-all duration-300 ease-in-out ${
                        isSidebarOpen ? 'w-[260px]' : 'w-[80px]'
                    }`}
                >
                    {/* Logo Area */}
                    <div className="h-20 flex items-center px-6 border-b border-slate-200/60 overflow-hidden relative">
                        <img 
                            src={amyntorLogo} 
                            alt="Amyntor Tech" 
                            className={`h-10 w-auto object-contain transition-all duration-300 ${isSidebarOpen ? 'scale-100' : 'scale-0 opacity-0'}`} 
                        />
                        {!isSidebarOpen && (
                            <div className="absolute inset-0 flex items-center justify-center animate-in fade-in zoom-in duration-300">
                                <img 
                                    src={shieldIcon} 
                                    className="w-10 h-10 object-contain drop-shadow-[0_4px_12px_rgba(2,161,253,0.3)]" 
                                    alt="Admin Icon" 
                                />
                            </div>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 no-scrollbar">
                        {sidebarLinks.map((link) => renderLink(link))}
                    </nav>

                    {/* Sidebar Footer / Current User Information */}
                    <div className="p-4">
                        <div className={`bg-white/50 rounded-2xl p-2.5 flex items-center transition-all duration-300 border border-slate-100 shadow-sm ${isSidebarOpen ? 'gap-3 px-3' : 'justify-center mx-auto w-12 h-12 p-0'}`}>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#02a1fd] to-[#2563eb] text-white flex items-center justify-center font-bold text-lg shadow-inner shrink-0 scale-90">
                                {user?.username?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            {isSidebarOpen && (
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-bold text-slate-800 truncate">{user?.username || 'Admin'}</span>
                                    <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Amyntor</span>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* ====== MAIN CONTENT AREA (Flexes to fill remaining space) ====== */}
                <div className="flex-1 flex flex-col relative min-w-0 overflow-hidden">

                    {/* Topbar (Height 80px, White Glass) */}
                    <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-8 z-10 sticky top-0 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center gap-3 text-slate-800">
                            <button 
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2.5 hover:bg-slate-100 rounded-xl transition-all group active:scale-95"
                            >
                                <Menu 
                                    size={22} 
                                    className={`text-slate-400 group-hover:text-[#2563eb] transition-all duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`} 
                                />
                            </button>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-2 px-4 rounded-xl transition-all text-sm border border-rose-100 group shadow-sm"
                            >
                                <LogOut size={16} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
                                Logout
                            </button>
                        </div>
                    </header>

                    {/* Scrollable Page Content */}
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50">
                        <div className="p-8 max-w-[1600px] mx-auto min-h-full">
                            {/* React Router injects the matching child route component here */}
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
    );
};

export default AdminLayout;

