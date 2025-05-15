import { useState } from "react";
import { Link } from "react-router-dom";

function Step2FinancialStrategy() {

    const [currentStep, setCurrentStep] = useState(1);
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
                <form>
                    <div className="row ">
                        <div className="col-md-2 d-flex flex-column personal-detail-label">
                            {currentStep === 1 ? (
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
                            ) : (
                                <>
                                    <label className="form-label" htmlFor="">Home Value</label>
                                    <label className="form-label" htmlFor="">Vacation Homes</label>
                                    <label className="form-label" htmlFor="">Rental Properties</label>
                                    <label className="form-label" htmlFor="">Lump Sum Pension (Pre-tax)</label>
                                    <label className="form-label" htmlFor="">Long-Term Care Insurance</label>
                                    <label className="form-label" htmlFor="">Life Insurance</label>
                                    <label className="form-label" htmlFor="">Business Interest</label>
                                    <label className="form-label" htmlFor="">Other Assets</label>
                                    <label className="form-label" htmlFor="">Total</label>
                                </>
                            )}
                        </div>
                        <div className="col-md-10">
                            <div className="row gx-4 personal-detail-input-container">
                                {currentStep === 1 ? (
                                    <>
                                        <div className="col-md-6">
                                            <div className="personal-detail-input">
                                                <h2>You</h2>
                                                <label className="form-label responsive-label" htmlFor="">Check/ Savings/ Money Market</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">CD's</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Stock/ Bonds/ Brokerage</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">IRAs (Pre-tax)</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Roth IRAs</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Other Fund/SMA's</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Qualified Retirement Accounts (401k, 403B, TSA)</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Total</label>
                                                <input type="text" className="form-control" placeholder="$00.00" />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="personal-detail-input">
                                                <h2>Spouse</h2>
                                                <label className="form-label responsive-label" htmlFor="">Check/ Savings/ Money Market</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">CD's</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Stock/ Bonds/ Brokerage</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">IRAs (Pre-tax)</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Roth IRAs</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Other Fund/SMA's</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Qualified Retirement Accounts (401k, 403B, TSA)</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Total</label>
                                                <input type="text" className="form-control" placeholder="$00.00" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="col-md-6">
                                            <div className="personal-detail-input">
                                                <h2>You</h2>
                                                <label className="form-label responsive-label" htmlFor="">Home Value</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Vacation Homes</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Rental Properties</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Lump Sum Pension (Pre-tax)</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Long-Term Care Insurance</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Life Insurance</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Business Interest</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Other Assets</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Total</label>
                                                <input type="text" className="form-control" placeholder="$00.00" />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="personal-detail-input">
                                                <h2>Spouse</h2>
                                                <label className="form-label responsive-label" htmlFor="">Home Value</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Vacation Homes</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Rental Properties</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Lump Sum Pension (Pre-tax)</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Long-Term Care Insurance</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Life Insurance</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Business Interest</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Other Assets</label>
                                                <input type="text" className="form-control" placeholder="Enter Amount" />
                                                <label className="form-label responsive-label" htmlFor="">Total</label>
                                                <input type="text" className="form-control" placeholder="$00.00" />
                                            </div>
                                        </div>
                                    </>
                                )}



                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-2 my-4 text-area-label">
                            <label className="form-label" htmlFor="">Note</label>
                        </div>
                        <div className="col-md-10 my-4 form-textarea">
                            <textarea className="form-control" placeholder="Enter note here..."></textarea>

                            <div className="text-end mt-3">
                                {currentStep === 1 ? (
                                    <>
                                        <button className="next-btn" type="submit" onClick={goToNextStep}>Next</button>
                                    </>
                                ) : (
                                    <>
                                        <button className="next-btn" type="submit pe-3" onClick={goToPreviousStep}>Previous</button>
                                        <Link className="next-btn" type="submit" to='/step3'>Next</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Step2FinancialStrategy;