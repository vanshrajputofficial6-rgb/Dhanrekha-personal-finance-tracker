import { useState } from "react";
import { forgotPassword } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const res = await forgotPassword(email);
      setMessage(res.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="transaction-form auth-form" onSubmit={handleSubmit}>
      <p className="auth-tagline">व्यक्तिगत वित्त संग्रह</p>
      <img src="/logo.png" alt="धनरेखा logo" className="auth-logo" />
      <h3>Forgot password</h3>
      <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>

      {message && <p className="status-text">{message}</p>}
      {error && <p className="status-text status-text--error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Please wait..." : "Send reset link"}
        </button>
      </div>
      <p className="status-text">
        <a href="/login">Back to log in</a>
      </p>
    </form>
  );
}