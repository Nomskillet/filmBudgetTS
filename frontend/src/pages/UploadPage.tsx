// src/pages/UploadPage.tsx
import { useState } from 'react';
import api from '../utils/axios';

function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePath, setFilePath] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!selectedFile) return alert('Please select a file first.');

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      setUploading(true);
      setError('');
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFilePath(res.data.filePath);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-semibold mb-4">Upload an Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>

      {filePath && (
        <div className="mt-4">
          <h3 className="font-bold mb-1">Uploaded File Path:</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm break-all">
            {filePath}
          </pre>
        </div>
      )}

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}

export default UploadPage;
