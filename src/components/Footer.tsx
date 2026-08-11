import React from 'react';
import { Cpu, MapPin, Phone, Mail, Globe, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#002D62] text-white border-t border-blue-900/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Col 1: School Identity */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F26522] flex items-center justify-center text-white font-bold shadow-md">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight block">TỔ STEM FPT BẮC GIANG</span>
                <span className="text-xs text-blue-200">Trường TH, THCS & THPT FPT Bắc Giang</span>
              </div>
            </div>

            <p className="text-xs text-blue-100 leading-relaxed">
              Chương trình bồi dưỡng năng khiếu Lập trình, Robocon, VEX Robotics, FIRST Tech Challenge và Drone chuyên sâu cho học sinh năng khiếu các cấp. Ươm mầm tài năng công nghệ dẫn đầu thời đại số.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-amber-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#F26522]" />
              <span>Năm học 2026 – 2027 • Hotline STEM: 0352.333.190</span>
            </div>
          </div>

          {/* Col 2: Program Groups */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-amber-300 text-sm uppercase tracking-wider">
              13 Lớp CLB Năng Khiếu
            </h4>
            <ul className="text-xs text-blue-100 space-y-1.5 font-medium">
              <li>• Lập trình Scratch 1 & 2 (Tiểu học)</li>
              <li>• Lập trình C++ THCS & THPT</li>
              <li>• Robocon TH, THCS & THPT</li>
              <li>• VEX IQ, VEX V5 & FTC (Robot Mỹ)</li>
              <li>• Drone & Robocon Hàng Không</li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div className="md:col-span-4 space-y-3 text-xs text-blue-100">
            <h4 className="font-bold text-amber-300 text-sm uppercase tracking-wider">
              Thông Tin Liên Hệ Ban Tổ Chức
            </h4>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F26522] shrink-0 mt-0.5" />
                <span>Trường TH, THCS & THPT FPT Bắc Giang, phường Bắc Giang, Tỉnh Bắc Ninh.</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F26522] shrink-0" />
                <span>Thầy Đỗ Minh Tiến - Tổ trưởng STEM (Zalo: 0352.333.190)</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F26522] shrink-0" />
                <span>fscbg.cths@fe.edu.vn</span>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#F26522] shrink-0" />
                <span>tuyensinh.bg@fe.edu.vn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 mt-8 border-t border-blue-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-300 gap-4">
          <p>© 2026 – 2027 Bản quyền thuộc Tổ STEM Trường TH, THCS & THPT FPT Bắc Giang.</p>
          <p className="text-[11px] font-mono text-blue-400">
            Hệ thống đăng ký tuyển sinh trực tuyến & Xuất báo cáo Excel
          </p>
        </div>
      </div>
    </footer>
  );
};
