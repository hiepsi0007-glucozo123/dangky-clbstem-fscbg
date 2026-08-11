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
    const { records, spreadsheetId } = req.body || {};

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Danh sách hồ sơ đăng ký không được để trống.'
      });
    }

    const result = await appendRecordsToSheet(records, spreadsheetId);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('API /api/sync-all Handler Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi đồng bộ toàn bộ đơn: ' + (error?.message || 'Không xác định'),
      error: String(error)
    });
  }
}
