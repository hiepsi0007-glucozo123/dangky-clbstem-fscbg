import { appendRecordsToSheet } from '../src/utils/googleSheetsService.js';

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Phương thức không được hỗ trợ. Hãy dùng POST.'
    });
  }

  try {
    const { record, classInfo, spreadsheetId } = req.body || {};

    if (!record || (!record.studentName && !record.id)) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu học sinh đăng ký không hợp lệ.'
      });
    }

    const result = await appendRecordsToSheet([{ record, classInfo }], spreadsheetId);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('API /api/append-sheet Handler Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi xử lý đồng bộ Google Sheet: ' + (error?.message || 'Không xác định'),
      error: String(error)
    });
  }
}
