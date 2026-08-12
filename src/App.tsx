import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroTimeline } from './components/HeroTimeline';
import { ClassCard } from './components/ClassCard';
import { RegistrationForm } from './components/RegistrationForm';
import { LookupView } from './components/LookupView';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

import { CLASSES_DATA } from './data/classesData';
import { StemClass, CategoryGroup, RegistrationRecord } from './types';
import { getStoredRegistrations } from './utils/storage';
import { Search, Sparkles, Filter, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'classes' | 'register' | 'lookup' | 'admin'>('register');
  const [selectedClass, setSelectedClass] = useState<StemClass | null>(null);

  // Filters for classes tab
  const [selectedCategory, setSelectedCategory] = useState<CategoryGroup | 'Tất cả'>('Tất cả');
  const [gradeFilter, setGradeFilter] = useState<number | 0>(0); // 0 = All

  const [totalRecords, setTotalRecords] = useState<number>(0);

  const refreshTotal = () => {
    const list = getStoredRegistrations();
    setTotalRecords(list.length);
  };

  useEffect(() => {
    refreshTotal();
  }, [activeTab]);

  const handleSelectClassToRegister = (cls: StemClass) => {
    setSelectedClass(cls);
    setActiveTab('register');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleRegistrationSuccess = (record: RegistrationRecord) => {
    refreshTotal();
  };

  // Filtered classes list
  const filteredClasses = CLASSES_DATA.filter((c) => {
    const matchCat = selectedCategory === 'Tất cả' || c.categoryGroup === selectedCategory;
    const matchGrade = gradeFilter === 0 || c.gradeLevels.includes(gradeFilter);
    return matchCat && matchGrade;
  });

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans flex flex-col justify-between">
      <div>
        {/* Main Header Bar */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} totalCount={totalRecords} />

        {/* Main Body Content Container */}
        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8">
          {/* TAB 1: HOME & TIMELINE */}
          {activeTab === 'home' && (
            <div className="space-y-12">
              <HeroTimeline 
                onStartRegister={() => {
                  setSelectedClass(null);
                  setActiveTab('register');
                }}
                onExploreClasses={() => setActiveTab('classes')}
              />

              {/* Featured 13 Classes Showcase Section */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#F26522] uppercase tracking-wider block">
                      Danh mục đào tạo
                    </span>
                    <h2 className="text-2xl font-extrabold text-[#002D62]">
                      {CLASSES_DATA.length} Lớp CLB Năng Khiếu STEM (Năm học 2026 – 2027)
                    </h2>
                  </div>

                  <button
                    onClick={() => setActiveTab('classes')}
                    className="text-xs font-bold text-[#002D62] hover:text-[#F26522] flex items-center gap-1 self-start sm:self-center"
                  >
                    <span>Xem tất cả {CLASSES_DATA.length} Lớp</span>
                    <span>→</span>
                  </button>
                </div>

                {/* 5 Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {(['Tất cả', 'Lập trình', 'Robocon', 'Năng khiếu Robot', 'Năng khiếu Drone', 'Năng khiếu Vibe Coding'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#002D62] text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Classes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredClasses.map((cls) => (
                    <ClassCard
                      key={cls.id}
                      stemClass={cls}
                      onSelectClass={handleSelectClassToRegister}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLASSES LIST */}
          {activeTab === 'classes' && (
            <div className="space-y-8">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-[#F26522] uppercase tracking-wider block">
                      Thông tin tuyển sinh chi tiết
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002D62] mt-0.5">
                      Danh Sách {CLASSES_DATA.length} Lớp CLB Năng Khiếu STEM FPT
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Nhà trường tài trợ 100% học phí. Phụ huynh chỉ đóng góp vật tư tiêu hao đối với các lớp Robot/Drone.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedClass(null);
                      setActiveTab('register');
                    }}
                    className="px-6 py-3 rounded-2xl bg-[#F26522] hover:bg-[#d85412] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer self-start md:self-center"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Đăng ký chọn lớp ngay</span>
                  </button>
                </div>

                {/* Category & Grade Filter Controls Row */}
                <div className="space-y-5">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Lọc theo Nhóm Nội Dung:
                    </label>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      {(['Tất cả', 'Lập trình', 'Robocon', 'Năng khiếu Robot', 'Năng khiếu Drone'] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3.5 py-2 rounded-xl font-extrabold transition-all cursor-pointer ${
                            selectedCategory === cat
                              ? 'bg-[#002D62] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grade / Level Filter Section with required color borders */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5 text-[#F26522]" />
                        <span>Nút Lọc Theo Cấp Học & Khối Lớp:</span>
                      </label>
                      {gradeFilter !== 0 && (
                        <button
                          onClick={() => setGradeFilter(0)}
                          className="text-xs font-extrabold text-[#F26522] hover:underline bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 cursor-pointer"
                        >
                          ✕ Hiện tất cả các Khối ({gradeFilter === 0 ? 'Tất cả' : `Đang chọn Khối ${gradeFilter}`})
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Box 1: Cấp Tiểu học - Viền Màu Xanh Dương */}
                      <div className={`p-3.5 rounded-2xl border-2 transition-all bg-white shadow-2xs ${
                        [2, 3, 4, 5].includes(gradeFilter)
                          ? 'border-blue-600 bg-blue-50/90 ring-2 ring-blue-500/20'
                          : 'border-blue-500 hover:border-blue-600 hover:bg-blue-50/30'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-blue-900 flex items-center gap-1.5 uppercase">
                            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block shadow-xs" />
                            Cấp Tiểu Học
                          </span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-300">
                            Khối 2 – 5
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[2, 3, 4, 5].map((g) => (
                            <button
                              key={g}
                              onClick={() => setGradeFilter(gradeFilter === g ? 0 : g)}
                              className={`py-1.5 px-1 rounded-xl text-xs font-black transition-all border-2 cursor-pointer text-center ${
                                gradeFilter === g
                                  ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-105'
                                  : 'bg-blue-50/60 text-blue-900 border-blue-400 hover:bg-blue-100'
                              }`}
                            >
                              Khối {g}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Box 2: Cấp THCS - Viền Màu Cam */}
                      <div className={`p-3.5 rounded-2xl border-2 transition-all bg-white shadow-2xs ${
                        [6, 7, 8, 9].includes(gradeFilter)
                          ? 'border-[#F26522] bg-orange-50/90 ring-2 ring-orange-500/20'
                          : 'border-[#F26522] hover:border-orange-600 hover:bg-orange-50/30'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-orange-950 flex items-center gap-1.5 uppercase">
                            <span className="w-3 h-3 rounded-full bg-[#F26522] inline-block shadow-xs" />
                            Cấp THCS
                          </span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-orange-100 text-orange-900 border border-orange-300">
                            Khối 6 – 9
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[6, 7, 8, 9].map((g) => (
                            <button
                              key={g}
                              onClick={() => setGradeFilter(gradeFilter === g ? 0 : g)}
                              className={`py-1.5 px-1 rounded-xl text-xs font-black transition-all border-2 cursor-pointer text-center ${
                                gradeFilter === g
                                  ? 'bg-[#F26522] text-white border-orange-700 shadow-md scale-105'
                                  : 'bg-orange-50/60 text-orange-950 border-orange-400 hover:bg-orange-100'
                              }`}
                            >
                              Khối {g}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Box 3: Cấp THPT - Viền Màu Xanh Lá */}
                      <div className={`p-3.5 rounded-2xl border-2 transition-all bg-white shadow-2xs ${
                        [10, 11, 12].includes(gradeFilter)
                          ? 'border-emerald-500 bg-emerald-50/90 ring-2 ring-emerald-500/20'
                          : 'border-emerald-500 hover:border-emerald-600 hover:bg-emerald-50/30'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5 uppercase">
                            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-xs" />
                            Cấp THPT
                          </span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300">
                            Khối 10 – 12
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[10, 11, 12].map((g) => (
                            <button
                              key={g}
                              onClick={() => setGradeFilter(gradeFilter === g ? 0 : g)}
                              className={`py-1.5 px-1 rounded-xl text-xs font-black transition-all border-2 cursor-pointer text-center ${
                                gradeFilter === g
                                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105'
                                  : 'bg-emerald-50/60 text-emerald-950 border-emerald-500 hover:bg-emerald-100'
                              }`}
                            >
                              Khối {g}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map((cls) => (
                  <ClassCard
                    key={cls.id}
                    stemClass={cls}
                    onSelectClass={handleSelectClassToRegister}
                    selectedGradeFilter={gradeFilter}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MULTI-STEP REGISTRATION FORM */}
          {activeTab === 'register' && (
            <RegistrationForm
              preselectedClass={selectedClass}
              onSuccess={handleRegistrationSuccess}
              onBackToClasses={() => setActiveTab('classes')}
            />
          )}

          {/* TAB 4: LOOKUP VIEW */}
          {activeTab === 'lookup' && <LookupView />}

          {/* TAB 5: ADMIN DASHBOARD */}
          {activeTab === 'admin' && <AdminDashboard />}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
