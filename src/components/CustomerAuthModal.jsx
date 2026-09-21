import { useState } from 'react';
import { Lock, Mail, User, X } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';

export default function CustomerAuthModal({ open, onClose }) {
  const { login, register } = useCustomerAuth();
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const reset = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
    setMode('signin');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      handleClose();
    } catch (err) {
      setError(
        err?.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists. Try signing in.'
          : err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password'
          ? 'Incorrect email or password.'
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 flex rounded-lg border border-slate-200 p-1 text-sm font-semibold">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 rounded-md py-1.5 ${mode === 'signin' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 rounded-md py-1.5 ${mode === 'signup' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                required
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          )}
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              required
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              required
              type="password"
              minLength={6}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {error && <p className="text-xs font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            {submitting ? 'Please wait…' : mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
