import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../src/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Toaster from "../Layout/Toaster";

function Step2FinancialStrategy() {
    const navigate = useNavigate();
    const [step1Note, setStep1Note] = useState('');
    const [step2Note, setStep2Note] = useState('');
    const [currentStep, setCurrentStep] = useState(1);


    const [youInputArray, setYouInputArray] = useState([0, 0, 0, 0, 0, 0, 0]);
    const handleYouChange = index => (e) => {
        setYouInputArray(prevArray => {
            const newArray = [...prevArray];
            newArray[index] = Number(e.target.value);
            return newArray;
        });
    }
    const youTotal = youInputArray.reduce((a, b) => a + b, 0);
    const [spouseInputArray, setSpouseInputArray] = useState([0, 0, 0, 0, 0, 0, 0]);
    const handleSpouseChange = index => (e) => {
        setSpouseInputArray(prevArray => {
            const newArray = [...prevArray];
            newArray[index] = Number(e.target.value);
            return newArray;
        });
    }
    const spouseTotal = spouseInputArray.reduce((a, b) => a + b, 0);
    const [youAssetArray, setYouAssetArray] = useState([0, 0, 0, 0, 0, 0]);
    const handleAssetYouChange = index => (e) => {
        setYouAssetArray(prevArray => {
            const newArray = [...prevArray];
            newArray[index] = Number(e.target.value);
            return newArray;
        });
    }
    const youAssetTotal = youAssetArray.reduce((a, b) => a + b, 0);
    const [spouseAssetArray, setSpouseAssetArray] = useState([0, 0, 0, 0, 0, 0]);
    const handleAssetSpouseChange = index => (e) => {
        setSpouseAssetArray(prevArray => {
            const newArray = [...prevArray];
            newArray[index] = Number(e.target.value);
            return newArray;
        });
    }
    const spouseAssetTotal = spouseAssetArray.reduce((a, b) => a + b, 0);

    const goToNextStep = (e) => {
        e.preventDefault();
        setCurrentStep(2);
    }

    const goToPreviousStep = (e) => {
        e.preventDefault();
        setCurrentStep(1);
    }

    //form submission

    const [formData1, setFormData1] = useState({
        step: 2.1,
        note: step1Note,
        person: [
            {
                is_spouse: false,
                checking_savings: 0,
                cds: 0,
                stocks_bonds_brokerage: 0,
                iras_pre_tax: 0,
                roth_iras: 0,
                other_funds: 0,
                qualified_retirement_accounts: 0,
                total: 0,
            },
            {
                is_spouse: true,
                checking_savings: 0,
                cds: 0,
                stocks_bonds_brokerage: 0,
                iras_pre_tax: 0,
                roth_iras: 0,
                other_funds: 0,
                qualified_retirement_accounts: 0,
                total: 0,
            }
        ]
    });
    const [formData2, setFormData2] = useState({
        step: 2.2,
        note: step2Note,
        person: [
            {
                is_spouse: false,
                annuities: 0,
                lump_sum_pension: 0,
                long_term_care_insurance: 0,
                life_insurance: 0,
                business_interest: 0,
                other_assets: 0,
                total: 0,
            },
            {
                is_spouse: true,
                annuities: 0,
                lump_sum_pension: 0,
                long_term_care_insurance: 0,
                life_insurance: 0,
                business_interest: 0,
                other_assets: 0,
                total: 0,
            }
        ]
    });

    // Update formData whenever input arrays or totals change
    useEffect(() => {
        setFormData1(prev => ({
            ...prev,
            person: [
                {
                    ...prev.person[0],
                    checking_savings: youInputArray[0],
                    cds: youInputArray[1],
                    stocks_bonds_brokerage: youInputArray[2],
                    iras_pre_tax: youInputArray[3],
                    roth_iras: youInputArray[4],
                    other_funds: youInputArray[5],
                    qualified_retirement_accounts: youInputArray[6],
                    total: youTotal,
                },
                {
                    ...prev.person[1],
                    checking_savings: spouseInputArray[0],
                    cds: spouseInputArray[1],
                    stocks_bonds_brokerage: spouseInputArray[2],
                    iras_pre_tax: spouseInputArray[3],
                    roth_iras: spouseInputArray[4],
                    other_funds: spouseInputArray[5],
                    qualified_retirement_accounts: spouseInputArray[6],
                    total: spouseTotal,
                }
            ]
        }));
        setFormData2(prev => ({
            ...prev,
            person: [
                {
                    ...prev.person[0],
                    annuities: youAssetArray[0],
                    lump_sum_pension: youAssetArray[1],
                    long_term_care_insurance: youAssetArray[2],
                    life_insurance: youAssetArray[3],
                    business_interest: youAssetArray[4],
                    other_assets: youAssetArray[5],
                    qualified_retirement_accounts: youAssetArray[6],
                    total: youAssetTotal,
                },
                {
                    ...prev.person[1],
                    annuities: spouseAssetArray[0],
                    lump_sum_pension: spouseAssetArray[1],
                    long_term_care_insurance: spouseAssetArray[2],
                    life_insurance: spouseAssetArray[3],
                    business_interest: spouseAssetArray[4],
                    other_assets: spouseAssetArray[5],
                    qualified_retirement_accounts: spouseAssetArray[6],
                    total: spouseAssetTotal,
                },
            ]
        }));
    }, [youInputArray, spouseInputArray, youTotal, spouseTotal, youAssetArray, spouseAssetArray, youAssetTotal, spouseAssetTotal]);
    // console.log('form Data:', formData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = currentStep === 1 ? formData1 : formData2;
        api.post('submit-form', formData)
            .then(response => {
                console.log("Form submitted successfully:", response.data);
                toast.success("Success! Your details have been saved.");
                setTimeout(() => {
                    if (currentStep === 1) {
                        setCurrentStep(prevStep => {
                            // Ensure we're moving to the correct next step
                            const nextStep = 2; // Or your actual next step
                            console.log(`Moving from step ${prevStep} to step ${nextStep}`);
                            return nextStep;
                        });
                    } else {
                        navigate('/step3');
                    }
                }, 1500);
            })
            .catch(error => {
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
            <Toaster/>

            <div className="personal-detail-container">
                <div className="row">
                    <div className="col personal-detail-header">
                        <h2>Let’s make sure we understand where you are at today financially so we can design a financial strategy to achieve your goals</h2>
                    </div>
                </div>
                {currentStep === 1 ? (
                    <form onSubmit={handleSubmit}>
                        <div className="row ">
                            <div className="col-md-2 d-flex flex-column personal-detail-label">
                                <>
                                    <label className="form-label" htmlFor="">Check/ Savings/ Money Market</label>
                                    <label className="form-label" htmlFor="">CD's</label>
                                    <label className="form-label" htmlFor="">Stock/ Bonds/ Brokerage</label>
                                    <label className="form-label" htmlFor="">IRAs (Pre-tax)</label>
                                    <label className="form-label" htmlFor="">Roth IRAs</label>
                                    <label className="form-label" htmlFor="">Other Fund/SMA's</label>
                                    <label className="form-label" htmlFor="">Qualified Retirement Accounts (401k, 403B, TSP)</label>
                                    <label className="form-label" htmlFor="">Total</label>
                                </>
                            </div>
                            <div className="col-md-10">
                                <div className="row gx-4 personal-detail-input-container">
                                    <>
                                        <div className="col-md-6">
                                            <div className="personal-detail-input">
                                                <h2>You</h2>
                                                <label className="form-label responsive-label">Check/ Savings/ Money Market</label>
                                                <input type="number" onChange={handleYouChange(0)} value={youInputArray[0] === 0 ? "" : youInputArray[0]} className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label">CD's</label>
                                                <input type="number" onChange={handleYouChange(1)} value={youInputArray[1] === 0 ? "" : youInputArray[1]} className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label">Stock/ Bonds/ Brokerage</label>
                                                <input type="number" onChange={handleYouChange(2)} value={youInputArray[2] === 0 ? "" : youInputArray[2]} className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label">IRAs (Pre-tax)</label>
                                                <input type="number" onChange={handleYouChange(3)} value={youInputArray[3] === 0 ? "" : youInputArray[3]} className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label">Roth IRAs</label>
                                                <input type="number" onChange={handleYouChange(4)} value={youInputArray[4] === 0 ? "" : youInputArray[4]} className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label">Other Fund/SMA's</label>
                                                <input type="number" onChange={handleYouChange(5)} value={youInputArray[5] === 0 ? "" : youInputArray[5]} className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label">Qualified Retirement Accounts (401k, 403B, TSA)</label>
                                                <input type="number" onChange={handleYouChange(6)} value={youInputArray[6] === 0 ? "" : youInputArray[6]} className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label">Total</label>
                                                <input type="number" className="form-control" value={youTotal} disabled placeholder="$00.00" />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="personal-detail-input">
                                                <h2>Spouse</h2>
                                                <label className="form-label responsive-label">Check/ Savings/ Money Market</label>
                                                <input type="number" onChange={handleSpouseChange(0)} value={spouseInputArray[0] === 0 ? "" : spouseInputArray[0]} className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label">CD's</label>
                                                <input type="number" onChange={handleSpouseChange(1)} value={spouseInputArray[1] === 0 ? "" : spouseInputArray[1]} className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label">Stock/ Bonds/ Brokerage</label>
                                                <input type="number" onChange={handleSpouseChange(2)} value={spouseInputArray[2] === 0 ? "" : spouseInputArray[2]} className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label">IRAs (Pre-tax)</label>
                                                <input type="number" onChange={handleSpouseChange(3)} value={spouseInputArray[3] === 0 ? "" : spouseInputArray[3]} className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label">Roth IRAs</label>
                                                <input type="number" onChange={handleSpouseChange(4)} value={spouseInputArray[4] === 0 ? "" : spouseInputArray[4]} className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label">Other Fund/SMA's</label>
                                                <input type="number" onChange={handleSpouseChange(5)} value={spouseInputArray[5] === 0 ? "" : spouseInputArray[5]} className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label">Qualified Retirement Accounts (401k, 403B, TSA)</label>
                                                <input type="number" onChange={handleSpouseChange(6)} value={spouseInputArray[6] === 0 ? "" : spouseInputArray[6]} className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label">Total</label>
                                                <input type="number" className="form-control" value={spouseTotal} disabled placeholder="$00.00" />
                                            </div>
                                        </div>
                                    </>
                                </div>

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-2 my-4 text-area-label">
                                <label className="form-label" htmlFor="">Note</label>
                            </div>
                            <div className="col-md-10 my-4 form-textarea">
                                <textarea className="form-control" placeholder="Enter note here..." value={step1Note} onChange={(e) => setStep1Note(e.target.value)}></textarea>

                                <div className="d-flex justify-content-between mt-3">
                                    <Link className="next-btn" type="submit" to='/step1'>Previous</Link>
                                    <button className="next-btn" type="submit">Next</button>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="row ">
                            <div className="col-md-2 d-flex flex-column personal-detail-label">

                                <label className="form-label" htmlFor="">Annuities</label>
                                <label className="form-label" htmlFor="">Lump Sum Pension (Pre-tax)</label>
                                <label className="form-label" htmlFor="">Long-Term Care Insurance</label>
                                <label className="form-label" htmlFor="">Life Insurance</label>
                                <label className="form-label" htmlFor="">Business Interest</label>
                                <label className="form-label" htmlFor="">Other Assets</label>
                                <label className="form-label" htmlFor="">Total</label>
                            </div>
                            <div className="col-md-10">
                                <div className="row gx-4 personal-detail-input-container">

                                    <div className="col-md-6">
                                        <div className="personal-detail-input">
                                            <h2>You</h2>
                                            <label className="form-label responsive-label">Annuities</label>
                                            <input type="number" onChange={handleAssetYouChange(0)} value={youAssetArray[0] === 0 ? "" : youAssetArray[0]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Lump Sum Pension (Pre-tax)</label>
                                            <input type="number" onChange={handleAssetYouChange(1)} value={youAssetArray[1] === 0 ? "" : youAssetArray[1]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Long-Term Care Insurance</label>
                                            <input type="number" onChange={handleAssetYouChange(2)} value={youAssetArray[2] === 0 ? "" : youAssetArray[2]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Life Insurance</label>
                                            <input type="number" onChange={handleAssetYouChange(3)} value={youAssetArray[3] === 0 ? "" : youAssetArray[3]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Business Interest</label>
                                            <input type="number" onChange={handleAssetYouChange(4)} value={youAssetArray[4] === 0 ? "" : youAssetArray[4]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Other Assets</label>
                                            <input type="number" onChange={handleAssetYouChange(5)} value={youAssetArray[5] === 0 ? "" : youAssetArray[5]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Total</label>
                                            <input type="number" className="form-control" disabled value={youAssetTotal} placeholder="$00.00" />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="personal-detail-input">
                                            <h2>Spouse</h2>
                                            <label className="form-label responsive-label">Annuities</label>
                                            <input type="number" onChange={handleAssetSpouseChange(0)} value={spouseAssetArray[0] === 0 ? "" : spouseAssetArray[0]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Lump Sum Pension (Pre-tax)</label>
                                            <input type="number" onChange={handleAssetSpouseChange(1)} value={spouseAssetArray[1] === 0 ? "" : spouseAssetArray[1]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Long-Term Care Insurance</label>
                                            <input type="number" onChange={handleAssetSpouseChange(2)} value={spouseAssetArray[2] === 0 ? "" : spouseAssetArray[2]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Life Insurance</label>
                                            <input type="number" onChange={handleAssetSpouseChange(3)} value={spouseAssetArray[3] === 0 ? "" : spouseAssetArray[3]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Business Interest</label>
                                            <input type="number" onChange={handleAssetSpouseChange(4)} value={spouseAssetArray[4] === 0 ? "" : spouseAssetArray[4]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Other Assets</label>
                                            <input type="number" onChange={handleAssetSpouseChange(5)} value={spouseAssetArray[5] === 0 ? "" : spouseAssetArray[5]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Total</label>
                                            <input type="number" className="form-control" disabled value={spouseAssetTotal} placeholder="$00.00" />
                                        </div>
                                    </div>


                                </div>

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-2 my-4 text-area-label">
                                <label className="form-label" htmlFor="">Note</label>
                            </div>
                            <div className="col-md-10 my-4 form-textarea">
                                <textarea className="form-control" placeholder="Enter note here..." value={step2Note} onChange={(e) => setStep2Note(e.target.value)}></textarea>

                                <div className="d-flex justify-content-between mt-3">
                                    <button className="next-btn b-0" type="submit pe-3" onClick={goToPreviousStep}>Previous</button>
                                    <button className="next-btn" type="submit">Next</button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </>
    )
}

export default Step2FinancialStrategy;