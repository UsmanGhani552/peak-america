import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getApiInstance } from "../../src/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Toaster from "../Layout/Toaster";
import LoadingSpinner from "../LoadingSpinner";
import { useStepContext } from "../../src/hooks/StepContext";


function Step6Retirement() {
    const navigate = useNavigate();
    const note = localStorage.getItem('note');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { markStepCompleted } = useStepContext();
    const [formData, setFormData] = useState({
        step: 6,
        question_answers: [
            { answer: null }, // Q1: Generate income
            { answer: null }, // Q2: Legacy important
            { answer: null }, // Q3: Income without spending principal
            { answer: null }, // Q4: Will/POA/Trust
            { answer: null }, // Q5: Expecting inheritance
            { answer: null }  // Q6: Risk preference
        ],
        note: note
    });
    const isSingleStatus = localStorage.getItem('spouseStatus') === 'true';
    const loadStep6DataFromApi = async () => {
        const api = await getApiInstance();
        try {
            const response = await api.post('get-form', { step: 6 });
            const form = response.data.data.multi_step_form6?.[0]; // Handle array safely
            if (form && form.question_answers) {
                const mappedAnswers = Array(6).fill({ answer: null });

                form.question_answers.forEach((qa, i) => {
                    if (qa.answer !== undefined && mappedAnswers[i]) {
                        mappedAnswers[i] = { answer: qa.answer };
                    }
                });

                setFormData(prev => ({
                    ...prev,
                    question_answers: mappedAnswers,
                    note: response.data.data.note || ''
                }));
            }
        } catch (error) {
            console.error("Failed to load step 6 data:", error);
        }
    };

    useEffect(() => {
        loadStep6DataFromApi();
    }, []);

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
        await api.post('submit-form', formData)
            .then(response => {
                console.log("Form submitted successfully:", response.data);
                toast.success("Form submitted successfully!");
                localStorage.setItem('note',formData.note)
                markStepCompleted(6);
                localStorage.clear();
                setTimeout(() => {
                    setIsSubmitting(false);
                    navigate('/thank-you');
                }, 1500);
            })
            .catch(async error => {
                if (error.response.data.message == 'Guest UUID header is invalid.') {
                    await generateGuestId();
                    navigate('/step1');
                }
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
            <Toaster />
            <div className="container-fluid personal-detail-container">
                <div className="row">
                    <div className="col personal-detail-header">
                        <h2>We are nearly finished. Tell us what is top of mind and keeps you up at night when you think about your money in retirement.</h2>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="container-fluid">
                    <div className="row ">
                        <div className="col-8 d-flex flex-column personal-detail-label">
                            <label className="form-label">Do you worry about maintaining your current lifestyle in retirement?</label>
                            <label className="form-label">Do you feel uneasy about not having a clear plan for your financial future?</label>
                            <label className="form-label">Do you want to enjoy your retirement without spending down your principle?</label>
                            <label className="form-label">Are your worried about outliving your retirement savings?</label>
                            <label className="form-label">Do you want to leave a large inheritance/legacy if possible?</label>
                            <label className="form-label">Are you currently working with a financial advisor?</label>
                        </div>
                        <div className="col-4">
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
                    <div className="row">
                        <div className="col-md-2 my-4 text-area-label">
                            <label className="form-label">Note</label>
                        </div>
                        <div className="col-md-10 my-4 form-textarea">
                            <textarea className="form-control" placeholder="Enter note here..."
                                value={formData.note}
                                onChange={handleNoteChange}></textarea>

                            <div className="d-flex justify-content-between mt-3">
                                <Link className="next-btn" type="submit" to='/step5'>Previous</Link>
                                <button className="next-btn" type="submit">Submit</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Step6Retirement;