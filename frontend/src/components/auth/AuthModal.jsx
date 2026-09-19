import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../context/AuthContext";

const validateName = (value) => {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length < 1 || words.length > 3) return false;
  return words.every((word) => /^[A-Za-z]{2,30}$/.test(word));
};

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

function UserIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function MailIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function LockIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function PasswordField({ id, value, onChange, autoComplete, placeholder, inputClass }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        minLength={6}
        className={`${inputClass} pr-10`}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:text-gray-600"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>
    </div>
  );
}

function AuthModal({ mode, onClose, onSwitchMode }) {
  const { login, signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === "signup";

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  }, [mode]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const validateForm = () => {
    if (isSignup && !validateName(name)) {
      return "Name must be 1–3 words, letters only (e.g. Rahul, John Smith)";
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      return "Please enter a valid email address";
    }
    if (!password || password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      if (isSignup) {
        await signup({
          name: name.trim(),
          email: email.trim(),
          password,
        });
      } else {
        await login({
          email: email.trim(),
          password,
        });
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10";
  const labelClass = "mb-1.5 block text-sm font-semibold text-gray-800";

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="relative my-auto w-full max-w-[420px] rounded-xl bg-white text-gray-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-6 pb-6 pt-6">
          <div className="mb-5 flex items-start gap-3 pr-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              {isSignup ? <UserIcon /> : <MailIcon />}
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
                {isSignup ? (
                  <>
                    Create Your <span className="text-primary">Account</span>
                  </>
                ) : (
                  <>
                    Welcome <span className="text-primary">Back</span>
                  </>
                )}
              </h2>
              <p className="mt-1 text-sm leading-snug text-gray-500">
                {isSignup
                  ? "Sign up with your email and password"
                  : "Sign in with your email and password"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup ? (
              <div>
                <label htmlFor="auth-name" className={labelClass}>
                  Name
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <input
                    id="auth-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your full name"
                    className={fieldClass}
                    required
                  />
                </div>
              </div>
            ) : null}

            <div>
              <label htmlFor="auth-email" className={labelClass}>
                Email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <MailIcon className="h-4 w-4" />
                </span>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={fieldClass}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400">
                  <LockIcon className="h-4 w-4" />
                </span>
                <PasswordField
                  id="auth-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  placeholder={isSignup ? "Create a password (min 6 characters)" : "Enter your password"}
                  inputClass={fieldClass}
                />
              </div>
            </div>

            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition hover:brightness-110 disabled:opacity-60"
            >
              {submitting ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => onSwitchMode("login")}
                  className="font-semibold text-primary hover:underline"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => onSwitchMode("signup")}
                  className="font-semibold text-primary hover:underline"
                >
                  Sign Up
                </button>
              </>
            )}
          </p>

          {isSignup ? (
            <div className="mt-3 border-t border-gray-100 pt-3">
              <p className="flex items-center justify-center gap-1 text-center text-[10px] leading-tight text-gray-400">
                <LockIcon />
                Your information is secure and will never be shared
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AuthModal;
