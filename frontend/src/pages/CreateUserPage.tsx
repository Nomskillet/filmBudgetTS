// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function CreateUserPage() {
//   const navigate = useNavigate(); // ✅ Keep this if you plan to redirect
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5001/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         toast.success('Account created successfully!');
//         setTimeout(() => navigate('/login'), 2000); // ✅ Redirect after success
//       } else {
//         toast.error(data.error || 'Failed to create account');
//       }
//     } catch (err) {
//       console.error('Signup error:', err); // ✅ Logs error for debugging

//       if (err instanceof Error) {
//         toast.error(err.message);
//       } else {
//         toast.error('Something went wrong. Please try again.');
//       }
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

//       <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
//         <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
//           Create an Account
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-gray-700">Email:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full p-2 border rounded"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700">Password:</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full p-2 border rounded"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
//           >
//             Sign Up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default CreateUserPage;
