import React, { useState, useEffect } from 'react';
import { 
  getStoredRegistrations, 
  updateRegistrationStatus, 
  deleteRegistrationRecord, 
  resetToInitialRegistrations 
} from '../utils/storage';
import { exportRegistrationsToExcel } from '../utils/excelExport';
import { syncAllRecordsToGoogleSheet } from '../utils/sheetSync';
import { RegistrationRecord, ApplicationStatus, SchoolLevel } from '../types';
import { CLASSES_DATA } from '../data/classesData';
import { 
  Download, Search, Filter, ShieldCheck, Lock, Unlock, Users, 
  AlertTriangle, CheckCircle2, RefreshCw, Eye, Trash2, X, FileSpreadsheet,
  BarChart2, PieChart, CheckSquare, Sparkles, Building2, ChevronRight,
  Send, Loader2, ExternalLink
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  // Admin Login State initialized from sessionStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const isLoggedOut = sessionStorage.getItem('fpt_admin_logged_out') === 'true';
    if (isLoggedOut) return false;
    const isAuth = sessionStorage.getItem('fpt_admin_auth');
    if (isAuth === 'true') return true;
    return false;
  });
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState('');

  // Data State
  const [records, setRecords] = useState<RegistrationRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Syncing state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters
  const [filterClassId, setFilterClassId] = useState<string>('all');
  const [filterSchoolLevel, setFilterSchoolLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterEquipmentOnly, setFilterEquipmentOnly] = useState<boolean>(false);
  const [filterInternationalOnly, setFilterInternationalOnly] = useState<boolean>(false);

  // Detail Modal & Confirmation States
  const [selectedRecord, setSelectedRecord] = useState<RegistrationRecord | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Refresh records
  const loadRecords = () => {
    const data = getStoredRegistrations();
    setRecords(data);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleSyncAllToSheets = async () => {
    setIsSyncing(true);
    setSyncNotice(null);

    const result = await syncAllRecordsToGoogleSheet(filteredRecords.length > 0 ? filteredRecords : records);

    setIsSyncing(false);
    if (result.success) {
      setSyncNotice({
        type: 'success',
        message: result.message || 'Đã đồng bộ thành công dữ liệu vào Google Sheet!'
      });
    } else {
      setSyncNotice({
        type: 'error',
        message: result.message || 'Lỗi đồng bộ Google Sheets'
      });
    }
  };


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === 'stem2026') {
      sessionStorage.setItem('fpt_admin_auth', 'true');
      sessionStorage.removeItem('fpt_admin_logged_out');
      setIsAuthenticated(true);
      setAuthError('');
      setPin('');
    } else {
      setAuthError('Mật khẩu không đúng');
    }
  };

  const handleLogout = () => {
    sessionStorage.setItem('fpt_admin_auth', 'false');
    sessionStorage.setItem('fpt_admin_logged_out', 'true');
    setIsAuthenticated(false);
  };

  // Filter logic
  const filteredRecords = records.filter(r => {
    // Search matching
    const matchesSearch = 
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.className && r.className.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.zaloPhone.includes(searchTerm) ||
      r.trackingCode.toLowerCase().includes(searchTerm.toLowerCase());

    // Class filter
    const matchesClass = filterClassId === 'all' || r.selectedClassId === filterClassId;

    // School level
    const matchesLevel = filterSchoolLevel === 'all' || r.schoolLevel === filterSchoolLevel;

    // Status filter
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;

    // Commitment filters
    const matchesEquipment = !filterEquipmentOnly || r.equipmentCommitment;
    const matchesInternational = !filterInternationalOnly || r.competitionInternational;

    return matchesSearch && matchesClass && matchesLevel && matchesStatus && matchesEquipment && matchesInternational;
  });

  // Calculate statistics
  const totalRegistrations = records.length;
  const equipmentAgreedCount = records.filter(r => r.equipmentCommitment).length;
  const equipmentPercentage = totalRegistrations > 0 ? Math.round((equipmentAgreedCount / totalRegistrations) * 100) : 0;

  const internationalAgreedCount = records.filter(r => r.competitionInternational).length;
  const internationalPercentage = totalRegistrations > 0 ? Math.round((internationalAgreedCount / totalRegistrations) * 100) : 0;

  // Class enrollment count map
  const classCountMap = new Map<string, number>();
  records.forEach(r => {
    classCountMap.set(r.selectedClassId, (classCountMap.get(r.selectedClassId) || 0) + 1);
  });

  // Export handler
  const handleExportExcel = () => {
    exportRegistrationsToExcel(filteredRecords);
  };

  const handleStatusChange = (id: string, newStatus: ApplicationStatus) => {
    const updated = updateRegistrationStatus(id, newStatus);
    setRecords(updated);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord({ ...selectedRecord, status: newStatus });
    }
  };

  const confirmDelete = (id: string) => {
    const updated = deleteRegistrationRecord(id);
    setRecords(updated);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(null);
    }
    setDeleteTargetId(null);
  };

  const confirmResetData = () => {
    const reseted = resetToInitialRegistrations();
    setRecords(reseted);
    setShowResetConfirm(false);
  };


  const classMap = new Map(CLASSES_DATA.map(c => [c.id, c]));

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-6 text-center my-12">
        <div className="w-16 h-16 bg-[#002D62] text-[#F26522] rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#002D62]">Đăng Nhập Quản Trị STEM</h2>
          <p className="text-xs text-slate-500 mt-1">Dành cho Giáo viên & BHL Tổ STEM FPT Bắc Giang</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Mật khẩu Admin (mẫu: stem2026)"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-center text-sm font-mono focus:outline-none focus:border-[#F26522]"
            />
            {authError && <p className="text-xs text-rose-500 font-semibold mt-1">{authError}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#002D62] hover:bg-[#F26522] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            Mở Cổng Quản Trị
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Admin Header Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#F26522] uppercase tracking-wider">
              Hệ thống Quản trị Tuyển sinh Realtime
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002D62] mt-1">
            Quản Lý Danh Sách Đăng Ký CLB STEM (2026 – 2027)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Trường TH, THCS & THPT FPT Bắc Giang • Xuất báo cáo Excel & Xét duyệt hồ sơ học sinh
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Auto-sync to Google Sheets Button */}
          <button
            onClick={handleSyncAllToSheets}
            disabled={isSyncing}
            className="px-4 py-3 rounded-2xl bg-[#F26522] hover:bg-[#d85412] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Đồng bộ tất cả dữ liệu đơn hiện tại lên Google Sheets"
          >
            {isSyncing ? (
              <Loader2 className="w-5 h-5 text-amber-200 animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-amber-300" />
            )}
            <span>{isSyncing ? 'Đang đồng bộ...' : 'Tự động đồng bộ Google Sheets'}</span>
          </button>

          {/* Direct Google Sheets Link Button */}
          <a
            href="https://docs.google.com/spreadsheets/d/1-gEeQfiw830niRJ0chGufp497sW6n0VY917OeKQD_zM/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-5 h-5 text-emerald-300" />
            <span>Mở Sheet</span>
          </a>

          {/* Main Excel Export Button */}
          <button
            onClick={handleExportExcel}
            className="px-4 py-3 rounded-2xl bg-[#002D62] hover:bg-[#001d42] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-5 h-5 text-blue-200" />
            <span>Tải Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-3 rounded-2xl border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Khôi phục dữ liệu mẫu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-3 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Đăng xuất khỏi Cổng Quản trị"
          >
            <Unlock className="w-4 h-4 text-rose-600" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Sync Status Feedback Alert Banner */}
      {syncNotice && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 shadow-2xs ${
          syncNotice.type === 'success'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}>
          <div className="flex items-center gap-2.5">
            {syncNotice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <div>
              <span className="font-bold block text-sm">
                {syncNotice.type === 'success' ? 'Kết quả đồng bộ thành công:' : 'Cảnh báo đồng bộ:'}
              </span>
              <p className="font-medium text-xs mt-0.5 leading-relaxed">{syncNotice.message}</p>
            </div>
          </div>

          <button
            onClick={() => setSyncNotice(null)}
            className="p-1.5 rounded-lg hover:bg-black/10 text-slate-500 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}


      {/* KPI Stats Analytics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Tổng số đơn đăng ký</span>
            <Users className="w-4 h-4 text-[#002D62]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#002D62]">
            {totalRegistrations} <span className="text-xs font-normal text-slate-400">hồ sơ</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block">Đã cập nhật realtime</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Đồng ý Vật tư (8-10 triệu)</span>
            <CheckSquare className="w-4 h-4 text-[#F26522]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F26522]">
            {equipmentAgreedCount} <span className="text-xs font-normal text-slate-400">({equipmentPercentage}%)</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Sẵn sàng trang bị kit Robot/Drone</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Sẵn sàng thi Quốc tế</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-700">
            {internationalAgreedCount} <span className="text-xs font-normal text-slate-400">({internationalPercentage}%)</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Tham gia VEX / FTC Mỹ</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Lớp đang lọc hiển thị</span>
            <Filter className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {filteredRecords.length} <span className="text-xs font-normal text-slate-400">/ {totalRegistrations}</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Khảo sát hiển thị</span>
        </div>
      </div>

      {/* Class Capacity Alert Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#F26522]" />
          Thống kê Sĩ số 13 Lớp & Cảnh báo Chỉ tiêu (Tối đa 15 HS/lớp)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {CLASSES_DATA.map((cls) => {
            const count = classCountMap.get(cls.id) || 0;
            const isFull = count >= cls.maxStudents;
            const isAlmostFull = count >= cls.maxStudents - 3 && !isFull;

            return (
              <div
                key={cls.id}
                onClick={() => setFilterClassId(filterClassId === cls.id ? 'all' : cls.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  filterClassId === cls.id 
                    ? 'ring-2 ring-[#F26522] border-[#F26522] bg-orange-50' 
                    : isFull 
                      ? 'bg-rose-50 border-rose-200 text-rose-900' 
                      : isAlmostFull 
                        ? 'bg-amber-50 border-amber-200 text-amber-900' 
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="truncate">{cls.code}</span>
                  {isFull && <span className="text-[10px] bg-rose-600 text-white px-1.5 rounded">ĐỦ</span>}
                </div>
                <div className="text-[11px] text-slate-600 truncate mt-0.5">{cls.name.split(':')[0]}</div>
                <div className="font-extrabold text-slate-900 mt-1">
                  {count} / {cls.maxStudents} HS
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo Tên học sinh, Phụ huynh, SĐT Zalo hoặc Mã tra cứu..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#F26522]"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Filter Class */}
            <select
              value={filterClassId}
              onChange={(e) => setFilterClassId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-700 focus:outline-none focus:border-[#F26522]"
            >
              <option value="all">Tất cả 13 Lớp CLB</option>
              {CLASSES_DATA.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>

            {/* Filter Level */}
            <select
              value={filterSchoolLevel}
              onChange={(e) => setFilterSchoolLevel(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-700 focus:outline-none focus:border-[#F26522]"
            >
              <option value="all">Tất cả Cấp học</option>
              <option value="Tiểu học">Cấp Tiểu học</option>
              <option value="THCS">Cấp THCS</option>
              <option value="THPT">Cấp THPT</option>
            </select>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-700 focus:outline-none focus:border-[#F26522]"
            >
              <option value="all">Tất cả Trạng thái</option>
              <option value="Chờ sơ loại">Chờ sơ loại</option>
              <option value="Đã qua sơ loại Online">Đã qua sơ loại Online</option>
              <option value="Trúng tuyển chính thức">Trúng tuyển chính thức</option>
              <option value="Vượt chỉ tiêu (Chờ bổ sung)">Vượt chỉ tiêu</option>
            </select>
          </div>
        </div>

        {/* Checkbox Quick Filters */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 text-xs font-medium text-slate-700">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterEquipmentOnly}
              onChange={(e) => setFilterEquipmentOnly(e.target.checked)}
              className="w-4 h-4 text-[#F26522] rounded focus:ring-[#F26522]"
            />
            <span>Lọc thí sinh <strong>Đồng ý Vật tư (8-10 tr)</strong></span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterInternationalOnly}
              onChange={(e) => setFilterInternationalOnly(e.target.checked)}
              className="w-4 h-4 text-[#F26522] rounded focus:ring-[#F26522]"
            />
            <span>Lọc thí sinh <strong>Đồng ý Thi Quốc tế</strong></span>
          </label>

          {(filterClassId !== 'all' || filterSchoolLevel !== 'all' || filterStatus !== 'all' || searchTerm || filterEquipmentOnly || filterInternationalOnly) && (
            <button
              onClick={() => {
                setFilterClassId('all');
                setFilterSchoolLevel('all');
                setFilterStatus('all');
                setSearchTerm('');
                setFilterEquipmentOnly(false);
                setFilterInternationalOnly(false);
              }}
              className="text-[#F26522] font-bold hover:underline ml-auto"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Main Registrations Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
          <span>DANH SÁCH HỌC SINH ĐĂNG KÝ ({filteredRecords.length})</span>
          <span className="text-slate-500 font-normal">Tích hợp nút xuất Excel đầy đủ cột cam kết</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">STT / Mã đơn</th>
                <th className="py-3.5 px-4">Họ tên Học sinh</th>
                <th className="py-3.5 px-4">Khối / Cấp</th>
                <th className="py-3.5 px-4">Phụ huynh & SĐT Zalo</th>
                <th className="py-3.5 px-4">Lớp CLB Đăng ký</th>
                <th className="py-3.5 px-4">Cam kết PHHS</th>
                <th className="py-3.5 px-4">Trạng thái hồ sơ</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Không có học sinh nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, idx) => {
                  const clsObj = classMap.get(r.selectedClassId);

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono">
                        <span className="text-slate-400 font-bold mr-1">#{idx + 1}</span>
                        <span className="font-extrabold text-[#002D62]">{r.trackingCode}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <strong className="text-slate-900 block text-sm">{r.studentName}</strong>
                        <span className="text-slate-400 text-[11px]">NS: {r.dob}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#002D62]">{r.className ? `Lớp ${r.className}` : `Khối ${r.currentGrade}`}</span>
                        <span className="text-slate-500 text-[11px] block">Khối {r.currentGrade} ({r.schoolLevel})</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div>{r.parentName}</div>
                        <a href={`https://zalo.me/${r.zaloPhone}`} target="_blank" rel="noreferrer" className="text-[#F26522] font-mono font-bold hover:underline">
                          {r.zaloPhone}
                        </a>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{clsObj?.name || r.selectedClassId}</span>
                        <span className="text-[10px] bg-blue-50 text-[#002D62] px-1.5 py-0.5 rounded font-bold">
                          {clsObj?.code} • {clsObj?.categoryGroup}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-[11px]">
                          <div className={r.equipmentCommitment ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                            • Vật tư (8-10M): {r.equipmentCommitment ? 'Có' : 'Không'}
                          </div>
                          <div className="text-slate-600">
                            • Thi đấu: {r.competitionNational ? 'QG' : ''} {r.competitionInternational ? 'QT' : ''}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={r.status}
                          onChange={(e) => handleStatusChange(r.id, e.target.value as ApplicationStatus)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${
                            r.status === 'Trúng tuyển chính thức'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : r.status === 'Đã qua sơ loại Online'
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : r.status === 'Vượt chỉ tiêu (Chờ bổ sung)'
                                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                                  : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="Chờ sơ loại">Chờ sơ loại</option>
                          <option value="Đã qua sơ loại Online">Đã qua sơ loại Online</option>
                          <option value="Trúng tuyển chính thức">Trúng tuyển chính thức</option>
                          <option value="Vượt chỉ tiêu (Chờ bổ sung)">Vượt chỉ tiêu</option>
                          <option value="Đã hủy">Đã hủy</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => setSelectedRecord(r)}
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#002D62] transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteTargetId(r.id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          title="Xóa hồ sơ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Xác nhận xóa hồ sơ</h3>
            <p className="text-xs text-slate-600">
              Bạn có chắc chắn muốn xóa hồ sơ đăng ký này không? Thao tác này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => confirmDelete(deleteTargetId)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET CONFIRMATION MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Khôi phục dữ liệu mẫu</h3>
            <p className="text-xs text-slate-600">
              Bạn có muốn khôi phục danh sách đăng ký mẫu ban đầu không? Dữ liệu hiện tại sẽ được đặt lại.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={confirmResetData}
                className="px-4 py-2 rounded-xl bg-[#002D62] text-white font-bold text-xs hover:bg-[#F26522] cursor-pointer"
              >
                Xác nhận khôi phục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono font-extrabold text-[#F26522]">
                  MÃ ĐƠN: {selectedRecord.trackingCode}
                </span>
                <h3 className="text-xl font-bold text-[#002D62]">Chi Tiết Đơn Đăng Ký Học Sinh</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-[#002D62] text-sm">Thông tin Học sinh</h4>
                <div>• Họ tên: <strong>{selectedRecord.studentName}</strong></div>
                <div>• Ngày sinh: {selectedRecord.dob}</div>
                <div>• Lớp / Khối: <strong>{selectedRecord.className ? `Lớp ${selectedRecord.className}` : ''} (Khối {selectedRecord.currentGrade} - {selectedRecord.schoolLevel})</strong></div>
                <div>• Lớp đăng ký: <strong className="text-[#002D62]">{classMap.get(selectedRecord.selectedClassId)?.name}</strong></div>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-[#002D62] text-sm">Thông tin Phụ huynh</h4>
                <div>• Họ tên PH: <strong>{selectedRecord.parentName}</strong></div>
                <div>• SĐT Zalo: <strong className="text-[#F26522]">{selectedRecord.zaloPhone}</strong></div>
                <div>• Email: {selectedRecord.email}</div>
                <div>• Ngày đăng ký: {selectedRecord.createdAt}</div>
              </div>
            </div>

            {/* Commitments breakdown */}
            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-2 text-xs text-slate-800">
              <h4 className="font-bold text-[#F26522] uppercase tracking-wide">Xác nhận cam kết từ Phụ huynh:</h4>
              <div>• Mục đích: <em>{selectedRecord.registrationPurpose}</em></div>
              <div>• Khung thời gian & Đưa đón: <strong>{selectedRecord.timeCommitment ? 'ĐỒNG Ý CẢ HAI' : 'Không'}</strong></div>
              <div>• Sẵn sàng đầu tư Vật tư (8-10 triệu): <strong>{selectedRecord.equipmentCommitment ? 'CÓ (SẴN SÀNG)' : 'Không'}</strong></div>
              <div>• Thi đấu: <strong>{selectedRecord.competitionNational ? 'Quốc gia ' : ''}{selectedRecord.competitionInternational ? '& Quốc tế' : ''}</strong></div>
              {selectedRecord.notes && <div className="pt-2 border-t border-orange-200/80">• Ghi chú PH: {selectedRecord.notes}</div>}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">Cập nhật trạng thái duyệt nhanh:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(selectedRecord.id, 'Trúng tuyển chính thức')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                >
                  Duyệt Trúng tuyển
                </button>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
