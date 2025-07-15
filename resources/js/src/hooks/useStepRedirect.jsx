// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export default function useStepRedirect(currentStep) {
//     const navigate = useNavigate();
    
//     useEffect(() => {
//         const step = localStorage.getItem('currentStep');
//         const allStepsCompleted = localStorage.getItem('allStepsCompleted');
        
//         // If all steps are completed, don't redirect to any step
//         if (allStepsCompleted === 'true') {
//             navigate('/thank-you');
//         }
        
//         // Otherwise, redirect if needed
//         if (step && step !== currentStep) {
//             if (step === '7') {
//                 navigate('/thank-you');
//             } else {
//                 navigate(`/step${step}`);
//             }
//         }
//     }, [navigate, currentStep]);
// }