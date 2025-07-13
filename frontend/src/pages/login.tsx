import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/login.module.css';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login: setToken } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const { access_token } = await login(email, password) as { access_token: string };
      setToken(access_token);
      router.push('/dashboard');
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles['form-wrapper']}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>
          Sign in to continue to your account
        </p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles['input-group']}>
            <label htmlFor="email" className={styles['input-label']}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className={`${styles.input} ${error && !email ? styles.error : ''}`}
              disabled={isLoading}
            />
          </div>

          <div className={styles['input-group']}>
            <label htmlFor="password" className={styles['input-label']}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.input} ${error && !password ? styles.error : ''}`}
                disabled={isLoading}
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'white',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: '0.7',
                  transition: 'opacity 0.3s ease',
                  width: '24px',
                  height: '24px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
              >
                {showPassword ? (
                  // Eye Open Icon
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  // Eye Closed Icon
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className={styles['error-message']}>
              <span>⚠</span> {error}
            </div>
          )}

          <button
            type="submit"
            className={`${styles.button} ${isLoading ? styles.loading : ''}`}
            disabled={isLoading}
          >
            {isLoading ? '' : 'Sign In'}
          </button>
        </form>

        <div className={styles.divider}>
          <span className={styles['divider-text']}>or</span>
        </div>

        <div className={styles.link}>
          Don't have an account?{' '}
          <Link href="/signup">
            Create one here
          </Link>
        </div>

        <div className={styles.link}>
          <Link href="/forgot-password">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}