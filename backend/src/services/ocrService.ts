import db from '../db';

export const getOCRResult = async (
  filePath: string
): Promise<string | null> => {
  const result = await db.query(
    'SELECT ocr_text FROM ocr_results WHERE file_path = $1',
    [filePath]
  );

  if (result.rows.length > 0) {
    return result.rows[0].ocr_text;
  }

  return null;
};

export const saveOCRResult = async (
  filePath: string,
  ocrText: string
): Promise<void> => {
  await db.query(
    'INSERT INTO ocr_results (file_path, ocr_text) VALUES ($1, $2) ON CONFLICT (file_path) DO NOTHING',
    [filePath, ocrText]
  );
};
