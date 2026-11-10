import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="transaction-form auth-form" onSubmit={handleSubmit}>
      <p className="auth-tagline">व्यक्तिगत वित्त संग्रह</p>
      <h3>{mode === "login" ? "Log in" : "Create account"}</h3>

      {mode === "register" && (
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
      )}
      <label>
        Email
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </label>
      <label>
        Password
        <div className="password-field">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            minLength={6}
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </label>

      {error && <p className="status-text status-text--error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Please wait..." : mode === "login" ? "Log in" : "Register"}
        </button>
      </div>

      <p className="status-text">
        {mode === "login" ? "No account? " : "Already registered? "}
        <button
          type="button"
          className="button--ghost"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
        >
          {mode === "login" ? "Register" : "Log in"}
        </button>
      </p>
      {mode === "login" && (
        <p className="status-text">
            <a href="/forgot-password">Forgot password?</a>
        </p>
)}
    </form>
  );
}