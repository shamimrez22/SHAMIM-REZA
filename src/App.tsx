import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { SkillsPage } from './pages/SkillsPage';
import { ServicesPage } from './pages/ServicesPage';
import { WorkPage } from './pages/WorkPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { CVDownloadModal } from './components/CVDownloadModal';
import { JobDescriptionModal } from './components/JobDescriptionModal';

// Smooth instant scroll-to-top whenever a route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function MainApp() {
  const {
    personalInfo,
    updateProfilePhoto,
    isCVModalOpen,
    closeCVModal,
    isJDModalOpen,
    closeJDModal,
  } = usePortfolio();

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-500 overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Sticky Navigation Bar with Multi-Page Links, Theme Toggle & ADMIN PANEL inside Logo */}
      <Navbar personalInfo={personalInfo} />

      {/* Multi-Page Routes: Each page has its own dedicated content */}
      <main className="flex-grow">
        <Routes>
          {/* Home Page: Hero, Stats, Featured previews & Navigation Hub */}
          <Route
            path="/"
            element={
              <HomePage
                personalInfo={personalInfo}
                onUpdatePhoto={updateProfilePhoto}
              />
            }
          />

          {/* Dedicated About Page */}
          <Route
            path="/about"
            element={<AboutPage personalInfo={personalInfo} />}
          />

          {/* Dedicated Skills & Tools Page */}
          <Route path="/skills" element={<SkillsPage />} />

          {/* Dedicated Services & Work Process Page */}
          <Route path="/services" element={<ServicesPage />} />

          {/* Dedicated Sample Work / Projects Page */}
          <Route path="/work" element={<WorkPage />} />

          {/* Dedicated Experience, Education & Testimonials Page */}
          <Route path="/experience" element={<ExperiencePage />} />

          {/* Dedicated Contact Page */}
          <Route
            path="/contact"
            element={<ContactPage personalInfo={personalInfo} />}
          />

          {/* Dedicated ADMIN PANEL Page - Control Everything */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Catch-all redirect to Home */}
          <Route
            path="*"
            element={
              <HomePage
                personalInfo={personalInfo}
                onUpdatePhoto={updateProfilePhoto}
              />
            }
          />
        </Routes>
      </main>

      {/* Persistent Footer with Multi-Page Links */}
      <Footer personalInfo={personalInfo} />

      {/* Global Modals for CV and Job Description Download & Templates */}
      <CVDownloadModal isOpen={isCVModalOpen} onClose={closeCVModal} />
      <JobDescriptionModal isOpen={isJDModalOpen} onClose={closeJDModal} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <HashRouter>
          <ScrollToTop />
          <MainApp />
        </HashRouter>
      </PortfolioProvider>
    </ThemeProvider>
  );
}
