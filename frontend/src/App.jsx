import React from 'react';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import About from './About';
import Home from './Home';
import Contact from './Contact';
import Services from './Services';
import Equipment from './Equipment';
import EquipmentDetail from './EquipmentDetail';
import ServiceDetail from './ServiceDetail';
import Products from './Products';
import Factory from './Factory';
import ProductDetail from './ProductDetail';
import Blog from './Blog';
import BlogDetail from './BlogDetail';
import Test from './Test';
import TestCard from './TestCard';
import AdminPanel from './AdminPanel';
import Login from './Login';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ScrollToTop from './components/ScrollToTop';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <div className="App">
            <Routes>
              {/* Login Route - No Header/Footer */}
              <Route path="/login" element={<Login />} />

              {/* Test Route - No Header/Footer */}
              <Route path="/test" element={<Test />} />

              {/* TestCard Route - No Header/Footer */}
              <Route path="/testcard" element={<TestCard />} />

              {/* Admin Panel Routes - No Header/Footer */}
              <Route path="/admin-panel/*" element={<AdminPanel />} />

              {/* Home Route - With Header Only */}
              <Route path="/" element={
                <>
                  <Header />
                  <div style={{ flex: 1 }}>
                    <Home />
                  </div>
                </>
              } />

              {/* Other Main App Routes - With Header/Footer */}
              <Route path="/*" element={
                <>
                  <Header />
                  <div style={{ flex: 1 }}>
                    <Routes>
                      <Route path="/haqqımızda" element={<About />} />
                      <Route path="/xidmətlər" element={<Services />} />
                      <Route path="/xidmətlər/:id" element={<ServiceDetail />} />
                      <Route path="/əlaqə" element={<Contact />} />
                      <Route path="/avadanlıqlar" element={<Equipment />} />
                      <Route path="/avadanlıqlar/:id" element={<EquipmentDetail />} />
                      <Route path="/məhsullar" element={<Products />} />
                      <Route path="/məhsul/:id" element={<ProductDetail />} />
                      <Route path="/zavod" element={<Factory />} />
                      <Route path="/bloq" element={<Blog />} />
                      <Route path="/bloq/:id" element={<BlogDetail />} />
                    </Routes>
                  </div>
                  <Footer />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
