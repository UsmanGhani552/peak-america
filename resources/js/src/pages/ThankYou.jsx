import { useNavigate } from "react-router-dom";
import { clearApiInstance } from "../api";

function ThankYou() {
    const navigate = useNavigate();
    console.log("Returning to home page");
    const returnHome = () => {
        clearApiInstance();
        window.location.href = '/'; // Redirect to the home page or the first step of the form
    };
    return (
        <>
            <div className="text-center">
                <h1 className="text-success">Thank You!</h1>
                <p>Your form has been submitted successfully.</p>
                <button className="btn btn-primary" onClick={returnHome}>Fill Another Form</button>
            </div>
        </>
    );
}
export default ThankYou;