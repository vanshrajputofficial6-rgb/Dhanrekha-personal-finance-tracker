import { useEffect, useState } from "react";

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function ThemeToggle() {
 const [theme, setTheme] = useState(
  () => localStorage.getItem("theme") || "dark"
);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  const handleToggle = (e) => {
    const next = isDark ? "light" : "dark";
    const root = document.documentElement;

    // Start the circular reveal from the center of the button
    const rect = e.currentTarget.getBoundingClientRect();
    root.style.setProperty("--reveal-x", `${rect.left + rect.width / 2}px`);
    root.style.setProperty("--reveal-y", `${rect.top + rect.height / 2}px`);

    // Browsers without View Transitions switch instantly
    if (!document.startViewTransition) {
      setTheme(next);
      return;
    }

    document.startViewTransition(() => setTheme(next));
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}