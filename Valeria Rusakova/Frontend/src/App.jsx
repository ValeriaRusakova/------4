// App.jsx - the layout of the whole site: header on top, current page below.
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";

function App() {
  return (
    <div className="app">
      {/* Accessibility: keyboard users can jump straight to the main content */}
      <a href="#main-content" className="skip-link">
        דלגו לתוכן הראשי
      </a>

      <Header />

      <main id="main-content" className="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* Any unknown address shows the chat */}
          <Route path="*" element={<ChatPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
