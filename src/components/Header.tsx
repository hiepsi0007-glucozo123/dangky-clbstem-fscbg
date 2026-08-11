import React from 'react';
import { Search, Sparkles, BookOpen, Clock } from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'classes' | 'register' | 'lookup' | 'admin';
  setActiveTab: (tab: 'home' | 'classes' | 'register' | 'lookup' | 'admin') => void;
  totalCount: number;
}

// Official FPT Education Vector SVG Logo
const FptEducationLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-auto" }) => (
  <svg viewBox="0 0 178 36" className={className} xmlns="http://www.w3.org/2000/svg" fill="none">
    {/* 3 Parallelograms for F - P - T */}
    <g>
      {/* Box 1: Blue - Letter F */}
      <polygon points="10,4 35,4 27,32 2,32" fill="#00529C" />
      <text x="17" y="26" fontFamily="'Arial Black', 'Trebuchet MS', 'Segoe UI', sans-serif" fontWeight="900" fontStyle="italic" fontSize="21" fill="#FFFFFF" textAnchor="middle">
        F
      </text>

      {/* Box 2: Orange - Letter P */}
      <polygon points="38,4 63,4 55,32 30,32" fill="#F26522" />
      <text x="45" y="26" fontFamily="'Arial Black', 'Trebuchet MS', 'Segoe UI', sans-serif" fontWeight="900" fontStyle="italic" fontSize="21" fill="#FFFFFF" textAnchor="middle">
        P
      </text>

      {/* Box 3: Green - Letter T */}
      <polygon points="66,4 91,4 83,32 58,32" fill="#00A651" />
      <text x="73" y="26" fontFamily="'Arial Black', 'Trebuchet MS', 'Segoe UI', sans-serif" fontWeight="900" fontStyle="italic" fontSize="21" fill="#FFFFFF" textAnchor="middle">
        T
      </text>
    </g>

    {/* Education Text to the right of FPT blocks */}
    <text x="97" y="25" fontFamily="'Arial', 'Segoe UI', sans-serif" fontWeight="700" fontSize="17" fill="#00529C">
      Education
    </text>
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-[#002D62] via-[#00539C] to-[#F26522] text-white py-1.5 px-4 text-xs font-medium text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
        <span>Mở cổng đăng ký CLB Năng khiếu STEM, Robocon & Drone - Trường TH, THCS & THPT FPT Bắc Giang (2026 – 2027)</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & School Name */}
          <div className="flex items-center gap-3">
            {/* FPT Education Logo acting as hidden secret Admin trigger button */}
            <button
              onClick={() => setActiveTab('admin')}
              className="h-12 px-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-[#F26522]/40 transition-all flex items-center justify-center group active:scale-95 cursor-pointer"
              title="Hệ thống Giáo dục FPT"
            >
              <FptEducationLogo className="h-8 w-auto group-hover:scale-102 transition-transform" />
            </button>

            {/* School Title -> Navigates to Home */}
            <div
              onClick={() => setActiveTab('home')}
              className="cursor-pointer group select-none"
            >
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#002D62] group-hover:text-[#F26522] transition-colors">
                  TỔ STEM
                </span>
                <span className="bg-[#F26522] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  FPT BẮC GIANG
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Trường TH, THCS & THPT FPT Bắc Giang • Năm học 2026 – 2027
              </p>
            </div>
          </div>

          {/* Nav Tabs Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('register')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'register'
                  ? 'bg-[#F26522] text-white shadow-xs font-extrabold'
                  : 'text-slate-700 hover:text-[#F26522] hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>1. Đăng ký ngay</span>
            </button>

            <button
              onClick={() => setActiveTab('classes')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'classes'
                  ? 'bg-[#F26522] text-white shadow-xs font-extrabold'
                  : 'text-slate-700 hover:text-[#F26522] hover:bg-white/50'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>2. Danh sách 13 Lớp</span>
            </button>

            <button
              onClick={() => setActiveTab('lookup')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'lookup'
                  ? 'bg-[#F26522] text-white shadow-xs font-extrabold'
                  : 'text-slate-700 hover:text-[#F26522] hover:bg-white/50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>3. Tra cứu đơn</span>
            </button>
          </nav>

          {/* Mobile Register CTA Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setActiveTab('register')}
              className="bg-[#F26522] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Đăng ký</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Row */}
      <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-100 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('register')}
          className={`py-1.5 px-3 rounded-lg whitespace-nowrap font-bold ${
            activeTab === 'register' ? 'bg-[#F26522] text-white' : 'text-slate-700'
          }`}
        >
          1. Đăng ký
        </button>
        <button
          onClick={() => setActiveTab('classes')}
          className={`py-1.5 px-3 rounded-lg whitespace-nowrap ${
            activeTab === 'classes' ? 'bg-[#002D62] text-white' : 'text-slate-600'
          }`}
        >
          2. 13 Lớp CLB
        </button>
        <button
          onClick={() => setActiveTab('home')}
          className={`py-1.5 px-3 rounded-lg whitespace-nowrap ${
            activeTab === 'home' ? 'bg-[#002D62] text-white' : 'text-slate-600'
          }`}
        >
          3. Trang chủ
        </button>
        <button
          onClick={() => setActiveTab('lookup')}
          className={`py-1.5 px-3 rounded-lg whitespace-nowrap ${
            activeTab === 'lookup' ? 'bg-[#002D62] text-white' : 'text-slate-600'
          }`}
        >
          4. Tra cứu
        </button>
      </div>
    </header>
  );
};



