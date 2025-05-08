// import { useState } from 'react';
// import { runOCRRequest } from '../utils/ocr'; // uses your new OCR utility

// function OCRTester() {
//   const [filePath, setFilePath] = useState('');
//   const [ocrResult, setOcrResult] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleRunOCR = async () => {
//     if (!filePath) {
//       alert('Please provide a filePath');
//       return;
//     }

//     try {
//       setLoading(true);
//       setOcrResult('Running OCR...');
//       const result = await runOCRRequest(filePath);
//       setOcrResult(result);
//     } catch (error) {
//       console.error('OCR error:', error);
//       setOcrResult('Failed to extract text');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-4 bg-white rounded shadow mt-10">
//       <h2 className="text-xl font-semibold mb-4">OCR Tester</h2>
//       <input
//         type="text"
//         placeholder="Enter filePath from upload"
//         className="border p-2 w-full mb-2 rounded"
//         value={filePath}
//         onChange={(e) => setFilePath(e.target.value)}
//       />
//       <button
//         onClick={handleRunOCR}
//         disabled={loading}
//         className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//       >
//         {loading ? 'Running OCR...' : 'Run OCR'}
//       </button>

//       {ocrResult && (
//         <div className="mt-4">
//           <h3 className="font-bold mb-2">Extracted Text:</h3>
//           <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">
//             {ocrResult}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// }

// export default OCRTester;
