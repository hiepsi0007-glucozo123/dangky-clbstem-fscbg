import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { appendRecordsToSheet, DEFAULT_SPREADSHEET_ID } from './src/utils/googleSheetsService.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasAuthKey = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY || 
    process.env.GOOGLE_CREDENTIALS_JSON || 
    (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY)
  );

  res.json({ 
    status: 'ok', 
    spreadsheetId: DEFAULT_SPREADSHEET_ID,
    hasGoogleAuth: hasAuthKey
  });
});

// Endpoint to append single registration to Google Sheet
app.post('/api/append-sheet', async (req, res) => {
  try {
    const { record, classInfo, spreadsheetId } = req.body;

    if (!record || (!record.studentName && !record.id)) {
      return res.status(400).json({ success: false, message: 'Dữ liệu đăng ký không hợp lệ.' });
    }

    const result = await appendRecordsToSheet([{ record, classInfo }], spreadsheetId);
    return res.json(result);
  } catch (error: any) {
    console.error('Error appending to Google Sheet:', error?.message || error);
    return res.status(500).json({
      success: false,
      message: 'Không thể thêm dữ liệu vào Google Sheet: ' + (error?.message || 'Lỗi kết nối'),
      error: String(error)
    });
  }
});

// Endpoint to batch sync all registrations to Google Sheet
app.post('/api/sync-all', async (req, res) => {
  try {
    const { records, spreadsheetId } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'Danh sách hồ sơ không được để trống.' });
    }

    const result = await appendRecordsToSheet(records, spreadsheetId);
    return res.json(result);
  } catch (error: any) {
    console.error('Error batch syncing to Google Sheet:', error?.message || error);
    return res.status(500).json({
      success: false,
      message: 'Không thể đồng bộ tất cả đơn vào Google Sheet: ' + (error?.message || 'Lỗi kết nối'),
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

