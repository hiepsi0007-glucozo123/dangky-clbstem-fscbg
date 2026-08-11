import { RegistrationRecord } from '../types';
import { CLASSES_DATA } from '../data/classesData';

export interface SheetSyncResult {
  success: boolean;
  message: string;
  updatedRange?: string;
  error?: string;
}

const TARGET_SPREADSHEET_ID = '1-gEeQfiw830niRJ0chGufp497sW6n0VY917OeKQD_zM';

/**
 * Sends a single student registration record to backend API to append to Google Sheets
 */
export const syncRecordToGoogleSheet = async (
  record: RegistrationRecord
): Promise<SheetSyncResult> => {
  try {
    const classInfo = CLASSES_DATA.find(c => c.id === record.selectedClassId);

    const response = await fetch('/api/append-sheet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        record,
        classInfo,
        spreadsheetId: TARGET_SPREADSHEET_ID,
      }),
    });

    if (!response.ok) {
      let errMessage = '';
      try {
        const errJson = await response.json();
        errMessage = errJson.message || errJson.error;
      } catch (e) {
        errMessage = await response.text();
      }

      if (response.status === 404) {
        return {
          success: false,
          message: 'Lỗi 404 (Not Found): Không tìm thấy API route `/api/append-sheet`. Nếu bạn đang chạy trên Vercel, hãy đảm bảo dự án có thư mục `api/append-sheet.ts` hoặc cấu hình `vercel.json` đúng.',
        };
      }

      return {
        success: false,
        message: `HTTP ${response.status}: ${errMessage || 'Lỗi kết nối máy chủ đồng bộ'}`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error syncing registration to Google Sheets:', error);
    return {
      success: false,
      message: 'Không thể kết nối đến máy chủ đồng bộ Google Sheets: ' + (error?.message || 'Lỗi mạng'),
    };
  }
};

/**
 * Sends multiple/all registration records to backend API to batch append to Google Sheets
 */
export const syncAllRecordsToGoogleSheet = async (
  records: RegistrationRecord[]
): Promise<SheetSyncResult> => {
  try {
    if (!records || records.length === 0) {
      return {
        success: false,
        message: 'Không có đơn nào để đồng bộ.',
      };
    }

    const preparedRecords = records.map(r => ({
      record: r,
      classInfo: CLASSES_DATA.find(c => c.id === r.selectedClassId)
    }));

    const response = await fetch('/api/sync-all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: preparedRecords,
        spreadsheetId: TARGET_SPREADSHEET_ID,
      }),
    });

    if (!response.ok) {
      let errMessage = '';
      try {
        const errJson = await response.json();
        errMessage = errJson.message || errJson.error;
      } catch (e) {
        errMessage = await response.text();
      }

      if (response.status === 404) {
        return {
          success: false,
          message: 'Lỗi 404 (Not Found): Không tìm thấy API route `/api/sync-all`. Kiểm tra lại đường dẫn API trên Vercel.',
        };
      }

      return {
        success: false,
        message: `HTTP ${response.status}: ${errMessage || 'Lỗi kết nối máy chủ đồng bộ'}`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error batch syncing registrations to Google Sheets:', error);
    return {
      success: false,
      message: 'Không thể kết nối đến API đồng bộ Google Sheets: ' + (error?.message || 'Lỗi mạng'),
    };
  }
};

