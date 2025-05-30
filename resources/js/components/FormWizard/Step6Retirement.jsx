import { Link } from "react-router-dom";

function Step6Retirement() {

    return (
        <>
            <div className="container-fluid personal-detail-container">
                <div className="row">
                    <div className="col personal-detail-header">
                        <h2>We are nearly finished. Tell us what is top of mind and keeps you up at night when you think about your money in retirement.</h2>
                    </div>
                </div>
                <div className="row ">
                    <div className="col-8 d-flex flex-column personal-detail-label">
                        <label className="form-label">Do You Worry About Maintaining Your Current Lifestyle in Retirement?</label>
                        <label className="form-label">Do You Feel Uneasy About Not Having a Clear Plan for Your Financial Future?</label>
                        <label className="form-label">Do You Want to Enjoy Your Retirement Without Spending Down Your Principle?</label>
                        <label className="form-label">Are Your Worried About Outliving Your Retirement Savings?</label>
                        <label className="form-label">Do You Want to Leave a Large Inheritance/Legacy If Possible?</label>
                        <label className="form-label">Are You Currently Working with a Financial Advisor?</label>
                    </div>
                    <div className="col-4">
                        <form action="" className="container-fluid">
                            <div className="row gx-5 personal-detail-input-container">
                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>Yes</h2>
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault2" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault3" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault4" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault5" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault6" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault7" />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>No</h2>
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault2" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault3" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault4" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault5" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault6" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault7" />
                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 my-4 text-area-label">
                        <label className="form-label">Note</label>
                    </div>
                    <div className="col-md-10 my-4 form-textarea">
                        <textarea className="form-control" placeholder="Enter note here..."></textarea>

                        <div className="d-flex justify-content-between mt-3">
                            <Link className="next-btn" type="submit" to='/step5'>Previous</Link>
                            <Link className="next-btn" type="submit">Submit</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Step6Retirement;