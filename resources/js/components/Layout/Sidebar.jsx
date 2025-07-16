import { useLocation, Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { useStepContext } from '../../src/hooks/StepContext';

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
    const { completedSteps } = useStepContext();
    const currentStep = parseInt(location.pathname.replace('/step', ''), 10) || 1;
    console.log(completedSteps);
    const isStepAccessible = (stepNumber) => {
        // Allow if step is already completed
        if (completedSteps.includes(stepNumber)) return true;

        // Allow next immediate step after the last completed one
        const maxCompletedStep = Math.max(0, ...completedSteps);
        if (stepNumber === maxCompletedStep + 1) return true;

        // Otherwise, it's not accessible
        return false;
    };

    return (
        <>
            <div className="logo">
                <img src={logo} alt="Logo" className="img-fluid" />
            </div>

            <div className="sidebar-content">
                {steps.map((item, index) => (
                    <Link
                        to={isStepAccessible(item.step) ? item.path : '#'}
                        key={index}
                        className={`sidebar-item-link ${!isStepAccessible(item.step) ? 'disabled-link' : ''}`}
                        onClick={e => !isStepAccessible(item.step) && e.preventDefault()}
                    >
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