import { Link } from "react-router-dom";

function Step5Value() {

    return (
        <>
            <div className="container-fluid personal-detail-container">
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
                        <form action="">
                            <div className="row gx-5 personal-detail-input-container">
                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>Yes</h2>
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault1" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault2" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault3" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault4" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault5" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault6" />

                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>No</h2>
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault1" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault2" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault3" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault4" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault5" />
                                        <input type="radio" className="form-check-input value-radio" name="RadioDefault6" />
                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
                <hr />
                <div className="row mb-3">
                    <div className="col-8 d-flex flex-column true-false-label">
                        <label className="form-label form-select-label">How many years have you been investing?</label>
                    </div>
                    <div className="col-4">
                        <select name="" id="" className="form-select percentage-select">
                            <option value="">Select Percentage</option>
                            <option value="">0-5</option>
                            <option value="">6-10</option>
                            <option value="">11-20</option>
                            <option value="">20+</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-8 d-flex flex-column true-false-label">
                        <label className="form-label form-select-label">What percentage of your portfolio has typically been allocated to stocks/equities?</label>
                    </div>
                    <div className="col-4">
                        <select name="" id="" className="form-select percentage-select">
                            <option value="">Select Percentage</option>
                            <option value="">0-25%</option>
                            <option value="">25-50%</option>
                            <option value="">50-75%</option>
                            <option value="">75-100%</option>
                        </select>
                    </div>

                </div>
                <div className="row">
                    <div className="col-md-2 my-4 text-area-label">
                        <label className="form-label">Note</label>
                    </div>
                    <div className="col-md-10 my-4 form-textarea">
                        <textarea className="form-control" placeholder="Enter note here..."></textarea>

                        <div className="d-flex justify-content-between mt-3">
                            <Link className="next-btn" type="submit" to='/step4'>Previous</Link>
                            <Link to={'/step6'} className="next-btn" type="submit">Next</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Step5Value;