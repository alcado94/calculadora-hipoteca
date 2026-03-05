import React from "react";
import { Moon, Sun } from "lucide-react";
import { useThemeContext } from "../ui/ThemeProvider";

export function Footer() {
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === "dark";

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-700/80">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-1 sm:grid-cols-3 items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <p className="text-center sm:text-left sm:justify-self-start">
          Sitio desarrollado por{" "}
          <a
            href="https://github.com/alcado94/calculadora-hipoteca"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            alcado94
          </a>
        </p>

        <button
          type="button"
          onClick={toggleTheme}
          className="justify-self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span className="text-xs sm:text-sm">{isDark ? "Modo Claro" : "Modo Oscuro"}</span>
        </button>

        <a
          href="https://github.com/alcado94/calculadora-hipoteca"
          target="_blank"
          rel="noopener noreferrer"
          className="text-center sm:text-right sm:justify-self-end text-xs sm:text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline underline-offset-2"
        >
          Ver codigo y reportar mejoras
        </a>
      </div>
    </footer>
  );
}
