import { useState } from "react";
import { Link } from "react-router-dom";

function Step2FinancialStrategy() {
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

    //step 2
    const [youAssetArray, setYouAssetArray] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
    const handleAssetYouChange = index => (e) => {
        setYouAssetArray(prevArray => {
            const newArray = [...prevArray];
            newArray[index] = Number(e.target.value);
            return newArray;
        });
    }
    const youAssetTotal = youAssetArray.reduce((a, b) => a + b, 0);
    const [spouseAssetArray, setSpouseAssetArray] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
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

    return (
        <>
            <div className="personal-detail-container">
                <div className="row">
                    <div className="col personal-detail-header">
                        <h2>Let’s make sure we understand where you are at today financially so we can design a financial strategy to achieve your goals</h2>
                    </div>
                </div>
                {currentStep === 1 ? (
                    <form>
                        <div className="row ">
                            <div className="col-md-2 d-flex flex-column personal-detail-label">
                                <>
                                    <label className="form-label" htmlFor="">Check/ Savings/ Money Market</label>
                                    <label className="form-label" htmlFor="">CD's</label>
                                    <label className="form-label" htmlFor="">Stock/ Bonds/ Brokerage</label>
                                    <label className="form-label" htmlFor="">IRAs (Pre-tax)</label>
                                    <label className="form-label" htmlFor="">Roth IRAs</label>
                                    <label className="form-label" htmlFor="">Other Fund/SMA's</label>
                                    <label className="form-label" htmlFor="">Qualified Retirement Accounts (401k, 403B, TSA)</label>
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
                                                <input type="number" className="form-control" value={youTotal} placeholder="$00.00" />
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
                                                <input type="number" className="form-control" value={spouseTotal} placeholder="$00.00" />
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
                                    <button className="next-btn" type="submit" onClick={goToNextStep}>Next</button>

                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <form>
                        <div className="row ">
                            <div className="col-md-2 d-flex flex-column personal-detail-label">

                                <label className="form-label" htmlFor="">Home Value</label>
                                <label className="form-label" htmlFor="">Vacation Homes</label>
                                <label className="form-label" htmlFor="">Rental Properties</label>
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
                                            <label className="form-label responsive-label">Home Value</label>
                                            <input type="number" onChange={handleAssetYouChange(0)} value={youAssetArray[0] === 0 ? "" : youAssetArray[0]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Vacation Homes</label>
                                            <input type="number" onChange={handleAssetYouChange(1)} value={youAssetArray[1] === 0 ? "" : youAssetArray[1]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Rental Properties</label>
                                            <input type="number" onChange={handleAssetYouChange(2)} value={youAssetArray[2] === 0 ? "" : youAssetArray[2]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Lump Sum Pension (Pre-tax)</label>
                                            <input type="number" onChange={handleAssetYouChange(3)} value={youAssetArray[3] === 0 ? "" : youAssetArray[3]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Long-Term Care Insurance</label>
                                            <input type="number" onChange={handleAssetYouChange(4)} value={youAssetArray[4] === 0 ? "" : youAssetArray[4]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Life Insurance</label>
                                            <input type="number" onChange={handleAssetYouChange(5)} value={youAssetArray[5] === 0 ? "" : youAssetArray[5]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Business Interest</label>
                                            <input type="number" onChange={handleAssetYouChange(6)} value={youAssetArray[6] === 0 ? "" : youAssetArray[6]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Other Assets</label>
                                            <input type="number" onChange={handleAssetYouChange(7)} value={youAssetArray[7] === 0 ? "" : youAssetArray[7]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Total</label>
                                            <input type="number" className="form-control" readOnly value={youAssetTotal} placeholder="$00.00" />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="personal-detail-input">
                                            <h2>Spouse</h2>
                                            <label className="form-label responsive-label">Home Value</label>
                                            <input type="number" onChange={handleAssetSpouseChange(0)} value={spouseAssetArray[0] === 0 ? "" : spouseAssetArray[0]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Vacation Homes</label>
                                            <input type="number" onChange={handleAssetSpouseChange(1)} value={spouseAssetArray[1] === 0 ? "" : spouseAssetArray[1]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Rental Properties</label>
                                            <input type="number" onChange={handleAssetSpouseChange(2)} value={spouseAssetArray[2] === 0 ? "" : spouseAssetArray[2]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Lump Sum Pension (Pre-tax)</label>
                                            <input type="number" onChange={handleAssetSpouseChange(3)} value={spouseAssetArray[3] === 0 ? "" : spouseAssetArray[3]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Long-Term Care Insurance</label>
                                            <input type="number" onChange={handleAssetSpouseChange(4)} value={spouseAssetArray[4] === 0 ? "" : spouseAssetArray[4]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Life Insurance</label>
                                            <input type="number" onChange={handleAssetSpouseChange(5)} value={spouseAssetArray[5] === 0 ? "" : spouseAssetArray[5]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Business Interest</label>
                                            <input type="number" onChange={handleAssetSpouseChange(6)} value={spouseAssetArray[6] === 0 ? "" : spouseAssetArray[6]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Other Assets</label>
                                            <input type="number" onChange={handleAssetSpouseChange(7)} value={spouseAssetArray[7] === 0 ? "" : spouseAssetArray[7]} className="form-control" placeholder="Enter Amount" />
                                            <label className="form-label responsive-label">Total</label>
                                            <input type="number" className="form-control" readOnly value={spouseAssetTotal} placeholder="$00.00" />
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
                                    <Link className="next-btn" type="submit" to='/step3'>Next</Link>
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