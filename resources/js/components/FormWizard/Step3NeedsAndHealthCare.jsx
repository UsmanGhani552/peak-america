import { Link } from "react-router-dom";

function Step3NeedsAndhealthCare() {
    return (
        <>
            <div className="container-fluid personal-detail-container">
                <form action="" className="container-fluid">
                    <div className="row">
                        <div className="col personal-detail-header">
                            <h2>Your Needs (Non-Discretionary)</h2>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col-md-2 d-flex flex-column personal-detail-label">
                            <label className="form-label" htmlFor="">Estimated Monthly Expenses</label>
                            <label className="form-label" htmlFor="">Enter Amount</label>
                            <label className="form-label" htmlFor="">Estimated Annual Expenses</label>
                            <label className="form-label" htmlFor="">Total</label>
                        </div>
                        <div className="col-md-10">

                            <div className="row gx-4 personal-detail-input-container">
                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>You</h2>
                                        <label className="form-label responsive-label" htmlFor="">Estimated Monthly Expenses</label>
                                        <select name="" id="" className="form-select">
                                            <option value="" disabled selected>Select Expense</option>
                                            <option value="">Groceries</option>
                                            <option value="">Bill</option>
                                            <option value="">Fuel</option>
                                        </select>
                                        <label className="form-label responsive-label" htmlFor="">Enter Amount</label>
                                        <input type="text" className="form-control" placeholder="Enter Amount" />
                                        <label className="form-label responsive-label" htmlFor="">Estimated Annual Expenses</label>
                                        <select name="" id="" className="form-select">
                                            <option value="" disabled selected>Select Expense</option>
                                            <option value="">Groceries</option>
                                            <option value="">Bill</option>
                                            <option value="">Fuel</option>
                                        </select>
                                        <label className="form-label responsive-label" htmlFor="">Total</label>
                                        <input type="text" className="form-control" placeholder="$00.00" />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>Spouse</h2>
                                        <label className="form-label responsive-label" htmlFor="">Estimated Monthly Expenses</label>
                                        <select name="" id="" className="form-select">
                                            <option value="" disabled selected>Select Expense</option>
                                            <option value="">Groceries</option>
                                            <option value="">Bill</option>
                                            <option value="">Fuel</option>
                                        </select>
                                        <label className="form-label responsive-label" htmlFor="">Enter Amount</label>
                                        <input type="text" className="form-control" placeholder="Enter Amount" />
                                        <label className="form-label responsive-label" htmlFor="">Estimated Annual Expenses</label>
                                        <select name="" id="" className="form-select">
                                            <option value="" disabled selected>Select Expense</option>
                                            <option value="">Groceries</option>
                                            <option value="">Bill</option>
                                            <option value="">Fuel</option>
                                        </select>
                                        <label className="form-label responsive-label" htmlFor="">Total</label>
                                        <input type="text" className="form-control" placeholder="$00.00" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col personal-detail-header">
                            <h2>Your Wants (Discretionary)</h2>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col-md-2 d-flex flex-column personal-detail-label">
                            <label className="form-label" htmlFor="">Estimated Monthly Expenses</label>
                            <label className="form-label" htmlFor="">Estimated Annual Expenses</label>
                            <label className="form-label" htmlFor="">Total</label>
                        </div>
                        <div className="col-md-10">
                            <div className="row gx-4 personal-detail-input-container">
                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>You</h2>
                                        <label className="form-label responsive-label" htmlFor="">Estimated Monthly Expenses</label>
                                        <select name="" id="" className="form-select">
                                            <option value="" disabled selected>Select Expense</option>
                                            <option value="">Groceries</option>
                                            <option value="">Bill</option>
                                            <option value="">Fuel</option>
                                        </select>
                                        <label className="form-label responsive-label" htmlFor="">Estimated Annual Expenses</label>
                                        <select name="" id="" className="form-select">
                                            <option value="" disabled selected>Select Expense</option>
                                            <option value="">Groceries</option>
                                            <option value="">Bill</option>
                                            <option value="">Fuel</option>
                                        </select>
                                        <label className="form-label responsive-label" htmlFor="">Total</label>
                                        <input type="text" className="form-control" placeholder="$00.00" />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>Spouse</h2>
                                        <label className="form-label responsive-label" htmlFor="">Estimated Monthly Expenses</label>
                                        <select name="" id="" className="form-select">
                                            <option value="" disabled selected>Select Expense</option>
                                            <option value="">Groceries</option>
                                            <option value="">Bill</option>
                                            <option value="">Fuel</option>
                                        </select>
                                        <label className="form-label responsive-label" htmlFor="">Estimated Annual Expenses</label>
                                        <select name="" id="" className="form-select">
                                            <option value="" disabled selected>Select Expense</option>
                                            <option value="">Groceries</option>
                                            <option value="">Bill</option>
                                            <option value="">Fuel</option>
                                        </select>
                                        <label className="form-label responsive-label" htmlFor="">Total</label>
                                        <input type="text" className="form-control" placeholder="$00.00" />
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
                            <textarea className="form-control" placeholder="Enter note here..."></textarea>

                            <div className="d-flex justify-content-between mt-3">
                                <Link className="next-btn" type="submit" to='/step2'>Previous</Link>
                                <Link to={'/step4'} className="next-btn" type="submit">Next</Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Step3NeedsAndhealthCare;