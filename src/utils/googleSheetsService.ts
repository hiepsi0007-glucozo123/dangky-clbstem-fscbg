import { google } from 'googleapis';

export const DEFAULT_SPREADSHEET_ID = 
  process.env.GOOGLE_SHEET_ID || 
  process.env.GOOGLE_SPREADSHEET_ID || 
  '1-gEeQfiw830niRJ0chGufp497sW6n0VY917OeKQD_zM';

export const SHEET_HEADERS = [
  'STT',
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

// Default fallback Service Account credentials for instant execution in Google AI Studio
const BUILTIN_CLIENT_EMAIL = 'dangky-clbstem-fscbg@dangky-clbstem-fscbg.iam.gserviceaccount.com';
const BUILTIN_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDCVJGPWaFZyCFi
A5gaJ2vwjbqONFfXe3Np4gBp2bhnkh/pMjXpWe8tZxNk14jUr3nlO0Lm746ayKfq
+B+NEHISaqcARcPJTQrn86LWQEDWg4SuiI1yDo4WvwEo/sf+ct/ObJvwOP9Rz3w4
1EAI6h32fiZa+No0KNCNDFs8ZB8SMZjLSJohIbiMTsDueIjOgTQF8yrsahpKz+uD
Pf2Ob6zFshB7E1Gqz0s6HIpdIV5gorTOWV170faAPN5A0rnv5Ss0eeW+Vv7Sx4bE
lSK1vie1e+7IRRbiBd8FhxJHwlDfMIPg9oZGPDGfO7vAtX9HUIRrNJh5K7jPyWnc
ZSQ5oqFRAgMBAAECggEADp2PqQljsj30DMwaZ3UpkBkIu+NB7Anz3zXJNCzUyq1Z
yw8ksN07uN10vvPa7awY7d2sJXRE9G08+9YXgWOIQMxWrRWSKRSrSlCvoY+JkNip
ZPsOMFLZ6uoIq02mOwPmwz6157ZRtZR2UkvcWQ9Km5xXRCZNOvkK3mDch8k78QE6
XloXfRg7BGFdgPhxjyrHeHf/ND0J93/mBsxgXGxkQy89+rOztkN+m6jx+w1gKqMb
u8T39MTVBG/jzVNALGUS09YuFMzznean3J0aXbNS2gQonufexfVIEPNZCKx7LX/X
yjGSwHFF3IkfEcyHMlqJyi7VIYY3XxQx0hrQvvZJcQKBgQDkWNYJa/xTwkASFCgB
Pyw5QaT2ggf9zKqUvv3iJsKc2uTr9BqZQjxV0GkmxzmiBdelOyUA7lgrrHIeqA3J
yjf0Aj6r1DMdkj76iLgqYih8bNWFErSyt0hEQb1ezWPIUcsSOyMhqSEUhmyyhMxV
rSbOTSi+I+2YyLLjiNyCYax/RQKBgQDZ3Se7SWPrsPOhLQB3YCe1eCQMaVT14A4Y
dROj6Dv1Zi286jBS7KPy6XAzVfOeOvD0usvgpLPr5cRmThSVlikTNUuXP1DjVlU+
79QW+tbtBN794jRtNocRo0DmAxgP2b5LQ5fS0wQJoVp09OGUcZ0OoiScWl3P+gWz
wY5nr2WEnQKBgHzDjS7YsaWSHS/Dk5gazC78jwWhRnyFty5OrKlERFEvyKSjW2Uh
q5W3qbxmXjcIuiqthipcEBDMyA24BNCcjLXmBBgeeU9O+NoqmXWO7FAPpxpufgyn
1/RzduS1lC9/gVUUur1Ji6mLSRjBNmQZl3pg7kH1n3w7LILl5JXYiEeBAoGAIhPI
oi/hlD0ybnSGjSWaMHVhVhunsWnhaovtjYbG0iSwZMtQ0be4EUfYR/9awtY/WFhb
iYDZr71Z0hLGf3tkY1/Duh2qPlUDsnt69jk4IwzPAHFAeBC+YdDiVtgHDHunm0gw
WEava/40EvU2z6xRv7c2+MndwKk/+RT+fFNgErUCgYADsrVuNzT4iX8zB9rfYsm4
EQjTsaB/UBdmIeOsVcmBVHbBFiI1I0O3o9R7sIoKaajIFfc4ikgpW0V0FoKEQeB+
8qBVOLqqomZse7jpnLl/z1x04qd7ZZg8UmfwUhJhrBntOnrRtfvhiiEGN4lA7xwE
MWZ8I5/RuVsMqeECHM2SYg==
-----END PRIVATE KEY-----`;

/**
 * Get an authenticated Google Sheets client using JWT authentication.
 * Falls back to built-in Service Account credentials if environment variables are not set,
 * ensuring seamless execution in Google AI Studio and Cloud Run.
 */
export async function getGoogleSheetsClient() {
  const serviceAccountKeyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_CREDENTIALS_JSON;
  let clientEmail = process.env.GOOGLE_CLIENT_EMAIL || BUILTIN_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY || BUILTIN_PRIVATE_KEY;

  const scopes = ['https://www.googleapis.com/auth/spreadsheets'];

  // Case 1: If full JSON string is provided in GOOGLE_SERVICE_ACCOUNT_KEY
  if (serviceAccountKeyRaw && serviceAccountKeyRaw.trim()) {
    try {
      let jsonString = serviceAccountKeyRaw.trim();
      let parsedKey: any;

      if (jsonString.startsWith('{')) {
        parsedKey = JSON.parse(jsonString);
      } else {
        const decoded = Buffer.from(jsonString, 'base64').toString('utf-8');
        parsedKey = JSON.parse(decoded);
      }

      if (parsedKey.client_email && parsedKey.private_key) {
        clientEmail = parsedKey.client_email;
        privateKey = parsedKey.private_key;
      }
    } catch (parseErr: any) {
      console.warn(`Could not parse GOOGLE_SERVICE_ACCOUNT_KEY, falling back:`, parseErr?.message);
    }
  }

  let formattedEmail = clientEmail.trim();
  let formattedKey = privateKey.trim();

  // Strip wrapping outer quotes if present
  if (formattedKey.startsWith('"') && formattedKey.endsWith('"')) {
    formattedKey = formattedKey.substring(1, formattedKey.length - 1);
  }

  // CRITICAL: Replace string literal "\\n" (escaped backslash-n) with real newlines
  formattedKey = formattedKey.replace(/\\n/g, '\n');

  // Initialize JWT client directly without calling GoogleAuth() or using ADC
  const jwtClient = new google.auth.JWT({
    email: formattedEmail,
    key: formattedKey,
    scopes,
  });

  const sheets = google.sheets({ version: 'v4', auth: jwtClient as any });

  return {
    sheets,
    clientEmail: formattedEmail,
  };
}

/**
 * Formats a registration record object into a spreadsheet row matching SHEET_HEADERS
 */
export function formatRecordToRow(record: any, classInfo?: any, stt?: number | string): string[] {
  const sttValue = stt !== undefined && stt !== null && stt !== '' 
    ? String(stt) 
    : (record.stt ? String(record.stt) : '');

  return [
    sttValue,
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
    // 1. Check existing rows in Column A to determine STT & ensure header row
    let existingRowCount = 0;
    try {
      const getRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'A:A',
      });

      if (!getRes.data.values || getRes.data.values.length === 0) {
        // Append Header row if sheet is completely empty
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'A1',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [SHEET_HEADERS],
          },
        });
        existingRowCount = 1;
      } else {
        existingRowCount = getRes.data.values.length;
      }
    } catch (headerErr: any) {
      console.warn('Could not verify sheet header/rows, proceeding with default STT:', headerErr?.message);
    }

    // 2. Prepare rows with calculated STT (starting after existing rows)
    const startStt = existingRowCount > 0 ? existingRowCount : 1;
    const rows = records.map((r, idx) => 
      formatRecordToRow(r.record || r, r.classInfo, r.stt || (startStt + idx))
    );

    // 3. Append rows to spreadsheet using Google Sheets API v4
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
        message: `Lỗi không tìm thấy Google Sheet (404): ID Google Sheet '${spreadsheetId}' không tồn tại hoặc sai. Vui lòng kiểm tra lại biến GOOGLE_SHEET_ID.`,
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
