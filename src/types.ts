export type SchoolLevel = 'Tiểu học' | 'THCS' | 'THPT';

export type CategoryGroup = 
  | 'Lập trình' 
  | 'Robocon' 
  | 'Năng khiếu Robot' 
  | 'Năng khiếu Drone';

export interface StemClass {
  id: string;
  code: string;
  name: string;
  categoryGroup: CategoryGroup;
  description: string;
  targetGrades: string; // e.g. "Tiểu học lớp 2–3"
  gradeLevels: number[]; // e.g. [2, 3]
  schoolLevels: SchoolLevel[];
  maxStudents: number;
  currentStudents: number;
  isExamRequired: boolean; // Thi tuyển vs Đăng ký tự do
  tuitionFee: string; // e.g. "Miễn phí học phí"
  hasEquipmentFee: boolean; // true for Robocon/Vex/Drone
  equipmentFeeNotes: string; // "8 - 10 triệu / HS" or "Không tốn vật tư"
  icon: string;
  scheduleHint?: string;
  highlights: string[];
  docUrl?: string;
}

export type RegistrationPurpose = 
  | 'Mong muốn của HS được tham gia học tập và rèn luyện'
  | 'Mong muốn của PH để HS được tham gia học tập và rèn luyện'
  | 'Mong muốn của PH & HS được tham gia học tập và rèn luyện';

export type ApplicationStatus = 
  | 'Chờ sơ loại'
  | 'Đã qua sơ loại Online'
  | 'Trúng tuyển chính thức'
  | 'Vượt chỉ tiêu (Chờ bổ sung)'
  | 'Đã hủy';

export interface RegistrationFormData {
  studentName: string;
  dob: string; // YYYY-MM-DD
  schoolLevel: SchoolLevel;
  currentGrade: number; // 2..12
  className?: string; // e.g. "1A1", "2A3", "6A2"
  parentName: string;
  zaloPhone: string;
  email: string;
  selectedClassId: string;
  
  // Parental Commitments
  registrationPurpose: RegistrationPurpose;
  timeCommitment: boolean; // PHHS Đồng ý với khung thời gian & tự đưa đón
  equipmentCommitment: boolean; // Sẵn sàng đầu tư vật tư 8-10 triệu
  competitionNational: boolean; // Sẵn sàng thi đấu Quốc gia
  competitionInternational: boolean; // Sẵn sàng thi đấu Quốc tế
  notes?: string;
}

export interface RegistrationRecord extends RegistrationFormData {
  id: string;
  trackingCode: string;
  createdAt: string;
  status: ApplicationStatus;
}

export interface TimelineStep {
  id: number;
  phase: string;
  dateRange: string;
  title: string;
  description: string;
  isCurrent?: boolean;
}
