import { Link } from "react-router-dom";

function Step7Retirement() {

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
                        <label className="form-label" htmlFor="">What is Your Biggest Concern in either preparing for or in Retirement?</label>
                        <label className="form-label" htmlFor="">Being Able to Fully Retire Without Working?</label>
                        <label className="form-label" htmlFor="">Generating Income Without Risking Principle?</label>
                        <label className="form-label" htmlFor="">Outliving My Money?</label>
                        <label className="form-label" htmlFor="">Growing My Nest Egg to Leave a Large Inheritance?</label>
                        <label className="form-label" htmlFor="">Being Able to Enjoy My Retirement Without Spending Down My Principle</label>
                        <label className="form-label" htmlFor="">Experiencing a Major Loss in the Stock or Bond Market?</label>
                        <label className="form-label" htmlFor="">Are you currently working with a financial advisor today?</label>
                    </div>
                    <div className="col-4">
                        <form action="" className="container-fluid">
                            <div className="row gx-5 personal-detail-input-container">
                            <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>Yes</h2>
                                        <input type="radio" class="form-check-input value-radio" name="RadioDefault1" />
                                        <input type="radio" class="form-check-input value-radio" name="RadioDefault2" />
                                        <input type="radio" class="form-check-input value-radio" name="RadioDefault3" />
                                        <input type="radio" class="form-check-input value-radio" name="RadioDefault4" />
                                        <input type="radio" class="form-check-input value-radio" name="RadioDefault5" />
                                        <input type="radio" class="form-check-input value-radio" name="RadioDefault6" />
                                        <input type="radio" class="form-check-input value-radio" name="RadioDefault7" />
                                        <input type="radio" class="form-check-input value-radio" name="RadioDefault8" />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>No</h2>
                                        <input type="radio" class="form-check-input value-radio" name="RadioDefault1" />
                                        <input type="radio" class="form-check-input value-radio" name="RadioDefault2" />
                                        <input type="radio" class="form-check-input value-radio" name="RadioDefault3" />
                                        <input type="radio" class="form-check-input value-radio" name="RadioDefault4" />
                                        <input type="radio" class="form-check-input value-radio" name="RadioDefault5" />
                                        <input type="radio" class="form-check-input value-radio" name="RadioDefault6" />
                                        <input type="radio" class="form-check-input value-radio" name="RadioDefault7" />
                                        <input type="radio" class="form-check-input value-radio" name="RadioDefault8" />
                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
                <div className="row">
                <div className="col-md-2 my-4 text-area-label">
                        <label className="form-label" htmlFor="">Note</label>
                    </div>
                    <div className="col-md-10 my-4 form-textarea">
                        <textarea className="form-control" placeholder="Enter note here..."></textarea>

                        <div className="d-flex justify-content-between mt-3">
                        <Link className="next-btn" type="submit" to='/step6'>Previous</Link>
                            <Link to={'/step8'} className="next-btn" type="submit">Next</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Step7Retirement;