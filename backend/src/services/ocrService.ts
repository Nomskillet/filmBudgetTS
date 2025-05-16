import db from '../db';

export const getOCRResult = async (
  filePath: string,
  userId: number
): Promise<string | null> => {
  const result = await db.query(
    'SELECT ocr_text FROM ocr_results WHERE file_path = $1 AND user_id = $2',
    [filePath, userId]
  );

  return result.rowCount! > 0 ? result.rows[0].ocr_text : null;
};

export const saveOCRResult = async (
  filePath: string,
  ocrText: string,
  userId: number
): Promise<void> => {
  await db.query(
    'INSERT INTO ocr_results (file_path, ocr_text, user_id) VALUES ($1, $2, $3) ON CONFLICT (file_path, user_id) DO NOTHING',
    [filePath, ocrText, userId]
  );
};
