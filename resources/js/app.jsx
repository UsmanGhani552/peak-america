import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Sidebar from './components/Layout/Sidebar';
import { StrictMode } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/style.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter, Navigate, Route, Routes, Outlet } from 'react-router-dom';
import Step1PersonalDetail from './components/FormWizard/Step1PersonalDetail';
import Step2FinancialStrategy from './components/FormWizard/Step2FinancialStrategy';
import Step3NeedsAndhealthCare from './components/FormWizard/Step3NeedsAndHealthCare';
import Step4PropertyAndMarket from './components/FormWizard/Step4PropertyAndMarket';
import Step5Value from './components/FormWizard/Step5Value';
import Step6Retirement from './components/FormWizard/Step6Retirement';
import ThankYou from './src/pages/ThankYou';
import { StepProvider } from './src/hooks/StepContext';

function StepLayout({ isSidebarOpen, toggleSidebar }) {
    return (
        <div className="container-fluid m-0 p-0">
            <div className="row m-0 p-0">
                <div
                    className={`sidebar-toggle-btn ${isSidebarOpen ? "active" : ""}`}
                    onClick={toggleSidebar}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className="col-3 siderbar" id="sidenav-1" style={{ left: isSidebarOpen ? '-100%' : '0%', transition: 'left 0.3s ease', }}>
                    <Sidebar />
                </div>
                <div className="col-md-9 main-content">
                    <Outlet /> {/* This is where the nested routes will render */}
                </div>
            </div>
        </div>
    );
}

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }
    return (
        <BrowserRouter>
        <StepProvider>
                <Routes>
                    {/* All steps use the StepLayout */}
                    <Route element={<StepLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}>
                        <Route path="/" element={<Navigate to="/step1" replace />} />
                        <Route path="/step1" element={<Step1PersonalDetail />} />
                        <Route path="/step2" element={<Step2FinancialStrategy />} />
                        <Route path="/step3" element={<Step3NeedsAndhealthCare />} />
                        <Route path="/step4" element={<Step4PropertyAndMarket />} />
                        <Route path="/step5" element={<Step5Value />} />
                        <Route path="/step6" element={<Step6Retirement />} />
                    </Route>

                    {/* Thank you page doesn't use the StepLayout */}
                    <Route path="/thank-you" element={<ThankYou />} />
                </Routes>
        </StepProvider>
            </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
    <App />
);