import React from 'react';
import { Calendar, CheckCircle2, ArrowRight, Award, Zap, Code2, Bot, Plane, Trophy, Users, ShieldAlert, Banknote, Wrench, AlertCircle } from 'lucide-react';
import { TIMELINE_DATA } from '../data/classesData';

interface HeroTimelineProps {
  onStartRegister: () => void;
  onExploreClasses: () => void;
}

export const HeroTimeline: React.FC<HeroTimelineProps> = ({ onStartRegister, onExploreClasses }) => {
  return (
    <div className="space-y-12 pb-8">
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002D62] via-[#00428B] to-[#0f172a] text-white p-5 sm:p-10 lg:p-16 shadow-xl border border-blue-900/40">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[#F26522]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-[11px] sm:text-xs font-semibold leading-snug">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F26522] shrink-0" />
              <span>KẾ HOẠCH BỒI DƯỠNG NĂNG KHIẾU TỔ STEM (2026 – 2027)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Đánh Thức Tiềm Năng <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26522] via-orange-300 to-amber-200">
                Công Nghệ & Robot
              </span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-normal">
              Chương trình bồi dưỡng chuyên sâu do <strong className="text-white font-semibold">Tổ STEM Trường TH, THCS & THPT FPT Bắc Giang</strong> tổ chức. Giúp học sinh làm chủ Lập trình C++/Scratch, thi đấu Robocon sa bàn, chinh phục Robot chuẩn Quốc tế VEX & FIRST Tech Challenge, cùng công nghệ Drone hiện đại.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onStartRegister}
                className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-2xl bg-[#F26522] hover:bg-[#d85412] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#F26522]/30 hover:shadow-xl transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Đăng ký tham gia ngay</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreClasses}
                className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/20 transition-all cursor-pointer backdrop-blur-sm"
              >
                Xem chi tiết 13 Lớp học
              </button>
            </div>

            {/* Quick feature highlights */}
            <div className="pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Miễn học phí</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>12–15 HS / Lớp</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thi đấu Quốc gia & Mỹ</span>
              </div>
            </div>
          </div>

          {/* Right Visual Bento Box */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-[#F26522]">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">4 Lớp Lập Trình</h3>
              <p className="text-xs text-slate-300">Scratch 1 & 2, C++ THCS & THPT. Thi tuyển, 100% không vật tư.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-300">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">3 Lớp Robocon</h3>
              <p className="text-xs text-slate-300">Robocon TH, THCS, THPT. Lắp ráp cơ khí & lập trình nhúng sa bàn.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">4 Lớp Vex & FTC</h3>
              <p className="text-xs text-slate-300">Vex IQ, Vex V5, FTC. Đăng ký tự do, chinh phục vé đi Mỹ.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">2 Lớp Drone</h3>
              <p className="text-xs text-slate-300">Lập trình bay không người lái, điều khiển FPV & nhận diện AI.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admissions Timeline Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#F26522] font-bold text-xs uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Mốc thời gian tuyển sinh</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Lộ Trình Tuyển Chọn & Đào Tạo (2026 – 2027)
            </h2>
          </div>
          <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-orange-50 text-[#F26522] border border-orange-200/80 self-start sm:self-center">
            Năm học 2026 - 2027
          </span>
        </div>

        {/* Horizontal Timeline Steps */}
        <div className="relative">
          {/* Connecting Line Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {TIMELINE_DATA.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  item.isCurrent
                    ? 'bg-orange-50/70 border-[#F26522] shadow-md ring-2 ring-[#F26522]/20'
                    : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md text-white transition-colors ${
                      item.isCurrent ? 'bg-[#F26522]' : 'bg-slate-700'
                    }`}>
                      Bước {item.id}
                    </span>
                    {item.isCurrent && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#F26522] text-white animate-pulse">
                        Đang diễn ra
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-[#F26522] block mb-1">
                    {item.dateRange}
                  </span>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className={`mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-medium ${
                  item.isCurrent ? 'text-[#F26522] font-bold' : 'text-slate-500'
                }`}>
                  <span>{item.phase}</span>
                  {item.isCurrent && <CheckCircle2 className="w-4 h-4 text-[#F26522]" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Important Policy Summary for Parents - Minimal Light Dashboard Theme */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* Header inside Card */}
        <div className="flex items-start gap-3.5 border-b border-slate-100 pb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full inline-block mb-1">
              Cần chú ý quan trọng
            </span>
            <h4 className="font-bold text-slate-800 text-base sm:text-lg">
              Lưu ý dành cho phụ huynh và học sinh
            </h4>
          </div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-slate-100">
          {/* Item 1: Học phí */}
          <div className="flex items-start gap-3.5 py-3.5 first:pt-0 last:pb-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100/60">
              <Banknote className="w-4 h-4" />
            </div>
            <p className="text-sm text-slate-600 font-normal leading-relaxed pt-1">
              <strong className="text-slate-800 font-semibold">Chính sách học phí:</strong> nhà trường hỗ trợ 100% kinh phí đào tạo, giáo trình và phòng Lab cho tất cả các lớp.
            </p>
          </div>

          {/* Item 2: Vật tư */}
          <div className="flex items-start gap-3.5 py-3.5 first:pt-0 last:pb-0">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100/60">
              <Wrench className="w-4 h-4" />
            </div>
            <div className="space-y-2 pt-1">
              <p className="text-sm text-slate-600 font-normal leading-relaxed">
                <strong className="text-slate-800 font-semibold">Chính sách vật tư:</strong> các lớp Lập trình (Scratch, C++) hoàn toàn không tốn vật tư. Đối với mô hình Robot & Drone (Robocon, VEX, FTC, Drone), PHHS chủ động đồng ý đóng góp kinh phí vật tư chuyên dụng tiêu hao (8 - 10 triệu/HS) khi học sinh trúng tuyển.
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Robot & Drone (Robocon, VEX, FTC, Drone): Đóng góp 8 – 10 triệu/HS khi trúng tuyển</span>
              </div>
            </div>
          </div>

          {/* Item 3: Sĩ số */}
          <div className="flex items-start gap-3.5 py-3.5 first:pt-0 last:pb-0">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200/60">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-sm text-slate-600 font-normal leading-relaxed pt-1">
              <strong className="text-slate-800 font-semibold">Sĩ số giới hạn:</strong> tối đa 12–15 học sinh mỗi lớp để đảm bảo chất lượng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
