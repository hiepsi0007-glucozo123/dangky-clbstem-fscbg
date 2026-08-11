import * as XLSXModule from 'xlsx';
import { RegistrationRecord } from '../types';
import { CLASSES_DATA } from '../data/classesData';

// Support both ESM and CJS bundling for XLSX
const XLSX: any = (XLSXModule as any).default || XLSXModule;

export const exportRegistrationsToExcel = (records: RegistrationRecord[], fileNamePrefix = 'Danh_Sach_Dang_Ky_CLB_STEM_FPT_Bac_Giang') => {
  try {
    const classMap = new Map(CLASSES_DATA.map(c => [c.id, c]));

    const formattedData = records.map((r, index) => {
      const classInfo = classMap.get(r.selectedClassId);
      
      return {
        'STT': index + 1,
        'Mã tra cứu': r.trackingCode || '',
        'Thời gian đăng ký': r.createdAt || '',
        'Họ tên học sinh': r.studentName || '',
        'Ngày sinh': r.dob ? new Date(r.dob).toLocaleDateString('vi-VN') : '',
        'Cấp học': r.schoolLevel || '',
        'Khối hiện tại': r.currentGrade ? `Khối ${r.currentGrade}` : '',
        'Lớp học hiện tại': r.className || '',
        'Họ tên Phụ huynh': r.parentName || '',
        'Số điện thoại Zalo': r.zaloPhone || '',
        'Email liên hệ': r.email || '',
        'Lớp CLB đăng ký': classInfo ? classInfo.name : (r.selectedClassId || ''),
        'Mã lớp': classInfo ? classInfo.code : '',
        'Giáo viên phụ trách': classInfo?.teacher || '',
        'Lịch học dự kiến': classInfo?.scheduleHint || '',
        'Nhóm chuyên môn': classInfo ? classInfo.categoryGroup : '',
        'Hình thức tuyển chọn': classInfo ? (classInfo.isExamRequired ? 'Thi tuyển' : 'Đăng ký tự do') : '',
        'Học phí': 'Miễn phí 100%',
        'Mục đích đăng ký PHHS': r.registrationPurpose || '',
        'Cam kết Thời gian & Đưa đón': r.timeCommitment ? 'ĐỒNG Ý (Tự đưa đón)' : 'Không',
        'Cam kết Vật tư (8 - 10 triệu)': r.equipmentCommitment ? 'SẴN SÀNG ĐẦU TƯ' : 'Không',
        'Cam kết Thi đấu Quốc gia': r.competitionNational ? 'CÓ (Sẵn sàng)' : 'Không',
        'Cam kết Thi đấu Quốc tế': r.competitionInternational ? 'CÓ (Sẵn sàng)' : 'Không',
        'Trạng thái hồ sơ': r.status || '',
        'Ghi chú bổ sung': r.notes || ''
      };
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Set column widths for clean readability
    const colWidths = [
      { wch: 6 },  // STT
      { wch: 18 }, // Mã tra cứu
      { wch: 20 }, // Thời gian đăng ký
      { wch: 24 }, // Họ tên HS
      { wch: 12 }, // Ngày sinh
      { wch: 12 }, // Cấp học
      { wch: 12 }, // Lớp
      { wch: 24 }, // Họ tên PH
      { wch: 16 }, // SĐT Zalo
      { wch: 26 }, // Email
      { wch: 32 }, // Lớp CLB
      { wch: 12 }, // Mã lớp
      { wch: 18 }, // Nhóm môn
      { wch: 22 }, // Hình thức tuyển
      { wch: 14 }, // Học phí
      { wch: 45 }, // Mục đích
      { wch: 24 }, // Cam kết thời gian
      { wch: 24 }, // Cam kết vật tư
      { wch: 22 }, // Cam kết thi QG
      { wch: 22 }, // Cam kết thi QT
      { wch: 22 }, // Trạng thái
      { wch: 30 }  // Ghi chú
    ];
    worksheet['!cols'] = colWidths;

    // Create workbook and append sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách Đăng ký STEM 2026');

    // Format filename with current date
    const nowStr = new Date().toISOString().slice(0, 10);
    const fullFileName = `${fileNamePrefix}_${nowStr}.xlsx`;

    // Trigger download safely
    try {
      XLSX.writeFile(workbook, fullFileName);
    } catch (writeErr) {
      console.warn('XLSX.writeFile direct download failed, falling back to Blob URL:', writeErr);
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fullFileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    }
  } catch (error) {
    console.error('Failed to export registrations to Excel:', error);
    alert('Không thể xuất file Excel. Vui lòng thử lại.');
  }
};

