import React, { useState, useEffect } from 'react';
import { StemClass, SchoolLevel, RegistrationPurpose, RegistrationRecord } from '../types';
import { CLASSES_DATA } from '../data/classesData';
import { saveRegistrationRecord } from '../utils/storage';
import { syncRecordToGoogleSheet } from '../utils/sheetSync';
import { 
  User, Calendar, Phone, Mail, GraduationCap, CheckCircle2, CheckCircle, Zap,
  ArrowRight, ArrowLeft, AlertCircle, ShieldCheck, Sparkles, 
  Copy, Printer, ExternalLink, Bot, Check, FileText, Table
} from 'lucide-react';

interface RegistrationFormProps {
  preselectedClass?: StemClass | null;
  onSuccess: (record: RegistrationRecord) => void;
  onBackToClasses: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  preselectedClass,
  onSuccess,
  onBackToClasses
}) => {
  // Current Step: 1 = Info, 2 = Class Selection, 3 = Commitments, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [studentName, setStudentName] = useState('');
  const [dob, setDob] = useState('');
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>('Tiểu học');
  const [currentGrade, setCurrentGrade] = useState<number>(3);
  const [className, setClassName] = useState('');
  const [parentName, setParentName] = useState('');
  const [zaloPhone, setZaloPhone] = useState('');
  const [email, setEmail] = useState('');

  const [selectedClassId, setSelectedClassId] = useState<string>(preselectedClass ? preselectedClass.id : '');

  // Commitments State
  const [registrationPurpose, setRegistrationPurpose] = useState<RegistrationPurpose>(
    'Mong muốn của PH & HS được tham gia học tập và rèn luyện'
  );
  const [timeCommitment, setTimeCommitment] = useState<boolean>(false);
  const [equipmentCommitment, setEquipmentCommitment] = useState<boolean>(false);
  const [competitionNational, setCompetitionNational] = useState<boolean>(true);
  const [competitionInternational, setCompetitionInternational] = useState<boolean>(false);
  const [notes, setNotes] = useState('');

  // Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [completedRecord, setCompletedRecord] = useState<RegistrationRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [sheetSyncStatus, setSheetSyncStatus] = useState<'syncing' | 'success' | 'error' | null>(null);
  const [sheetSyncMessage, setSheetSyncMessage] = useState<string>('');

  // If grade level changes, auto-update school level
  useEffect(() => {
    if (currentGrade >= 2 && currentGrade <= 5) setSchoolLevel('Tiểu học');
    else if (currentGrade >= 6 && currentGrade <= 9) setSchoolLevel('THCS');
    else if (currentGrade >= 10 && currentGrade <= 12) setSchoolLevel('THPT');
  }, [currentGrade]);

  // Set preselected class if passed
  useEffect(() => {
    if (preselectedClass) {
      setSelectedClassId(preselectedClass.id);
    }
  }, [preselectedClass]);

  // Step 1 Validation
  const validateStep1 = () => {
    const errs: { [key: string]: string } = {};
    if (!studentName.trim()) errs.studentName = 'Vui lòng nhập họ và tên học sinh';
    if (!dob) errs.dob = 'Vui lòng chọn ngày tháng năm sinh';
    if (!className.trim()) errs.className = 'Vui lòng nhập tên lớp (ví dụ: 1A1, 2A3, 6A2)';
    if (!parentName.trim()) errs.parentName = 'Vui lòng nhập họ tên Phụ huynh';
    
    // Zalo Phone validation
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!zaloPhone.trim()) errs.zaloPhone = 'Vui lòng nhập số điện thoại Zalo';
    else if (!phoneRegex.test(zaloPhone.replace(/\s+/g, ''))) {
      errs.zaloPhone = 'Số điện thoại Zalo không hợp lệ (10 chữ số)';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) errs.email = 'Vui lòng nhập Email liên hệ';
    else if (!emailRegex.test(email)) errs.email = 'Email không hợp lệ';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errs: { [key: string]: string } = {};
    if (!selectedClassId) {
      errs.selectedClassId = 'Vui lòng chọn 1 lớp học để đăng ký';
    } else {
      const cls = CLASSES_DATA.find(c => c.id === selectedClassId);
      if (cls && cls.currentStudents >= cls.maxStudents) {
        errs.selectedClassId = 'Lớp học này đã đủ chỉ tiêu, vui lòng chọn lớp khác';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validation (Commitments)
  const validateStep3 = () => {
    const errs: { [key: string]: string } = {};
    if (!registrationPurpose) errs.registrationPurpose = 'Vui lòng chọn mục đích đăng ký';
    if (!timeCommitment) errs.timeCommitment = 'Bạn cần tích đồng ý cam kết thời gian & chủ động đưa đón';
    if (!equipmentCommitment) errs.equipmentCommitment = 'Bạn cần tích sẵn sàng đầu tư vật tư Robot/Drone khi trúng tuyển';
    if (!competitionNational && !competitionInternational) {
      errs.competition = 'Bạn cần chọn ít nhất 1 phạm vi thi đấu (Quốc gia hoặc Quốc tế)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      // Auto pre-select first matching class for current grade if none selected or if selected class doesn't match grade
      const matches = CLASSES_DATA.filter(c => c.gradeLevels.includes(currentGrade));
      const currentSelectionValid = matches.some(c => c.id === selectedClassId);
      if ((!selectedClassId || !currentSelectionValid) && matches.length > 0) {
        const available = matches.find(c => c.currentStudents < c.maxStudents) || matches[0];
        setSelectedClassId(available.id);
      }
      setStep(2);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handleClassNameChange = (value: string) => {
    setClassName(value);
    // Auto detect grade number from class name input (e.g., "6A2" -> 6, "10A1" -> 10)
    const match = value.trim().match(/^(\d+)/);
    if (match) {
      const g = parseInt(match[1], 10);
      if (g >= 2 && g <= 12) {
        setCurrentGrade(g);
      }
    }
  };

  const handleNextStep2 = () => {
    if (validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handleSubmitFinal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    // Generate unique tracking code e.g. STEM-2026-X89K2
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const trackingCode = `STEM-2026-${randomSuffix}`;

    const newRecord: RegistrationRecord = {
      id: `reg-${Date.now()}`,
      trackingCode,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      studentName,
      dob,
      schoolLevel,
      currentGrade,
      className,
      parentName,
      zaloPhone,
      email,
      selectedClassId,
      registrationPurpose,
      timeCommitment,
      equipmentCommitment,
      competitionNational,
      competitionInternational,
      notes,
      status: 'Chờ sơ loại'
    };

    // Save to persistence
    saveRegistrationRecord(newRecord);
    setCompletedRecord(newRecord);
    setStep(4);
    onSuccess(newRecord);
    window.scrollTo({ top: 100, behavior: 'smooth' });

    // Auto-sync immediately to Google Sheet
    setSheetSyncStatus('syncing');
    setSheetSyncMessage('Đang tự động đồng bộ dữ liệu lên Google Sheet...');
    syncRecordToGoogleSheet(newRecord)
      .then((res) => {
        if (res.success) {
          setSheetSyncStatus('success');
          setSheetSyncMessage(res.message || 'Đã đồng bộ thành công vào Google Sheet');
        } else {
          setSheetSyncStatus('error');
          setSheetSyncMessage(res.message || 'Không thể ghi vào Google Sheet');
        }
      })
      .catch((err) => {
        console.error('Google Sheets sync trigger error:', err);
        setSheetSyncStatus('error');
        setSheetSyncMessage('Lỗi khi gửi dữ liệu lên Google Sheet');
      });
  };

  const copyTrackingCode = () => {
    if (completedRecord) {
      const code = completedRecord.trackingCode;
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(code)
          .then(() => {
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2500);
          })
          .catch((err) => {
            console.warn('Clipboard write failed:', err);
            fallbackCopy(code);
          });
      } else {
        fallbackCopy(code);
      }
    }
  };

  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch (e) {
      console.warn('Fallback copy failed:', e);
    }
  };

  const handlePrintReceipt = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('window.print() failed:', e);
    }
  };


  // Filter classes based on current student grade
  const matchingClasses = CLASSES_DATA.filter(c => c.gradeLevels.includes(currentGrade));
  const otherClasses = CLASSES_DATA.filter(c => !c.gradeLevels.includes(currentGrade));

  const currentSelectedClassObj = CLASSES_DATA.find(c => c.id === selectedClassId);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Step Indicator Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-4">
          <span className="text-[#002D62] text-sm font-extrabold uppercase tracking-wide">
            Đăng ký CLB Năng khiếu STEM FPT Bắc Giang
          </span>
          <span>Bước {step} / 3</span>
        </div>

        {/* Multi-step Progress Bar */}
        <div className="grid grid-cols-3 gap-2">
          <div className={`h-2 rounded-full transition-all ${step >= 1 ? 'bg-[#F26522]' : 'bg-slate-200'}`} />
          <div className={`h-2 rounded-full transition-all ${step >= 2 ? 'bg-[#F26522]' : 'bg-slate-200'}`} />
          <div className={`h-2 rounded-full transition-all ${step >= 3 ? 'bg-[#F26522]' : 'bg-slate-200'}`} />
        </div>

        <div className="grid grid-cols-3 gap-2 mt-2 text-center text-xs font-semibold">
          <span className={step === 1 ? 'text-[#F26522] font-bold' : 'text-slate-500'}>
            1. Thông tin HS & PH
          </span>
          <span className={step === 2 ? 'text-[#F26522] font-bold' : 'text-slate-500'}>
            2. Chọn Lớp CLB
          </span>
          <span className={step === 3 ? 'text-[#F26522] font-bold' : 'text-slate-500'}>
            3. Cam kết Phụ huynh
          </span>
        </div>
      </div>

      {/* STEP 1: Student & Parent Details */}
      {step === 1 && (
        <form onSubmit={handleNextStep1} className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          <div>
            <h2 className="text-xl font-bold text-[#002D62] flex items-center gap-2">
              <User className="w-5 h-5 text-[#F26522]" />
              <span>Bước 1: Thông tin Học sinh & Phụ huynh</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Vui lòng điền chính xác thông tin để nhà trường liên hệ xếp lớp và gửi đề thi sơ loại Online.
            </p>
          </div>

          {/* Section A: Student Info */}
          <div className="space-y-4 p-5 rounded-2xl bg-slate-50/80 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
              <GraduationCap className="w-4 h-4 text-[#F26522]" />
              <span>THÔNG TIN HỌC SINH</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Student Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên học sinh <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Minh Anh"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.studentName ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 focus:border-[#F26522] focus:ring-2 focus:ring-[#F26522]/20'
                  }`}
                />
                {errors.studentName && <p className="text-xs text-rose-500 mt-1">{errors.studentName}</p>}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ngày tháng năm sinh <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.dob ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 focus:border-[#F26522] focus:ring-2 focus:ring-[#F26522]/20'
                  }`}
                />
                {errors.dob && <p className="text-xs text-rose-500 mt-1">{errors.dob}</p>}
              </div>
            </div>

            {/* School Level & Grade Selector & Manual Class Input */}
            <div className="space-y-3 pt-2">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Khối hiện tại (Năm 2026 - 2027) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={currentGrade}
                    onChange={(e) => setCurrentGrade(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#F26522] bg-white font-semibold text-[#002D62]"
                  >
                    <optgroup label="Cấp Tiểu học">
                      <option value={2}>Học sinh Lớp 2</option>
                      <option value={3}>Học sinh Lớp 3</option>
                      <option value={4}>Học sinh Lớp 4</option>
                      <option value={5}>Học sinh Lớp 5</option>
                    </optgroup>
                    <optgroup label="Cấp Trung học Cơ sở (THCS)">
                      <option value={6}>Học sinh Lớp 6</option>
                      <option value={7}>Học sinh Lớp 7</option>
                      <option value={8}>Học sinh Lớp 8</option>
                      <option value={9}>Học sinh Lớp 9</option>
                    </optgroup>
                    <optgroup label="Cấp Trung học Phổ thông (THPT)">
                      <option value={10}>Học sinh Lớp 10</option>
                      <option value={11}>Học sinh Lớp 11</option>
                      <option value={12}>Học sinh Lớp 12</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lớp (Ví dụ: 1A1, 2A3, 6A2) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => handleClassNameChange(e.target.value)}
                    placeholder="Ví dụ: 1A1, 2A3, 6A2"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold text-[#002D62] focus:outline-none transition-all ${
                      errors.className ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 focus:border-[#F26522] focus:ring-2 focus:ring-[#F26522]/20'
                    }`}
                  />
                  {errors.className && <p className="text-xs text-rose-500 mt-1">{errors.className}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cấp học tự động
                  </label>
                  <div className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-between h-[42px] transition-all ${
                    currentGrade >= 2 && currentGrade <= 5
                      ? 'bg-blue-50 border-2 border-blue-500 text-blue-900'
                      : currentGrade >= 6 && currentGrade <= 9
                        ? 'bg-orange-50 border-2 border-[#F26522] text-orange-950'
                        : 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950'
                  }`}>
                    <span>{schoolLevel}</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border font-black truncate max-w-[120px]">
                      FPT Bắc Giang
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Parent Info */}
          <div className="space-y-4 p-5 rounded-2xl bg-slate-50/80 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Phone className="w-4 h-4 text-[#F26522]" />
              <span>THÔNG TIN PHỤ HUYNH LIÊN HỆ</span>
            </h3>

            <div className="grid sm:grid-cols-3 gap-4">
              {/* Parent Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ tên Phụ huynh <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Nam"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.parentName ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 focus:border-[#F26522] focus:ring-2 focus:ring-[#F26522]/20'
                  }`}
                />
                {errors.parentName && <p className="text-xs text-rose-500 mt-1">{errors.parentName}</p>}
              </div>

              {/* Zalo Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số điện thoại Zalo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={zaloPhone}
                  onChange={(e) => setZaloPhone(e.target.value)}
                  placeholder="Ví dụ: 0988123456"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.zaloPhone ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 focus:border-[#F26522] focus:ring-2 focus:ring-[#F26522]/20'
                  }`}
                />
                {errors.zaloPhone && <p className="text-xs text-rose-500 mt-1">{errors.zaloPhone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email liên hệ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ví dụ: phuhuynh@fpt.edu.vn"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.email ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 focus:border-[#F26522] focus:ring-2 focus:ring-[#F26522]/20'
                  }`}
                />
                {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Action Row Step 1 */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onBackToClasses}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold text-xs hover:bg-slate-50"
            >
             Xem lại lớp CLB
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#F26522] hover:bg-[#d85412] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Tiếp tục: Chọn lớp CLB</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: Select Class */}
      {step === 2 && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-[#002D62] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F26522]" />
                <span>Bước 2: Chọn Lớp Câu Lạc Bộ Đăng Ký</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Hệ thống tự động lọc các lớp phù hợp nhất với học sinh <strong className="text-slate-800">Lớp {currentGrade} ({schoolLevel})</strong>.
              </p>
            </div>
            <span className="text-xs font-bold text-[#F26522] bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
              Mỗi lớp giới hạn 12 – 15 học sinh
            </span>
          </div>

          {/* Auto-Recommendation Summary Banner */}
          <div className="bg-gradient-to-r from-[#002D62] to-[#0f3970] text-white p-5 rounded-2xl shadow-sm space-y-2 border border-blue-900">
            <div className="flex items-center gap-2 text-[#F26522] font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#F26522]" />
              <span>Tự động đề xuất lớp CLB & Đội tuyển phù hợp</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold">
              {studentName ? `Danh sách đề xuất cho Học sinh: ${studentName}` : 'Danh sách Lớp & Đội tuyển gợi ý phù hợp'}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-200 pt-1">
              <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/20 font-medium">
                🏫 Lớp: <strong className="text-white font-bold">{className || `Khối ${currentGrade}`}</strong>
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/20 font-medium">
                🎓 Khối: <strong className="text-white font-bold">{currentGrade}</strong>
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/20 font-medium">
                📌 Cấp: <strong className="text-white font-bold">{schoolLevel}</strong>
              </span>
              <span className="bg-[#F26522] text-white font-extrabold px-3 py-1 rounded-lg shadow-2xs">
                {matchingClasses.length} Lớp phù hợp nhất
              </span>
            </div>
          </div>

          {errors.selectedClassId && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.selectedClassId}</span>
            </div>
          )}

          {/* Suggested Matching Classes */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Các lớp CLB được đề xuất cho Khối {currentGrade} ({schoolLevel}):
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {matchingClasses.map((cls) => {
                const isSelected = selectedClassId === cls.id;
                const isFull = cls.currentStudents >= cls.maxStudents;

                return (
                  <div
                    key={cls.id}
                    onClick={() => !isFull && setSelectedClassId(cls.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-[#F26522] bg-orange-50/40 ring-2 ring-[#F26522] shadow-md'
                        : isFull
                          ? 'border-slate-200 bg-slate-100/60 opacity-60 cursor-not-allowed'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-extrabold text-[#002D62] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60 uppercase">
                            {cls.categoryGroup}
                          </span>
                          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            Đề xuất Khối {currentGrade}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-[#002D62] text-base sm:text-lg leading-snug pt-1">{cls.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">{cls.targetGrades}</p>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#F26522] text-white flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{cls.description}</p>

                    {/* Robocon 2-Round Box */}
                    {cls.categoryGroup === 'Robocon' && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-[11px] space-y-1">
                        <div className="font-extrabold text-[#F26522] flex items-center gap-1 uppercase">
                          <Bot className="w-3.5 h-3.5" />
                          <span>Robocon 2 Vòng thi:</span>
                        </div>
                        <div className="text-slate-800 space-y-0.5 font-medium">
                          <div className="text-emerald-800">🟢 <strong>Vòng 1:</strong> Thi Online — Không mất phí</div>
                          <div className="text-amber-900">🟠 <strong>Vòng 2:</strong> Thi thực hành sa bàn — PH đóng phí 8–10 triệu</div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2 text-xs font-medium">
                      {cls.isExamRequired ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs shadow-xs animate-badge-amber border border-amber-300">
                          <Zap className="w-3.5 h-3.5 text-amber-200 fill-amber-200 animate-bounce shrink-0" />
                          <span>THI TUYỂN</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-xs animate-badge-emerald border border-emerald-300">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-200 fill-emerald-200 animate-pulse shrink-0" />
                          <span>ĐĂNG KÝ TỰ DO</span>
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        {cls.docUrl && (
                          <a
                            href={cls.docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 flex items-center gap-1 transition-all"
                            title="Xem file truyền thông"
                          >
                            <FileText className="w-3 h-3 text-[#F26522]" />
                            <span>Xem chi tiết</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        )}
                        <span className="text-slate-600 font-bold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          {cls.currentStudents}/{cls.maxStudents} HS
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Other Available Classes Toggle */}
          {otherClasses.length > 0 && (
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Các lớp CLB thuộc khối khác (Nếu học sinh học vượt cấp):
              </h3>

              <div className="grid sm:grid-cols-2 gap-3">
                {otherClasses.map((cls) => {
                  const isSelected = selectedClassId === cls.id;
                  const isFull = cls.currentStudents >= cls.maxStudents;

                  return (
                    <div
                      key={cls.id}
                      onClick={() => !isFull && setSelectedClassId(cls.id)}
                      className={`p-4 rounded-xl border text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#F26522] bg-orange-50/30 ring-2 ring-[#F26522]'
                          : isFull
                            ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-slate-800 gap-2">
                        <span>{cls.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {cls.docUrl && (
                            <a
                              href={cls.docUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold border border-slate-300 flex items-center gap-1 transition-all"
                              title="Xem file truyền thông"
                            >
                              <FileText className="w-3 h-3 text-[#F26522]" />
                              <span>Chi tiết</span>
                              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                            </a>
                          )}
                          {cls.isExamRequired ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[10px] animate-badge-amber">
                              ⚡ Thi tuyển
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] animate-badge-emerald">
                              ✨ Tự do
                            </span>
                          )}
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                            {cls.targetGrades}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Row Step 2 */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold text-xs hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Bước 1</span>
            </button>

            <button
              type="button"
              onClick={handleNextStep2}
              className="px-6 py-3 rounded-xl bg-[#F26522] hover:bg-[#d85412] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Tiếp tục: XÁC NHẬN CAM KẾT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Mandatory Parental Commitments */}
      {step === 3 && (
        <form onSubmit={handleSubmitFinal} className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          <div>
            <h2 className="text-xl font-bold text-[#002D62] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#F26522]" />
              <span>Bước 3: Điều Khoản & Xác Nhận Cam Kết Từ Phụ Huynh</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Phụ huynh vui lòng đọc kỹ và xác nhận đầy đủ các mục cam kết theo đúng quy chế Tổ STEM FPT Bắc Giang.
            </p>
          </div>

          {/* Summary Box */}
          {currentSelectedClassObj && (
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[#002D62] text-sm block">
                    Đăng ký lớp: {currentSelectedClassObj.name}
                  </span>
                  {currentSelectedClassObj.isExamRequired ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[11px] animate-badge-amber">
                      <Zap className="w-3 h-3 text-amber-200 fill-amber-200 animate-bounce" />
                      <span>Thi Tuyển</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[11px] animate-badge-emerald">
                      <CheckCircle className="w-3 h-3 text-emerald-200 fill-emerald-200 animate-pulse" />
                      <span>Đăng Ký Tự Do</span>
                    </span>
                  )}
                </div>
                <span className="text-slate-600 block">
                  Học sinh: <strong>{studentName}</strong> • Lớp {className || '---'} (Khối {currentGrade}) • Phụ huynh: <strong>{parentName}</strong> ({zaloPhone})
                </span>
              </div>
              <span className="font-extrabold px-3 py-1 rounded-full bg-white text-[#F26522] border border-orange-200 self-start sm:self-center shrink-0">
                100% Miễn học phí
              </span>
            </div>
          )}

          {/* Commitment 1: Registration Purpose */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide">
              1. Mục đích đăng ký (*)
            </label>
            <div className="space-y-2 text-xs">
              {[
                'Mong muốn của HS được tham gia học tập và rèn luyện',
                'Mong muốn của PH để HS được tham gia học tập và rèn luyện',
                'Mong muốn của PH & HS được tham gia học tập và rèn luyện'
              ].map((opt) => (
                <label key={opt} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-[#F26522] cursor-pointer">
                  <input
                    type="radio"
                    name="purpose"
                    checked={registrationPurpose === opt}
                    onChange={() => setRegistrationPurpose(opt as RegistrationPurpose)}
                    className="w-4 h-4 text-[#F26522] focus:ring-[#F26522]"
                  />
                  <span className="font-medium text-slate-800">{opt}</span>
                </label>
              ))}
            </div>
            {errors.registrationPurpose && <p className="text-xs text-rose-500 font-bold">{errors.registrationPurpose}</p>}
          </div>

          {/* Commitment 2: Time & Transportation */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide">
              2. Thời gian & Đưa đón (*)
            </label>
            <label className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
              timeCommitment ? 'bg-orange-50/50 border-[#F26522] font-semibold' : 'bg-white border-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={timeCommitment}
                onChange={(e) => setTimeCommitment(e.target.checked)}
                className="w-5 h-5 text-[#F26522] rounded focus:ring-[#F26522] mt-0.5"
              />
              <div className="text-xs text-slate-800 space-y-1">
                <span className="font-bold text-slate-900 block">
                  PHHS Đồng ý với khung thời gian hoạt động của đội tuyển và chủ động thời gian đưa đón HS
                </span>
                <span className="text-slate-500 block">
                  Cam kết đảm bảo học sinh tham gia đầy đủ các buổi luyện tập theo lịch công bố của Tổ STEM.
                </span>
              </div>
            </label>
            {errors.timeCommitment && <p className="text-xs text-rose-500 font-bold">{errors.timeCommitment}</p>}
          </div>

          {/* Commitment 3: Equipment Investment (8 - 10 Million) */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-amber-900 uppercase tracking-wide">
                3. Đầu tư vật tư học tập (*)
              </label>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-amber-200 text-amber-900">
                Lớp Robot / Drone
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-amber-200">
              📌 <strong>Ghi chú từ Nhà trường:</strong> Nhà trường đào tạo học tập miễn phí 100%. Tuy nhiên, Phụ huynh học sinh sẽ cần đầu tư vật tư chuyên dụng đối với các mô hình lớp Robot & Drone. Đây là vật tư tiêu hao theo mô hình Robot đáp ứng giải pháp của Học sinh để tham gia các cuộc thi. <em>(Lưu ý: Các lớp Lập trình Scratch/C++ sẽ không có khoản vật tư này, tuy nhiên PH vẫn tích để đồng ý bước tiếp).</em>
            </p>

            <label className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
              equipmentCommitment ? 'bg-orange-50/70 border-[#F26522] font-semibold' : 'bg-white border-amber-200'
            }`}>
              <input
                type="checkbox"
                checked={equipmentCommitment}
                onChange={(e) => setEquipmentCommitment(e.target.checked)}
                className="w-5 h-5 text-[#F26522] rounded focus:ring-[#F26522] mt-0.5"
              />
              <div className="text-xs text-slate-900">
                <span className="font-bold text-[#002D62] block">
                  Sẵn sàng đầu tư vật tư Robot/Drone cho HS tham gia các cuộc thi (8 - 10 triệu/HS)
                </span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Xác nhận chuẩn bị sẵn kinh phí vật tư khi học sinh trúng tuyển vào đội tuyển chính thức.
                </span>
              </div>
            </label>
            {errors.equipmentCommitment && <p className="text-xs text-rose-500 font-bold">{errors.equipmentCommitment}</p>}
          </div>

          {/* Commitment 4: Competition Scale */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide">
              4. Đầu tư kinh phí thi đấu (*)
            </label>
            <p className="text-xs text-slate-500">
              Thông thường các cuộc thi sẽ có các chi phí gồm: lệ phí tham gia, lệ phí thành lập đội thi (VEX/FTC - Hệ thống Quốc tế), chi phí di chuyển, ăn ở khách sạn, vé máy bay, hộ chiếu, visa...
            </p>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer ${
                competitionNational ? 'bg-orange-50/50 border-[#F26522] font-bold' : 'bg-white border-slate-200'
              }`}>
                <input
                  type="checkbox"
                  checked={competitionNational}
                  onChange={(e) => setCompetitionNational(e.target.checked)}
                  className="w-4 h-4 text-[#F26522] rounded focus:ring-[#F26522]"
                />
                <span className="text-slate-800">Sẵn sàng tham gia Cuộc thi Cấp Quốc gia</span>
              </label>

              <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer ${
                competitionInternational ? 'bg-orange-50/50 border-[#F26522] font-bold' : 'bg-white border-slate-200'
              }`}>
                <input
                  type="checkbox"
                  checked={competitionInternational}
                  onChange={(e) => setCompetitionInternational(e.target.checked)}
                  className="w-4 h-4 text-[#F26522] rounded focus:ring-[#F26522]"
                />
                <span className="text-slate-800">Sẵn sàng tham gia Cuộc thi Cấp Quốc tế (VEX/FTC Mỹ)</span>
              </label>
            </div>
            {errors.competition && <p className="text-xs text-rose-500 font-bold">{errors.competition}</p>}
          </div>

          {/* Notes Optional */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ghi chú thêm hoặc mong muốn đặc biệt từ Phụ huynh (Không bắt buộc):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ví dụ: Học sinh từng đạt giải Tin học trẻ cấp huyện / Đã có bộ kit Vex IQ ở nhà..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#F26522]"
            />
          </div>

          {/* Action Row Step 3 */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold text-xs hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Chọn Lớp</span>
            </button>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#F26522] to-[#d84f10] text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5 text-amber-300" />
              <span>XÁC NHẬN NỘP ĐƠN ĐĂNG KÝ</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Success Result Screen */}
      {step === 4 && completedRecord && (
        <div className="bg-white p-6 sm:p-12 rounded-3xl border border-slate-200 shadow-lg space-y-8 text-center animate-fade-in">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
              Gửi đơn thành công
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002D62]">
              Xác Nhận Đăng Ký CLB STEM Thành Công!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Đơn đăng ký của em <strong>{completedRecord.studentName}</strong> đã được lưu trữ trên hệ thống tuyển sinh của Tổ STEM FPT Bắc Giang.
            </p>
          </div>

          {/* Tracking Code Highlight Box */}
          <div className="bg-gradient-to-br from-[#002D62] to-[#0f172a] text-white p-6 rounded-2xl max-w-md mx-auto space-y-3 shadow-md border border-blue-900">
            <span className="text-xs font-medium text-slate-300 uppercase tracking-wider block">
              Mã tra cứu đơn của bạn:
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-[#F26522] tracking-widest bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                {completedRecord.trackingCode}
              </span>
              <button
                onClick={copyTrackingCode}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors text-white cursor-pointer"
                title="Sao chép mã"
              >
                {copiedCode ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            {copiedCode && <span className="text-[11px] text-emerald-300 font-bold block">Đã sao chép vào bộ nhớ tạm!</span>}
          </div>

          {/* Google Sheets Sync Indicator Banner */}
          <div className="max-w-md mx-auto">
            {sheetSyncStatus === 'syncing' && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-amber-600 animate-spin" />
                  Đang đồng bộ dữ liệu vào Google Sheets...
                </span>
              </div>
            )}

            {sheetSyncStatus === 'success' && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-4 space-y-1.5 text-left text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-2 text-emerald-800">
                    <Table className="w-4 h-4 text-emerald-600" />
                    Đồng bộ Google Sheets thành công!
                  </span>
                  <a
                    href="https://docs.google.com/spreadsheets/d/1-gEeQfiw830niRJ0chGufp497sW6n0VY917OeKQD_zM/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 underline flex items-center gap-1 hover:text-emerald-900 font-bold"
                  >
                    Xem Sheet
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Dữ liệu đăng ký của {completedRecord.studentName} đã tự động được thêm vào Google Sheet của trường.
                </p>
              </div>
            )}

            {sheetSyncStatus === 'error' && (
              <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl p-4 space-y-2 text-left text-xs">
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-amber-700" />
                    Tự động đồng bộ Google Sheets
                  </span>
                  <a
                    href="https://docs.google.com/spreadsheets/d/1-gEeQfiw830niRJ0chGufp497sW6n0VY917OeKQD_zM/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-800 underline flex items-center gap-1 hover:text-amber-950 font-bold"
                  >
                    Mở Trang Sheet
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-amber-800">
                  {sheetSyncMessage || 'Đơn đã được lưu trong ứng dụng.'}
                </p>
              </div>
            )}
          </div>

          {/* Printable Receipt Details Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 max-w-2xl mx-auto text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#F26522]" />
                PHIẾU XÁC NHẬN NỘP ĐƠN
              </span>
              <span className="text-xs text-slate-500 font-mono">{completedRecord.createdAt}</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div>
                <span className="text-slate-500 block">Học sinh:</span>
                <strong className="text-slate-900 text-sm">{completedRecord.studentName}</strong> (Lớp {completedRecord.className || '---'} - Khối {completedRecord.currentGrade})
              </div>
              <div>
                <span className="text-slate-500 block">Phụ huynh:</span>
                <strong className="text-slate-900">{completedRecord.parentName}</strong> ({completedRecord.zaloPhone})
              </div>
              <div>
                <span className="text-slate-500 block">Lớp đăng ký:</span>
                <strong className="text-[#002D62]">{currentSelectedClassObj?.name}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Trạng thái hồ sơ:</span>
                <span className="inline-block bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                  {completedRecord.status}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 space-y-1">
              <div>• Cam kết vật tư Robot/Drone: <strong>{completedRecord.equipmentCommitment ? 'ĐÃ ĐỒNG Ý' : 'Không'}</strong></div>
              <div>• Phạm vi thi đấu: <strong>{completedRecord.competitionNational ? 'Quốc gia' : ''} {completedRecord.competitionInternational ? '& Quốc tế' : ''}</strong></div>
            </div>
          </div>

          {/* Next Steps Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-left max-w-2xl mx-auto space-y-3">
            <h4 className="font-bold text-[#002D62] text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F26522]" />
              HƯỚNG DẪN CÁC BƯỚC TIẾP THEO:
            </h4>
            <ol className="list-decimal list-inside text-xs text-slate-700 space-y-2 font-medium">
              <li>
                <strong>Vòng sơ loại Online (11/08 – 18/08/2026):</strong> Ban tổ chức sẽ gửi link thử thách tư duy Online qua Zalo SĐT <span className="text-[#F26522] font-bold">{completedRecord.zaloPhone}</span> và Email <span className="underline">{completedRecord.email}</span>.
              </li>
              <li>
                <strong>Tham gia Nhóm Zalo Hỗ trợ STEM:</strong> Phụ huynh vui lòng quét mã Zalo hoặc ấn nút bên dưới để tham gia nhóm cập nhật thông báo lịch thi Offline.
              </li>
              <li>
                <strong>Lưu giữ Mã tra cứu:</strong> Dùng mã <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-bold">{completedRecord.trackingCode}</code> để tra cứu kết quả trúng tuyển bất kỳ lúc nào.
              </li>
            </ol>
          </div>

          {/* Buttons Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={handlePrintReceipt}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Phiếu Đăng Ký (PDF)</span>
            </button>

            <a
              href="https://zalo.me"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Vào nhóm Zalo STEM FPT</span>
            </a>

            <button
              onClick={() => {
                setStep(1);
                setStudentName('');
                setCompletedRecord(null);
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all"
            >
              Đăng ký cho học sinh khác
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
