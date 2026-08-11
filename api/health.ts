import { DEFAULT_SPREADSHEET_ID } from '../src/utils/googleSheetsService.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const hasAuthKey = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY || 
    process.env.GOOGLE_CREDENTIALS_JSON || 
    (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY)
  );

  return res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    spreadsheetId: DEFAULT_SPREADSHEET_ID,
    hasGoogleAuth: hasAuthKey,
    message: hasAuthKey 
      ? 'Đã cấu hình Google Service Account credentials' 
      : 'Cảnh báo: Chưa cài đặt biến môi trường GOOGLE_SERVICE_ACCOUNT_KEY'
  });
}
