import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getApiInstance } from "../../src/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Toaster from "../Layout/Toaster";
import useStepRedirect from "../../src/hooks/useStepRedirect";
import LoadingSpinner from "../LoadingSpinner";

function Step5Value() {
    const navigate = useNavigate();

    useStepRedirect('5');
const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        step: 5,
        question_answers: [
            { answer: null }, // Q1: Generate income
            { answer: null }, // Q2: Legacy important
            { answer: null }, // Q3: Income without spending principal
            { answer: null }, // Q4: Will/POA/Trust
            { answer: null }, // Q5: Expecting inheritance
            { answer: null }, // Q6: Risk preference
            { answer: null }, // Q7: Years investing (select)
            { answer: null }  // Q8: Stock allocation (select)
        ],
        note: ''
    });

    const handleRadioChange = (questionIndex, value) => {
        setFormData(prev => {
            const updatedAnswers = [...prev.question_answers];
            updatedAnswers[questionIndex] = { answer: value };
            return {
                ...prev,
                question_answers: updatedAnswers
            };
        });
    };

    const handleSelectChange = (questionIndex, e) => {
        setFormData(prev => {
            const updatedAnswers = [...prev.question_answers];
            updatedAnswers[questionIndex] = { answer: e.target.value };
            return {
                ...prev,
                question_answers: updatedAnswers
            };
        });
    };

    const handleNoteChange = (e) => {
        setFormData(prev => ({
            ...prev,
            note: e.target.value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const api = await getApiInstance();
        console.log("Form Data:", formData);
        await api.post('submit-form', formData)
            .then(response => {
                console.log("Form submitted successfully:", response.data);
                toast.success("Success! Your details have been saved.");
                localStorage.setItem('currentStep', '6');
                setTimeout(() => {
                    setIsSubmitting(false);
                    navigate('/step6');
                }, 1500);
            })
            .catch(error => {
                setIsSubmitting(false);
                if (error.response && error.response.data) {
                    const errorData = error.response.data.data.error;
                    // Process each error and show in toast
                    Object.entries(errorData).forEach(([key, messages]) => {
                        // Show each error message in a toast
                        toast.error(`${messages}`);

                    });
                } else {
                    toast.error("An unknown error occurred. Please try again.");
                    console.error("Unknown error:", error);
                }
            });
    }

    return (
        <>
        <LoadingSpinner show={isSubmitting} />
         <Toaster/>
            <div className="container-fluid personal-detail-container">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col personal-detail-header">
                            <h2>Help us learn a little more about you.</h2>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-8 d-flex flex-column personal-detail-label true-false-label">
                            <label className="form-label" >Would you like to generate more income from your assets today?</label>
                            <div className="responsive-radio-sec d-none">
                                <input type="radio" className="form-check-input" name="RadioDefault1" />
                                <label className="form-label" >Yes</label>
                                <input type="radio" className="form-check-input" name="RadioDefault1" />
                                <label className="form-label" >No</label>
                            </div>
                            <label className="form-label">Is leaving a legacy (inheritance) behind important to you? </label>
                            <div className="responsive-radio-sec d-none">
                                <input type="radio" className="form-check-input" name="RadioDefault1" />
                                <label className="form-label" >Yes</label>
                                <input type="radio" className="form-check-input" name="RadioDefault1" />
                                <label className="form-label" >No</label>
                            </div>
                            <label className="form-label">Would you like to generate enough income without spending down the principle?</label>
                            <div className="responsive-radio-sec d-none">
                                <input type="radio" className="form-check-input" name="RadioDefault1" />
                                <label className="form-label" >Yes</label>
                                <input type="radio" className="form-check-input" name="RadioDefault1" />
                                <label className="form-label" >No</label>
                            </div>
                            <label className="form-label">Do You currently have a Will/POA/Living Will or Trust in Place Today?</label>
                            <div className="responsive-radio-sec d-none">
                                <input type="radio" className="form-check-input" name="RadioDefault1" />
                                <label className="form-label" >Yes</label>
                                <input type="radio" className="form-check-input" name="RadioDefault1" />
                                <label className="form-label" >No</label>
                            </div>
                            <label className="form-label">Are you expecting to receive an inheritance in the future?</label>
                            <div className="responsive-radio-sec d-none">
                                <input type="radio" className="form-check-input" name="RadioDefault1" />
                                <label className="form-label" >Yes</label>
                                <input type="radio" className="form-check-input" name="RadioDefault1" />
                                <label className="form-label" >No</label>
                            </div>
                            <label className="form-label">At this stage in life which type of investor would best classify you in terms your risk preference</label>
                            <div className="responsive-radio-sec d-none">
                                <input type="radio" className="form-check-input" name="RadioDefault1" />
                                <label className="form-label">Yes</label>
                                <input type="radio" className="form-check-input" name="RadioDefault1" />
                                <label className="form-label">No</label>
                            </div>


                        </div>
                        <div className="col-4 true-false-input">
                            <div className="row gx-5 personal-detail-input-container">
                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>Yes</h2>
                                        {[0, 1, 2, 3, 4, 5].map((index) => (
                                            <input
                                                key={`yes-${index}`}
                                                type="radio"
                                                className="form-check-input value-radio"
                                                name={`RadioDefault${index}`}
                                                checked={formData.question_answers[index].answer === "Yes"}
                                                onChange={() => handleRadioChange(index, "Yes")}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>No</h2>
                                        {[0, 1, 2, 3, 4, 5].map((index) => (
                                            <input
                                                key={`no-${index}`}
                                                type="radio"
                                                className="form-check-input value-radio"
                                                name={`RadioDefault${index}`}
                                                checked={formData.question_answers[index].answer === "No"}
                                                onChange={() => handleRadioChange(index, "No")}
                                            />
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="row mb-3">
                        <div className="col-8 d-flex flex-column true-false-label">
                            <label className="form-label form-select-label">How many years have you been investing?</label>
                        </div>
                        <div className="col-4">
                            <select
                                className="form-select percentage-select"
                                value={formData.question_answers[6].answer || ""}
                                onChange={(e) => handleSelectChange(6, e)}
                            >
                                <option value="">Select Years</option>
                                <option value="0-5">0-5</option>
                                <option value="6-10">6-10</option>
                                <option value="11-20">11-20</option>
                                <option value="20+">20+</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-8 d-flex flex-column true-false-label">
                            <label className="form-label form-select-label">What percentage of your portfolio has typically been allocated to stocks/equities?</label>
                        </div>
                        <div className="col-4">
                            <select
                                className="form-select percentage-select"
                                value={formData.question_answers[7].answer || ""}
                                onChange={(e) => handleSelectChange(7, e)}
                            >
                                <option value="">Select Percentage</option>
                                <option value="0-25%">0-25%</option>
                                <option value="25-50%">25-50%</option>
                                <option value="50-75%">50-75%</option>
                                <option value="75-100%">75-100%</option>
                            </select>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-md-2 my-4 text-area-label">
                            <label className="form-label">Note</label>
                        </div>
                        <div className="col-md-10 my-4 form-textarea">
                            <textarea
                                className="form-control"
                                placeholder="Enter note here..."
                                value={formData.note}
                                onChange={handleNoteChange}
                            ></textarea>

                            <div className="d-flex justify-content-between mt-3">
                                <Link className="next-btn" type="submit" to='/step4'>Previous</Link>
                                <button className="next-btn" type="submit">Next</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div >
        </>
    )
}

export default Step5Value;