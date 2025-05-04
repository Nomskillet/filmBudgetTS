import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import api from '../utils/axios';
import 'react-toastify/dist/ReactToastify.css';
import { HiMail, HiLockClosed } from 'react-icons/hi';

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

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';

      const response = await api.post(endpoint, {
        email,
        password: btoa(password),
      });

      const data = response.data;

      toast.success(
        mode === 'login' ? 'Login successful!' : 'Account created!'
      );

      if (mode === 'login') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userEmail', data.user.email);
        setIsLoggedIn(true);
        setTimeout(() => navigate('/budgets'), 1000);
      } else {
        setTimeout(() => setMode('login'), 1500);
      }
    } catch (error: unknown) {
      console.error('Auth error:', error);

      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response
      ) {
        const err = error as { response?: { data?: { error?: string } } };
        toast.error(err.response?.data?.error || 'Something went wrong');
      } else {
        toast.error('Unknown error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-200 to-indigo-300 px-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-purple-600">
            🎬 Film Budget Tracker
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === 'login' ? 'Welcome back!' : 'Create your account below'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <HiMail />
              </span>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 pr-3 py-2 border rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <HiLockClosed />
              </span>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-3 py-2 border rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {mode === 'login'
            ? "Don't have an account?"
            : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={handleToggleMode}
            className="text-purple-600 font-medium hover:underline"
          >
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
