import Navbar from "./components/Navbar";
import ScrollToTop from "../src/utils/scrollTop";
import Home from "./components/Home";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import AboutDestination from "./components/AboutDestination";
import { Footer } from "./components/Footer";
import AboutUs from "./components/AboutUs";
import IForm from "./components/IForm";
import DestinationsPage from "./pages/DestinationsPage"; 
import AdminLoginPage from "./pages/Admin/AdminLoginPage"; 
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage"; 
import ProtectedRoute from "./components/Auth/ProtectedRoute"; 
import AddTripPage from "./pages/Admin/AddTripPage"; 
import EditTripPage from "./pages/Admin/EditTripPage"; 
import PrivacyPolicy from './pages/PrivacyPolicy';
import ChatBot from './components/ChatBot';

// Wrapper component to conditionally render ChatBot
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/destination/:id"
          element={<AboutDestination />}
        ></Route>
        <Route path="/about" element={<AboutUs />}></Route>
        <Route path="/IForm" element={<IForm />}></Route>
        <Route path="/destinations" element={<DestinationsPage />}></Route>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route 
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin/add-trip"
          element={
            <ProtectedRoute>
              <AddTripPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin/edit-trip/:id"
          element={
            <ProtectedRoute>
              <EditTripPage />
            </ProtectedRoute>
          }
        />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>

      <Footer />
      
      {/* Only show ChatBot on non-admin routes */}
      {!isAdminRoute && <ChatBot />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
