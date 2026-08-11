import { RegistrationRecord } from '../types';
import { CLASSES_DATA } from '../data/classesData';

export interface SheetSyncResult {
  success: boolean;
  message: string;
  updatedRange?: string;
}

/**
 * Sends student registration record to backend API to append to Google Sheets
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
        spreadsheetId: '1-gEeQfiw830niRJ0chGufp497sW6n0VY917OeKQD_zM',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        message: `HTTP ${response.status}: ${errText || 'Lỗi kết nối máy chủ'}`,
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
