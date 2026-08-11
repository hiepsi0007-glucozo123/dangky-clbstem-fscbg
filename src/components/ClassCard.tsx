import React from 'react';
import { StemClass } from '../types';
import { 
  Code2, Terminal, Cpu, Binary, 
  Bot, ShieldAlert, Boxes, Layers, 
  Wrench, Trophy, Zap, Plane, CheckCircle, 
  Users, ArrowRight, FileText, ExternalLink,
  Award, Medal, Crown, Globe, Laptop, Rocket, Gamepad2
} from 'lucide-react';

interface ClassCardProps {
  stemClass: StemClass;
  onSelectClass: (stemClass: StemClass) => void;
  selectedGradeFilter?: number;
}

const renderClassIcon = (iconName: string, classCode?: string) => {
  switch (classCode) {
    case 'SCR-01': return <Laptop className="w-5 h-5 text-sky-400" />;
    case 'SCR-02': return <Award className="w-5 h-5 text-amber-400" />;
    case 'CPP-01': return <Terminal className="w-5 h-5 text-emerald-400" />;
    case 'CPP-02': return <Trophy className="w-5 h-5 text-yellow-400" />;
    case 'RBC-01': return <Bot className="w-5 h-5 text-[#F26522]" />;
    case 'RBC-02': return <Gamepad2 className="w-5 h-5 text-orange-400" />;
    case 'RBC-03': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
    case 'VEX-IQ1': return <Boxes className="w-5 h-5 text-indigo-400" />;
    case 'VEX-IQ2': return <Globe className="w-5 h-5 text-cyan-400" />;
    case 'VEX-V5': return <Wrench className="w-5 h-5 text-[#F26522]" />;
    case 'FTC-01': return <Crown className="w-5 h-5 text-amber-300" />;
    case 'DRN-01': return <Plane className="w-5 h-5 text-teal-400" />;
    case 'DRN-02': return <Rocket className="w-5 h-5 text-purple-400" />;
    default:
      switch (iconName) {
        case 'Code': return <Code2 className="w-5 h-5 text-sky-400" />;
        case 'Terminal': return <Terminal className="w-5 h-5 text-emerald-400" />;
        case 'Cpu': return <Cpu className="w-5 h-5 text-indigo-400" />;
        case 'Binary': return <Binary className="w-5 h-5 text-purple-400" />;
        case 'Bot': return <Bot className="w-5 h-5 text-[#F26522]" />;
        case 'ShieldZap': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
        case 'Boxes': return <Boxes className="w-5 h-5 text-blue-400" />;
        case 'Layers': return <Layers className="w-5 h-5 text-cyan-400" />;
        case 'Wrench': return <Wrench className="w-5 h-5 text-[#F26522]" />;
        case 'Trophy': return <Trophy className="w-5 h-5 text-amber-400" />;
        case 'Zap': return <Zap className="w-5 h-5 text-yellow-400" />;
        case 'Plane': return <Plane className="w-5 h-5 text-teal-400" />;
        default: return <Trophy className="w-5 h-5 text-[#F26522]" />;
      }
  }
};

export const ClassCard: React.FC<ClassCardProps> = ({ stemClass, onSelectClass, selectedGradeFilter }) => {
  const isFull = stemClass.currentStudents >= stemClass.maxStudents;
  const isAlmostFull = stemClass.currentStudents >= stemClass.maxStudents - 3 && !isFull;
  
  // Grade match badge
  const isGradeMatch = selectedGradeFilter ? stemClass.gradeLevels.includes(selectedGradeFilter) : false;

  return (
    <div 
      className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:shadow-lg h-full ${
        isGradeMatch 
          ? 'ring-2 ring-[#F26522] border-[#F26522]/50 shadow-md' 
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* Top Banner Tag & Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="p-5 pb-4 border-b border-slate-100 flex-1 flex flex-col">
          {/* Badge Row */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#002D62] text-white flex items-center justify-center shrink-0 shadow-xs">
                {renderClassIcon(stemClass.icon, stemClass.code)}
              </div>
              <span className="text-xs font-extrabold text-[#002D62] bg-blue-50/90 border border-blue-200/80 px-2.5 py-1 rounded-lg inline-block uppercase tracking-wide">
                {stemClass.categoryGroup}
              </span>
            </div>

            {/* Badges: Exam required or Free */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              {stemClass.isExamRequired ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-extrabold text-xs tracking-wide shadow-md animate-badge-amber border border-amber-300 shrink-0 cursor-default">
                  <Zap className="w-4 h-4 text-amber-200 fill-amber-200 animate-bounce shrink-0" />
                  <span>THI TUYỂN</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-extrabold text-xs tracking-wide shadow-md animate-badge-emerald border border-emerald-300 shrink-0 cursor-default">
                  <CheckCircle className="w-4 h-4 text-emerald-200 fill-emerald-200 animate-pulse shrink-0" />
                  <span>ĐĂNG KÝ TỰ DO</span>
                </span>
              )}

              {isGradeMatch && (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#F26522] text-white shadow-2xs">
                  Phù hợp Lớp {selectedGradeFilter}
                </span>
              )}
            </div>
          </div>

          {/* Title Area - Enlarged title right below the admission status button */}
          <div className="min-h-[3rem] flex items-center my-1.5">
            <h3 className="font-extrabold text-[#002D62] text-lg sm:text-xl leading-snug group-hover:text-[#F26522] transition-colors">
              {stemClass.name}
            </h3>
          </div>

          {/* Target Grades */}
          <div className="h-6 flex items-center mb-2">
            <p className="text-xs font-medium text-slate-500">
              🎯 {stemClass.targetGrades}
            </p>
          </div>

          {/* Description - Fixed min height so descriptions across all cards align evenly */}
          <div className="min-h-[4rem] flex items-start">
            <p className="text-xs text-slate-600 leading-relaxed">
              {stemClass.description}
            </p>
          </div>
        </div>

        {/* Highlights List & Tuition/Schedule */}
        <div className="p-5 space-y-3 bg-slate-50/50 flex-1 flex flex-col justify-between">
          {/* Highlights List - Uniform min height for 3 bullet lines */}
          <div className="space-y-1.5 text-xs text-slate-700 min-h-[5.5rem] flex flex-col justify-start">
            {stemClass.highlights.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>

          {/* Special Robocon 2-Round Clarification Box */}
          {stemClass.categoryGroup === 'Robocon' && (
            <div className="p-3 rounded-xl bg-orange-50/95 border border-orange-200 text-xs space-y-1.5 shadow-2xs">
              <div className="font-extrabold text-[#F26522] flex items-center gap-1.5 uppercase text-[11px] tracking-wide">
                <Bot className="w-4 h-4 text-[#F26522] shrink-0" />
                <span>Quy trình 2 Vòng Robocon:</span>
              </div>
              <div className="space-y-1 text-slate-800 text-[11px] font-medium pt-0.5">
                <div className="flex items-start gap-1.5 text-emerald-800 bg-emerald-50/80 p-1.5 rounded-lg border border-emerald-200/60">
                  <span className="font-bold shrink-0 text-emerald-700">🟢 Vòng 1:</span>
                  <span>Thi Online — <strong className="underline decoration-emerald-500 font-extrabold text-emerald-800">Không mất phí</strong></span>
                </div>
                <div className="flex items-start gap-1.5 text-amber-900 bg-amber-50/80 p-1.5 rounded-lg border border-amber-200/60">
                  <span className="font-bold shrink-0 text-amber-800">🟠 Vòng 2:</span>
                  <span>Thi thực hành sa bàn — Phụ huynh đóng phí vật tư <strong className="font-extrabold text-amber-900">8 - 10 triệu đồng</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Schedule & Equipment Cost */}
          <div className="pt-3 border-t border-slate-200/60 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Học phí:</span>
              <span className="font-bold text-emerald-700">{stemClass.tuitionFee}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Vật tư thi đấu:</span>
              <span className={`font-semibold ${stemClass.hasEquipmentFee ? 'text-amber-700' : 'text-slate-700'}`}>
                {stemClass.equipmentFeeNotes}
              </span>
            </div>

            {stemClass.scheduleHint && (
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Lịch học dự kiến:</span>
                <span className="font-medium text-slate-700">{stemClass.scheduleHint}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer with Enrollment Status & Action Button */}
      <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-2.5 mt-auto">
        {/* Capacity Indicator */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Sĩ số: {stemClass.currentStudents}/{stemClass.maxStudents} HS</span>
          </div>

          {/* Progress bar */}
          <div className="w-24 sm:w-28 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                isFull 
                  ? 'bg-rose-500' 
                  : isAlmostFull 
                    ? 'bg-amber-500' 
                    : 'bg-[#F26522]'
              }`}
              style={{ width: `${Math.min(100, (stemClass.currentStudents / stemClass.maxStudents) * 100)}%` }}
            />
          </div>

          {isFull ? (
            <span className="text-[10px] font-bold text-rose-600 block">Đã hết chỉ tiêu</span>
          ) : isAlmostFull ? (
            <span className="text-[10px] font-bold text-amber-600 block">Sắp hết chỗ</span>
          ) : (
            <span className="text-[10px] text-slate-400 block">Mở đăng ký</span>
          )}
        </div>

        {/* Buttons Row: Xem chi tiết + Đăng ký */}
        <div className="flex items-center gap-1.5">
          {stemClass.docUrl && (
            <a
              href={stemClass.docUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-2.5 py-2 rounded-xl text-xs font-bold border border-slate-300 hover:border-[#002D62] text-slate-700 hover:text-[#002D62] bg-slate-50 hover:bg-white transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
              title="Xem file tài liệu truyền thông chi tiết"
            >
              <FileText className="w-3.5 h-3.5 text-[#F26522]" />
              <span className="hidden sm:inline">Xem chi tiết</span>
              <span className="sm:hidden">Chi tiết</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}

          <button
            onClick={() => onSelectClass(stemClass)}
            disabled={isFull}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              isFull
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-[#002D62] hover:bg-[#F26522] text-white shadow-xs hover:shadow-md'
            }`}
          >
            <span>{isFull ? 'Đã đủ' : 'Đăng ký'}</span>
            {!isFull && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

