import { useLocation, Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const steps = [
    { step: 1, title: 'Personal Detail', path: '/step1' },
    { step: 2, title: 'Financial Strategy', path: '/step2' },
    { step: 3, title: 'Needs and Healthcare', path: '/step3' },
    { step: 4, title: 'Property & Market', path: '/step4' },
    { step: 5, title: 'Value', path: '/step5' },
    { step: 6, title: 'Retirement', path: '/step6' },
];

const Sidebar = () => {
    const location = useLocation();
    const currentStep = parseInt(location.pathname.replace('/step', ''), 10);

    return (
        <>
            <div className="logo">
                <img src={logo} alt="Logo" className="img-fluid" />
            </div>

            <div className="sidebar-content">
                {steps.map((item, index) => (
                    <Link to={item.path} key={index} className="sidebar-item-link">
                        <div className="sidebar-item">
                            <div className={`step-icon-circle ${currentStep >= item.step ? 'selected' : ''}`}>
                                <i className="fa-solid fa-angles-right"></i>
                                {item.step <= steps.length - 1 ? <div className="step-line"></div> : ''}
                            </div>
                            <div className="step-text">
                                <h3>Step {item.step}</h3>
                                <h4>{item.title}</h4>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
};

export default Sidebar;
