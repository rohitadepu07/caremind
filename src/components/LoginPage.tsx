import React, { FormEvent, useState } from 'react';
import { ArrowRight, Eye, EyeOff, Heart, Leaf, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import logo from '../assets/logo.png';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

function getAppRedirectUrl(): string {
  const appPath = window.location.pathname.endsWith('/')
    ? window.location.pathname
    : `${window.location.pathname}/`;
  return new URL(appPath, window.location.origin).toString();
}

interface LoginPageProps {
  onContinueAsGuest: () => void;
  isPasswordRecovery?: boolean;
  onPasswordUpdated?: () => void;
  initialMessage?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onContinueAsGuest,
  isPasswordRecovery = false,
  onPasswordUpdated,
  initialMessage = '',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(initialMessage);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setMessage('Supabase is not configured. Add the project URL and publishable key to your local environment file.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    try {
      if (isPasswordRecovery) {
        if (password !== confirmPassword) {
          setMessage('The passwords do not match.');
          return;
        }
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        onPasswordUpdated?.();
        setMessage('Your password has been updated.');
      } else if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) {
          setMessage('Your account was created. Check your email to confirm your address, then sign in.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to authenticate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!supabase) {
      setMessage('Supabase is not configured. Add the project URL and publishable key to your local environment file.');
      return;
    }
    if (!email.trim()) {
      setMessage('Enter your email address first, and we will send you a password reset link.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getAppRedirectUrl(),
      });
      if (error) throw error;
      setMessage('If an account exists for that address, a password reset link is on its way.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to send a password reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      setMessage('Supabase is not configured. Add the project URL and publishable key to your local environment file.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAppRedirectUrl(),
        },
      });
      if (error) throw error;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in with Google. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-welcome" aria-label="Welcome to CareMind">
        <a className="login-brand" href="/" aria-label="CareMind home">
          <img src={logo} alt="" />
          <span>CareMind</span>
        </a>

        <div className="login-welcome-copy">
          <span className="login-eyebrow"><Heart size={15} fill="currentColor" /> Care, connection, and comfort</span>
          <h1>A little support.<br /><span>A lot of heart.</span></h1>
          <p>A gentle place for everyday moments, meaningful memories, and the people who care.</p>

          <div className="login-illustration" aria-hidden="true">
            <span className="login-orbit login-orbit-one" />
            <span className="login-orbit login-orbit-two" />
            <div className="login-sun" />
            <div className="login-plant login-plant-one"><Leaf /></div>
            <div className="login-plant login-plant-two"><Leaf /></div>
            <div className="login-plant login-plant-three"><Leaf /></div>
            <div className="login-ground" />
            <div className="login-note"><Heart size={16} fill="currentColor" /><span>Here for the little things</span></div>
          </div>
        </div>

        <div className="login-welcome-footer">
          <ShieldCheck size={17} />
          <span>A thoughtful companion for your care journey</span>
        </div>
      </section>

      <section className="login-form-section" aria-labelledby="login-heading">
        <div className="login-form-wrap">
          <div className="login-mobile-brand">
            <img src={logo} alt="" />
            <span>CareMind</span>
          </div>
          <div className="login-form-heading">
            <span className="login-form-kicker">
              {isPasswordRecovery ? 'ACCOUNT RECOVERY' : isSignUp ? 'GET STARTED' : 'WELCOME BACK'}
            </span>
            <h2 id="login-heading">
              {isPasswordRecovery ? 'Choose a new password' : isSignUp ? 'Create your account' : 'Sign in to CareMind'}
            </h2>
            <p>
              {isPasswordRecovery
                ? 'Choose a new password to secure your CareMind account.'
                : isSignUp
                  ? 'Create a private space for your care journey.'
                  : 'Your caring moments are right where you left them.'}
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {!isPasswordRecovery && (
              <>
                <label htmlFor="login-email">Email address</label>
                <div className="login-input-wrap">
                  <Mail size={19} aria-hidden="true" />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="login-password-label">
              <label htmlFor="login-password">{isPasswordRecovery ? 'New password' : 'Password'}</label>
              {!isSignUp && !isPasswordRecovery && (
                <button className="login-text-button" type="button" onClick={handlePasswordReset} disabled={isSubmitting}>
                  Forgot password?
                </button>
              )}
            </div>
            <div className="login-input-wrap">
              <LockKeyhole size={19} aria-hidden="true" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isSignUp || isPasswordRecovery ? 'new-password' : 'current-password'}
                placeholder={isPasswordRecovery ? 'Enter your new password' : 'Enter your password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
              />
              <button
                className="login-visibility-button"
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            {isPasswordRecovery && (
              <>
                <label htmlFor="login-confirm-password">Confirm new password</label>
                <div className="login-input-wrap">
                  <LockKeyhole size={19} aria-hidden="true" />
                  <input
                    id="login-confirm-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    minLength={6}
                    required
                  />
                </div>
              </>
            )}

            {message && <p className="login-message" role="status">{message}</p>}

            <button className="login-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Please wait…'
                : isPasswordRecovery
                  ? 'Update password'
                  : isSignUp
                    ? 'Create account'
                    : 'Sign in'} <ArrowRight size={18} />
            </button>
          </form>

          {!isPasswordRecovery && (
            <p className="login-auth-switch">
              {isSignUp ? 'Already have an account?' : 'New to CareMind?'}{' '}
              <button
                className="login-text-button"
                type="button"
                onClick={() => {
                  setIsSignUp((value) => !value);
                  setMessage('');
                }}
              >
                {isSignUp ? 'Sign in' : 'Create an account'}
              </button>
            </p>
          )}

          {!isPasswordRecovery && <div className="login-divider"><span>OR</span></div>}

          {!isPasswordRecovery && (
            <div className="login-alternatives">
              <button
                className="login-google"
                type="button"
                onClick={() => void handleGoogleSignIn()}
                disabled={isSubmitting || !isSupabaseConfigured}
              >
                <svg aria-hidden="true" viewBox="0 0 48 48" className="login-google-icon">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" transform="translate(0 3)" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.63 5.91c4.45-4.11 7.14-10.16 7.14-17.56Z" transform="translate(0 0)" />
                  <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.98 23.98 0 0 0 0 21.56l7.98-6.19Z" transform="translate(0 0)" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.79l-7.63-5.91c-2.13 1.43-4.86 2.27-8.28 2.27-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" transform="translate(0 -3)" />
                </svg>
                {isSubmitting ? 'Connecting to Google…' : 'Continue with Google'}
              </button>
              <button className="login-guest" type="button" onClick={onContinueAsGuest}>
                Explore as a guest <ArrowRight size={18} />
              </button>
            </div>
          )}

          {!isPasswordRecovery && <p className="login-demo-note">
            {isSupabaseConfigured
              ? 'Sign-in and private per-account data sync are powered by Supabase.'
              : 'Email sign-in needs Supabase project settings. You can still explore as a guest.'}
          </p>}
          <p className="login-terms">Made with care, for every step of the journey <Heart size={13} fill="currentColor" /></p>
        </div>
      </section>
    </main>
  );
};
