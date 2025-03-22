import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type AuthPageProps = {
  initialMode: 'login' | 'signup';
  setIsLoggedIn: (value: boolean) => void;
};

function AuthPage({ initialMode, setIsLoggedIn }: AuthPageProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleToggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint =
      mode === 'login'
        ? 'http://localhost:5001/api/auth/login'
        : 'http://localhost:5001/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: btoa(password) }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          mode === 'login' ? 'Login successful!' : 'Account created!'
        );

        if (mode === 'login') {
          localStorage.setItem('token', data.token);
          setIsLoggedIn(true);
          setTimeout(() => navigate('/budgets'), 1000);
        } else {
          setTimeout(() => setMode('login'), 1500);
        }
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Auth error:', err);
      toast.error('Error occurred. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {mode === 'login' ? 'Login' : 'Create an Account'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded w-full"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded w-full"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-2">
          {mode === 'login'
            ? "Don't have an account?"
            : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={handleToggleMode}
            className="text-blue-500 hover:underline"
          >
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
