import { Link } from "react-router-dom";

function Step1PersonalDetail() {

    return (
        <>
            <div className="personal-detail-container">
                <div className="row">
                    <div className="col personal-detail-header">
                        <h2>Help us learn a little more about you.</h2>
                    </div>
                </div>
                <form>
                    <div className="row ">
                        <div className="col-md-2 d-flex flex-column personal-detail-label">
                            <label className="form-label" htmlFor="">First Name</label>
                            <label className="form-label" htmlFor="">Last Name</label>
                            <label className="form-label" htmlFor="">Age</label>
                            <label className="form-label" htmlFor="">Cell Phone</label>
                            <label className="form-label" htmlFor="">Email</label>
                            <label className="form-label" htmlFor="">Marital Status</label>
                            <label className="form-label" htmlFor="">Kids</label>
                            <label className="form-label" htmlFor="">Kids Age</label>
                        </div>
                        <div className="col-md-10">
                            <div className="row gx-4 personal-detail-input-container">
                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>You</h2>
                                        <label className="form-label responsive-label" htmlFor="">First Name</label>
                                        <input type="text" className="form-control" placeholder="Enter First Name" />
                                        <label className="form-label responsive-label" htmlFor="">Last Name</label>
                                        <input type="text" className="form-control" placeholder="Enter Last Name" />
                                        <label className="form-label responsive-label" htmlFor="">Age</label>
                                        <input type="date" className="form-control" placeholder="Age" />
                                        <label className="form-label responsive-label" htmlFor="">Cell Phone</label>
                                        <input type="text" className="form-control" placeholder="000-000-000" />
                                        <label className="form-label responsive-label" htmlFor="">Email</label>
                                        <input type="text" className="form-control" placeholder="Enter Email Address" />
                                        <label className="form-label responsive-label" htmlFor="">Marital Status</label>
                                        <select name="" id="" className="form-select" placeholder="Select Marital Status">
                                            <option value="">Select marital status</option>
                                            <option value="">Single</option>
                                            <option value="">Married</option>
                                        </select>
                                        <label className="form-label responsive-label" htmlFor="">Kids</label>
                                        <select name="" id="" className="form-select" placeholder="Select Kids">
                                            <option value="" selected disabled>Select Kids</option>
                                            <option value="">1</option>
                                            <option value="">2</option>
                                            <option value="">3</option>
                                            <option value="">4</option>
                                            <option value="">5</option>
                                        </select>
                                        <label className="form-label responsive-label" htmlFor="">Kids Age</label>
                                        <select name="" id="" className="form-select" placeholder="Select age">
                                            <option value="" selected disabled>Select age</option>
                                            <option value="">1</option>
                                            <option value="">2</option>
                                            <option value="">3</option>
                                            <option value="">4</option>
                                            <option value="">5</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6 child-two">
                                    <div className="personal-detail-input">
                                        <h2>Spouse</h2>
                                        <label className="form-label responsive-label" htmlFor="">First Name</label>
                                        <input type="text" className="form-control" placeholder="Enter First Name" />
                                        <label className="form-label responsive-label" htmlFor="">Last Name</label>
                                        <input type="text" className="form-control" placeholder="Enter Last Name" />
                                        <label className="form-label responsive-label" htmlFor="">Age</label>
                                        <input type="date" className="form-control" placeholder="Age" />
                                        <label className="form-label responsive-label" htmlFor="">Cell Phone</label>
                                        <input type="text" className="form-control" placeholder="000-000-000" />
                                        <label className="form-label responsive-label" htmlFor="">Email</label>
                                        <input type="text" className="form-control" placeholder="Enter Email Address" />
                                        <label className="form-label responsive-label" htmlFor="">Marital Status</label>
                                        <select name="" id="" className="form-select" placeholder="Select Marital Status">
                                            <option value="">Select marital status</option>
                                            <option value="">Single</option>
                                            <option value="">Married</option>
                                        </select>
                                        <label className="form-label responsive-label" htmlFor="">Kids</label>
                                        <select name="" id="" className="form-select" placeholder="Select Kids">
                                            <option value="" selected disabled>Select Kids</option>
                                            <option value="">1</option>
                                            <option value="">2</option>
                                            <option value="">3</option>
                                            <option value="">4</option>
                                            <option value="">5</option>
                                        </select>
                                        <label className="form-label responsive-label" htmlFor="">Kids Age</label>
                                        <select name="" id="" className="form-select" placeholder="Select age">
                                            <option value="" selected disabled>Select age</option>
                                            <option value="">1</option>
                                            <option value="">2</option>
                                            <option value="">3</option>
                                            <option value="">4</option>
                                            <option value="">5</option>
                                        </select>
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

                            <div className="text-end mt-3">
                                <Link to={'/step2'} className="next-btn" type="submit">Next</Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Step1PersonalDetail;