import path from 'path';

export const isSafePath = (filePath: string): boolean => {
  const normalized = path.normalize(filePath);
  return !normalized.includes('..') && !path.isAbsolute(filePath);
};
