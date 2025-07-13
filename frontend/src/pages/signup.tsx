import { useState } from 'react';
import { useRouter } from 'next/router';
import { signup } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/signup.module.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { login } = useAuth();
  const router = useRouter();

  // Password strength calculation
  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[a-z]/.test(pass)) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const getStrengthClass = () => {
    if (passwordStrength < 50) return 'weak';
    if (passwordStrength < 75) return 'medium';
    return 'strong';
  };

  const getStrengthText = () => {
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Medium';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await signup(name, email, password);
      const { token } = response as { token: string };
      login(token);
      router.push('/dashboard');
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles['form-wrapper']}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>
          Join us today and start your journey
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles['input-group']}>
            <label htmlFor="name" className={styles['input-label']}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className={`${styles.input} ${error ? styles.error : ''}`}
            />
          </div>

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
              className={`${styles.input} ${error ? styles.error : ''}`}
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
                placeholder="Create a strong password"
                value={password}
                required
                onChange={handlePasswordChange}
                className={`${styles.input} ${error ? styles.error : ''}`}
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
            
            {password && (
              <div className={styles['password-strength']}>
                <div className={styles['strength-bar']}>
                  <div
                    className={`${styles['strength-fill']} ${styles[getStrengthClass()]}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
                <span className={styles['strength-text']}>
                  Password strength: {getStrengthText()}
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className={styles['error-message']}>
              <span>⚠</span> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !name || !email || !password}
            className={`${styles.button} ${isLoading ? styles.loading : ''}`}
          >
            {isLoading ? '' : 'Create Account'}
          </button>
        </form>

        <div className={styles.divider}>
          <span className={styles['divider-text']}>or</span>
        </div>

        <div className={styles.link}>
          Already have an account?{' '}
          <a href="/login">Sign in here</a>
        </div>
      </div>
    </div>
  );
}