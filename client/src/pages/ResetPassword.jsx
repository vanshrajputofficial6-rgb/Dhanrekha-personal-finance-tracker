import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setSubmitting(true);
    try {
      const res = await resetPassword(token, password);
      setMessage(res.message);
      setTimeout(() => navigate("/login"), 1500);
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
      <h3>Set a new password</h3>
      <label>
        New password
        <input type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      <label>
        Confirm password
        <input type="password" minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
      </label>

      {message && <p className="status-text">{message}</p>}
      {error && <p className="status-text status-text--error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Please wait..." : "Update password"}
        </button>
      </div>
    </form>
  );
}