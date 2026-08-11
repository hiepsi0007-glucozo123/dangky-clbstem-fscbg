import { google } from 'googleapis';

export const DEFAULT_SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || process.env.GOOGLE_SHEET_ID || '1-gEeQfiw830niRJ0chGufp497sW6n0VY917OeKQD_zM';

export const SHEET_HEADERS = [
  'Mã tra cứu',
  'Thời gian đăng ký',
  'Họ tên học sinh',
  'Ngày sinh',
  'Cấp học',
  'Khối hiện tại',
  'Lớp hiện tại',
  'Họ tên Phụ huynh',
  'Số điện thoại Zalo',
  'Email liên hệ',
  'Lớp CLB đăng ký',
  'Mã lớp',
  'Nhóm chuyên môn',
  'Hình thức tuyển chọn',
  'Học phí',
  'Mục đích đăng ký PHHS',
  'Cam kết Thời gian & Đưa đón',
  'Cam kết Vật tư (8-10tr)',
  'Cam kết Thi Quốc gia',
  'Cam kết Thi Quốc tế',
  'Trạng thái hồ sơ',
  'Ghi chú bổ sung'
];

/**
 * Get an authenticated Google Sheets client using environment variables.
 * Supports:
 * 1. GOOGLE_SERVICE_ACCOUNT_KEY (Raw or Base64 JSON string of the Service Account key file)
 * 2. GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY
 * 3. Default Application Credentials (GCP environment)
 */
export async function getGoogleSheetsClient() {
  const serviceAccountKeyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_CREDENTIALS_JSON;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  const scopes = ['https://www.googleapis.com/auth/spreadsheets'];

  // 1. Full Service Account JSON Key from GOOGLE_SERVICE_ACCOUNT_KEY
  if (serviceAccountKeyRaw && serviceAccountKeyRaw.trim()) {
    try {
      let parsedKey: any;
      let jsonString = serviceAccountKeyRaw.trim();

      if (jsonString.startsWith('{')) {
        parsedKey = JSON.parse(jsonString);
      } else {
        // Attempt base64 decode if passed as base64 string
        const decoded = Buffer.from(jsonString, 'base64').toString('utf-8');
        parsedKey = JSON.parse(decoded);
      }

      if (parsedKey.private_key) {
        parsedKey.private_key = parsedKey.private_key.replace(/\\n/g, '\n');
      }

      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: parsedKey.client_email,
          private_key: parsedKey.private_key,
        },
        scopes,
      });

      return {
        sheets: google.sheets({ version: 'v4', auth }),
        clientEmail: parsedKey.client_email
      };
    } catch (parseErr: any) {
      throw new Error(`Lỗi đọc biến môi trường GOOGLE_SERVICE_ACCOUNT_KEY: ${parseErr?.message || parseErr}`);
    }
  }

  // 2. Individual GOOGLE_CLIENT_EMAIL & GOOGLE_PRIVATE_KEY
  if (clientEmail && privateKey) {
    let formattedPrivateKey = privateKey.trim();
    if (formattedPrivateKey.startsWith('"') && formattedPrivateKey.endsWith('"')) {
      formattedPrivateKey = formattedPrivateKey.substring(1, formattedPrivateKey.length - 1);
    }
    formattedPrivateKey = formattedPrivateKey.replace(/\\n/g, '\n');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail.trim(),
        private_key: formattedPrivateKey,
      },
      scopes,
    });

    return {
      sheets: google.sheets({ version: 'v4', auth }),
      clientEmail: clientEmail.trim()
    };
  }

  // 3. Fallback to GCP Default Application Credentials
  try {
    const auth = new google.auth.GoogleAuth({ scopes });
    return {
      sheets: google.sheets({ version: 'v4', auth }),
      clientEmail: 'GCP Default Credentials'
    };
  } catch (err: any) {
    throw new Error('Chưa cấu hình Google Service Account trong biến môi trường (Thiếu GOOGLE_SERVICE_ACCOUNT_KEY hoặc GOOGLE_CLIENT_EMAIL & GOOGLE_PRIVATE_KEY).');
  }
}

/**
 * Formats a registration record object into a spreadsheet row matching SHEET_HEADERS
 */
export function formatRecordToRow(record: any, classInfo?: any): string[] {
  return [
    record.trackingCode || '',
    record.createdAt || new Date().toLocaleString('vi-VN'),
    record.studentName || '',
    record.dob || '',
    record.schoolLevel || '',
    record.currentGrade ? `Khối ${record.currentGrade}` : '',
    record.className || '',
    record.parentName || '',
    record.zaloPhone || '',
    record.email || '',
    classInfo?.name || record.selectedClassName || record.selectedClassId || '',
    classInfo?.code || '',
    classInfo?.categoryGroup || '',
    classInfo ? (classInfo.isExamRequired ? 'Thi tuyển' : 'Đăng ký tự do') : '',
    'Miễn phí 100%',
    record.registrationPurpose || '',
    record.timeCommitment ? 'ĐỒNG Ý (Tự đưa đón)' : 'Không',
    record.equipmentCommitment ? 'SẴN SÀNG ĐẦU TƯ' : 'Không',
    record.competitionNational ? 'CÓ (Sẵn sàng)' : 'Không',
    record.competitionInternational ? 'CÓ (Sẵn sàng)' : 'Không',
    record.status || 'Chờ sơ loại',
    record.notes || ''
  ];
}

/**
 * Appends a single record or multiple records to the Google Sheet
 */
export async function appendRecordsToSheet(records: any[], spreadsheetIdOverride?: string) {
  const spreadsheetId = spreadsheetIdOverride || DEFAULT_SPREADSHEET_ID;

  if (!records || records.length === 0) {
    return {
      success: false,
      message: 'Không có dữ liệu đăng ký để ghi vào Google Sheet.'
    };
  }

  let sheetsClientObj;
  try {
    sheetsClientObj = await getGoogleSheetsClient();
  } catch (authErr: any) {
    return {
      success: false,
      message: authErr?.message || 'Chưa cấu hình Service Account trong biến môi trường.'
    };
  }

  const { sheets, clientEmail } = sheetsClientObj;

  try {
    // 1. Check if header row exists
    try {
      const getRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'A1:A1',
      });

      if (!getRes.data.values || getRes.data.values.length === 0) {
        // Append Header row
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'A1',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [SHEET_HEADERS],
          },
        });
      }
    } catch (headerErr: any) {
      console.warn('Could not verify sheet header, proceeding to append:', headerErr?.message);
    }

    // 2. Prepare rows
    const rows = records.map(r => formatRecordToRow(r.record || r, r.classInfo));

    // 3. Append rows to spreadsheet
    const appendRes = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: rows,
      },
    });

    return {
      success: true,
      message: `Đã đồng bộ thành công ${records.length} hồ sơ vào Google Sheet!`,
      updatedRange: appendRes.data.updates?.updatedRange,
      spreadsheetId
    };

  } catch (error: any) {
    console.error('Google Sheets API Error:', error);
    const errMsg = error?.message || String(error);

    if (errMsg.includes('403') || errMsg.includes('permission') || errMsg.includes('caller does not have permission')) {
      return {
        success: false,
        message: `Lỗi phân quyền Google Sheet (403): Service Account (${clientEmail}) chưa được cấp quyền chỉnh sửa. Vui lòng mở Google Sheet, nhấn 'Chia sẻ' (Share) và thêm email ${clientEmail} với quyền Người chỉnh sửa (Editor).`,
        error: errMsg
      };
    }

    if (errMsg.includes('404') || errMsg.includes('Requested entity was not found')) {
      return {
        success: false,
        message: `Lỗi không tìm thấy Google Sheet (404): ID Google Sheet '${spreadsheetId}' không tồn tại hoặc sai. Vui lòng kiểm tra lại biến GOOGLE_SPREADSHEET_ID.`,
        error: errMsg
      };
    }

    return {
      success: false,
      message: `Lỗi ghi Google Sheet: ${errMsg}`,
      error: errMsg
    };
  }
}
