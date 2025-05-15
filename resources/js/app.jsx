import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Sidebar from './components/Layout/Sidebar';
import { StrictMode } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/style.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter, Navigate, replace, Route, Router, Routes } from 'react-router-dom';
import Step1PersonalDetail from './components/FormWizard/Step1PersonalDetail';
import Step2FinancialStrategy from './components/FormWizard/Step2FinancialStrategy';
import Step3NeedsAndhealthCare from './components/FormWizard/Step3NeedsAndHealthCare';
import Step4WantsAndNeeds from './components/FormWizard/Step4WantsAndDreams';
import Step5PropertyAndMarket from './components/FormWizard/Step5PropertyAndMarket';
import Step6Value from './components/FormWizard/Step6Value';
import Step7Retirement from './components/FormWizard/Step7Retirement';
import Step8FinancialAssets from './components/FormWizard/Step8FinancialAssets';


function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }
    return (
        <BrowserRouter>
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
                        <Routes>
                            <Route path="/" element={<Navigate to="/step1" replace />}/>
                            <Route path="/step1" element={<Step1PersonalDetail />} />
                            <Route path="/step2" element={<Step2FinancialStrategy />} />
                            <Route path="/step3" element={<Step3NeedsAndhealthCare />} />
                            <Route path="/step4" element={<Step4WantsAndNeeds />} />
                            <Route path="/step5" element={<Step5PropertyAndMarket />} />
                            <Route path="/step6" element={<Step6Value />} />
                            <Route path="/step7" element={<Step7Retirement />} />
                            <Route path="/step8" element={<Step8FinancialAssets />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<StrictMode>
    <App />
</StrictMode>);