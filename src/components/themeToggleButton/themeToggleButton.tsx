import { useTheme } from '../context/themeContext';

export default function ThemeToggleButton() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="text-xl px-2 py-1 rounded hover:bg-bluegren dark:hover:bg-babyblue transition"
        >
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
}
