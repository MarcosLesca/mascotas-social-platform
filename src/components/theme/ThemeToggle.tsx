"use client";

import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
  };

  const getThemeLabel = () => {
    if (theme === 'system') {
      return resolvedTheme === 'dark' ? 'Sistema (Oscuro)' : 'Sistema (Claro)';
    }
    return theme === 'dark' ? 'Oscuro' : 'Claro';
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-200 border border-neutral-200 dark:border-neutral-700 group"
      title={`Tema actual: ${getThemeLabel()}`}
    >
      <div className="w-6 h-6 space-y-1.5 flex flex-col justify-center relative">
        {/* Sun icon for light theme */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${resolvedTheme === 'light' ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
        </div>
        {/* Moon icon for dark theme */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${resolvedTheme === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-4 h-4 bg-neutral-700 rounded-full relative">
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-neutral-900 rounded-full"></div>
          </div>
        </div>
      </div>
      <span className="sr-only">Cambiar tema</span>
    </button>
  );
}