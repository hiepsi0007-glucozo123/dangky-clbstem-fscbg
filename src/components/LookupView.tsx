import React, { useState } from 'react';
import { findRecordByTrackingCodeOrPhone } from '../utils/storage';
import { RegistrationRecord } from '../types';
import { CLASSES_DATA } from '../data/classesData';
import { Search, FileCheck, Phone, User, Calendar, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';

export const LookupView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RegistrationRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const found = findRecordByTrackingCodeOrPhone(query);
    setResults(found);
    setHasSearched(true);
  };

  const classMap = new Map(CLASSES_DATA.map(c => [c.id, c]));

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Lookup Card Header */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-center">
        <div className="w-14 h-14 bg-blue-100 text-[#002D62] rounded-2xl flex items-center justify-center mx-auto">
          <Search className="w-7 h-7 text-[#F26522]" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-[#002D62]">
            Tra Cứu Kết Quả Đăng Ký CLB STEM
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-1">
            Nhập <strong>Mã tra cứu</strong> (ví dụ: STEM-2026-X89K2), <strong>Số điện thoại Zalo</strong> Phụ huynh hoặc <strong>Họ tên học sinh</strong>.
          </p>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập mã đơn hoặc SĐT Zalo Phụ huynh..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 text-sm focus:outline-none focus:border-[#F26522] focus:ring-2 focus:ring-[#F26522]/20 font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#002D62] hover:bg-[#F26522] text-white font-bold text-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            Tra cứu đơn
          </button>
        </form>

        {/* Quick Demo Chips */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
          <span>Thử tra cứu mẫu:</span>
          <button
            type="button"
            onClick={() => { setQuery('STEM-2026-X89K2'); setResults(findRecordByTrackingCodeOrPhone('STEM-2026-X89K2')); setHasSearched(true); }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-mono text-slate-700 font-bold"
          >
            STEM-2026-X89K2
          </button>
          <button
            type="button"
            onClick={() => { setQuery('0988123456'); setResults(findRecordByTrackingCodeOrPhone('0988123456')); setHasSearched(true); }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-mono text-slate-700 font-bold"
          >
            0988123456
          </button>
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-2">
            <span>Kết quả tìm kiếm cho: "{query}"</span>
            <span>Tìm thấy: {results.length} đơn</span>
          </div>

          {results.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">Không tìm thấy đơn đăng ký phù hợp</h3>
              <p className="text-xs text-slate-500">
                Vui lòng kiểm tra lại chính xác Mã tra cứu hoặc Số điện thoại Zalo khi nộp đơn.
              </p>
            </div>
          ) : (
            results.map((r) => {
              const clsInfo = classMap.get(r.selectedClassId);

              return (
                <div key={r.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-extrabold text-lg text-[#F26522] bg-orange-50 px-3 py-1 rounded-xl border border-orange-200">
                        {r.trackingCode}
                      </span>
                      <span className="text-xs text-slate-400">Nộp lúc: {r.createdAt}</span>
                    </div>

                    <span className={`text-xs font-bold px-3 py-1 rounded-full self-start sm:self-center ${
                      r.status === 'Trúng tuyển chính thức' 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : r.status === 'Đã qua sơ loại Online'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      ● Trạng thái: {r.status}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                      <div className="font-bold text-slate-900 text-sm border-b pb-1">
                        Họ tên học sinh: {r.studentName}
                      </div>
                      <div>• Lớp / Khối: <strong>{r.className ? `Lớp ${r.className}` : ''} (Khối {r.currentGrade} - {r.schoolLevel})</strong></div>
                      <div>• Ngày sinh: {r.dob}</div>
                      <div>• Lớp đăng ký: <strong className="text-[#002D62]">{clsInfo?.name}</strong></div>
                    </div>

                    <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                      <div className="font-bold text-slate-900 text-sm border-b pb-1">
                        Phụ huynh: {r.parentName}
                      </div>
                      <div>• SĐT Zalo: {r.zaloPhone}</div>
                      <div>• Email: {r.email}</div>
                      <div>• Cam kết vật tư: <strong>{r.equipmentCommitment ? 'Đồng ý 8-10 tr' : 'Không'}</strong></div>
                    </div>
                  </div>

                  <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-200 text-xs text-[#002D62] flex items-center justify-between">
                    <span className="font-semibold">
                      💡 Hướng dẫn: Giữ Zalo {r.zaloPhone} để nhận thông báo đề thi thử thách Online tiếp theo.
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
