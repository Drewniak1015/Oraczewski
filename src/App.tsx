import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Portfolio from "./Components/Portfolio";
import Footer from "./Components/Footer";
import Form from "./Components/Form";
import Aboutus from "./Components/Aboutus";
import Terms from "./Components/Terms";
import Privacy from "./Components/Privacy";
import Services from "./Components/Services";
import OraczewskiMoment from "./Components/OraczewskiMoment";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminLogin from "./Components/Admin";

// Po zmianie podstrony przewija na górę
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <Router>
      <Header />
      <ScrollToTop />
      {/* min-h sprawia, że stopka jest zawsze na dole, nawet na krótkich stronach */}
      <main className="min-h-[calc(100vh-6rem)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Aboutus />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Form />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route
            path="/panel"
            element={
              <ProtectedRoute>
                <OraczewskiMoment />
              </ProtectedRoute>
            }
          />
          {/* Nieistniejący adres -> strona główna */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;