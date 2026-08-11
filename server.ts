import express from 'express';
import path from 'path';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Default Target Google Sheet ID provided by user
const DEFAULT_SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '1-gEeQfiw830niRJ0chGufp497sW6n0VY917OeKQD_zM';

// Header row definition for Google Sheets
const SHEET_HEADERS = [
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
 * Initialize Google Sheets API Client dynamically
 */
async function getGoogleSheetsClient() {
  try {
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    return sheets;
  } catch (err) {
    console.error('Failed to initialize Google Auth Client:', err);
    return null;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', spreadsheetId: DEFAULT_SPREADSHEET_ID });
});

// Endpoint to append registration to Google Sheet
app.post('/api/append-sheet', async (req, res) => {
  try {
    const { record, classInfo } = req.body;

    if (!record || !record.studentName) {
      return res.status(400).json({ success: false, message: 'Dữ liệu đăng ký không hợp lệ.' });
    }

    const spreadsheetId = req.body.spreadsheetId || DEFAULT_SPREADSHEET_ID;

    // Build row values matching SHEET_HEADERS
    const row = [
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
      classInfo?.name || record.selectedClassId || '',
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

    const sheets = await getGoogleSheetsClient();

    if (!sheets) {
      console.warn('Google Sheets client could not be created. Skipping Google Sheets sync.');
      return res.status(200).json({
        success: false,
        message: 'Chưa cấu hình quyền Google Sheets, bản ghi đã được lưu trong ứng dụng.'
      });
    }

    // Check if sheet has content/headers, if empty write headers first
    try {
      const getRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'A1:A1',
      });

      if (!getRes.data.values || getRes.data.values.length === 0) {
        // Append Header first
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'A1',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [SHEET_HEADERS],
          },
        });
      }
    } catch (checkErr) {
      console.warn('Could not read existing sheet header, attempting direct append:', checkErr);
    }

    // Append student registration row
    const appendRes = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    });

    console.log('Successfully appended row to Google Sheet:', appendRes.data.updates?.updatedRange);

    return res.json({
      success: true,
      message: 'Thêm dữ liệu vào Google Sheet thành công!',
      updatedRange: appendRes.data.updates?.updatedRange
    });
  } catch (error: any) {
    console.error('Error appending to Google Sheet:', error?.message || error);
    return res.status(200).json({
      success: false,
      message: 'Không thể thêm dữ liệu vào Google Sheet: ' + (error?.message || 'Lỗi kết nối'),
      error: String(error)
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
