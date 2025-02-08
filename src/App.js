import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { ThemeToggle } from "./components/ThemeToggle"
import ImagePage from "./pages/ImagePage"
import HistoryPage from "./pages/HistoryPage"
import CameraPage from "./pages/CameraPage"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome, faCamera, faHistory } from "@fortawesome/free-solid-svg-icons"

import "./App.css"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <nav className="navbar">
            <div className="navbar-container">
              <div className="nav-brand">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-removebg-preview-ooG4A6yGFutMq3YDblFai6ej8hMFMy.png"
                  alt="Recycling Logo"
                  className="logo"
                />
              </div>
              <div className="nav-links">
                <Link to="/">
                  <FontAwesomeIcon icon={faHome} /> Home
                </Link>
                <Link to="/camera">
                  <FontAwesomeIcon icon={faCamera} /> Camera
                </Link>
                <Link to="/history">
                  <FontAwesomeIcon icon={faHistory} /> History
                </Link>
              </div>
              <ThemeToggle />
            </div>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<ImagePage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/camera" element={<CameraPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App

