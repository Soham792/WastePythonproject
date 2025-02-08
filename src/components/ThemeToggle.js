import { useTheme } from "../contexts/ThemeContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
      <FontAwesomeIcon icon={theme === "light" ? faSun : faMoon} className="theme-icon" />
    </button>
  )
}

