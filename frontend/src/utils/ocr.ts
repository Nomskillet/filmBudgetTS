import api from './axios';

export const runOCRRequest = async (filePath: string): Promise<string> => {
  const response = await api.post('/ocr', { filePath });
  return response.data.ocr_text;
};
