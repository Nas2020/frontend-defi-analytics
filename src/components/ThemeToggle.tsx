// src/components/ThemeToggle.tsx
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  // Use this function to toggle between dark and light mode
  const toggleTheme = () => {
    const html = document.documentElement;
    const currentTheme = html.classList.contains("dark") ? "light" : "dark";

    // Toggle the class
    html.classList.toggle("dark");

    // Save the preference
    localStorage.setItem("theme", currentTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
      <Moon className="h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
};

export default ThemeToggle;
