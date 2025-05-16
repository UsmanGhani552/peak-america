import { Link } from "react-router-dom";

function Step6Value() {

    return (
        <>
            <div className="container-fluid personal-detail-container">
                <div className="row">
                    <div className="col personal-detail-header">
                        <h2>Help us learn a little more about you.</h2>
                    </div>
                </div>
                <div className="row ">
                    <div className="col-8 d-flex flex-column personal-detail-label">
                        <label className="form-label" for="flexRadioDefault1">Would you like to generate more income from your assets today?</label>
                        <label className="form-label" htmlFor="">How Important is Your Legacy in Terms of Leaving and Inheritance</label>
                        <label className="form-label" htmlFor="">Would you like to generate enough income without spending down the principle?</label>
                        <label className="form-label" htmlFor="">Do You currently have a Will/POA/Living Will or Trust in Place Today?</label>
                        <label className="form-label" htmlFor="">Are you expecting to receive an inheritance in the future?</label>
                        <label className="form-label" htmlFor="">Would you consider yourself and partner/spouse financially savvy or sophisticated investors?</label>
                        <label className="form-label" htmlFor="">At this stage in life which type of investor would best classify you in terms your risk preference</label>

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
                            <Link className="next-btn" type="submit" to='/step5'>Previous</Link>
                                <Link to={'/step7'} className="next-btn" type="submit">Next</Link>
                            </div>
                        </div>
                    </div>
            </div>
        </>
    )
}

export default Step6Value;