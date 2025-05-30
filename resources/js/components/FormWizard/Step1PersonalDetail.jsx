import { Link } from "react-router-dom";
import { useState } from "react";

function Step1PersonalDetail() {
    const [inputYou, setYouValue] = useState("1");
    const [inputSpouse, setSpouseValue] = useState("1");

    const handleYouChange = (event) => {
        setYouValue(event.target.value);
    }
    const handleSpouseChange = (event) => {
        setSpouseValue(event.target.value);
    }
    let youValue = [];
    for (let i = 0; i < inputYou; i++) {
        youValue.push(i);
    }
    let spouseValue = [];
    for (let i = 0; i < inputSpouse; i++) {
        spouseValue.push(i);
    }

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
                            <label className="form-label">First Name</label>
                            <label className="form-label">Last Name</label>
                            <label className="form-label">Age</label>
                            <label className="form-label">Cell Phone</label>
                            <label className="form-label">Email</label>
                            <label className="form-label">Marital Status</label>
                            <label className="form-label">Kids</label>
                            <label className="form-label">Kids Age</label>
                        </div>
                        <div className="col-md-10">
                            <div className="row gx-4 personal-detail-input-container">
                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>You</h2>
                                        <label className="form-label responsive-label">First Name</label>
                                        <input type="text" className="form-control" placeholder="Enter First Name" />
                                        <label className="form-label responsive-label">Last Name</label>
                                        <input type="text" className="form-control" placeholder="Enter Last Name" />
                                        <label className="form-label responsive-label">Age</label>
                                        <input type="date" className="form-control" placeholder="Age" />
                                        <label className="form-label responsive-label">Cell Phone</label>
                                        <input type="number" className="form-control" placeholder="000-000-000" />
                                        <label className="form-label responsive-label">Email</label>
                                        <input type="text" className="form-control" placeholder="Enter Email Address" />
                                        <label className="form-label responsive-label">Marital Status</label>
                                        <select name="" id="" className="form-select" placeholder="Select Marital Status">
                                            <option value="">Select marital status</option>
                                            <option value="">Single</option>
                                            <option value="">Married</option>
                                        </select>
                                        <label className="form-label responsive-label">Kids</label>
                                        <input type="number" className="form-control" onChange={handleYouChange} placeholder="Select Kids" />
                                        {youValue.map((index, value) => (
                                              <div key={index}>  {/* or use React.Fragment with key */}
                                              <label className="form-label responsive-label">Kids {index + 1} Age</label>
                                              <input 
                                                type="number" 
                                                className="form-control" 
                                                placeholder={`Select Kids ${index + 1} Age`} 
                                              />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-6 child-two">
                                    <div className="personal-detail-input">
                                        <h2>Spouse</h2>
                                        <label className="form-label responsive-label">First Name</label>
                                        <input type="text" className="form-control" placeholder="Enter First Name" />
                                        <label className="form-label responsive-label">Last Name</label>
                                        <input type="text" className="form-control" placeholder="Enter Last Name" />
                                        <label className="form-label responsive-label">Age</label>
                                        <input type="date" className="form-control" placeholder="Age" />
                                        <label className="form-label responsive-label">Cell Phone</label>
                                        <input type="text" className="form-control" placeholder="000-000-000" />
                                        <label className="form-label responsive-label">Email</label>
                                        <input type="text" className="form-control" placeholder="Enter Email Address" />
                                        <label className="form-label responsive-label">Marital Status</label>
                                        <select name="" id="" className="form-select" placeholder="Select Marital Status">
                                            <option value="">Select marital status</option>
                                            <option value="">Single</option>
                                            <option value="">Married</option>
                                        </select>
                                        <label className="form-label responsive-label">Kids</label>
                                        <input type="number" className="form-control" onChange={handleSpouseChange} placeholder="Select Kids" />
                                        {spouseValue.map((index, value) => (
                                              <div key={index}>  {/* or use React.Fragment with key */}
                                              <label className="form-label responsive-label">Kids {index + 1} Age</label>
                                              <input 
                                                type="number" 
                                                className="form-control" 
                                                placeholder={`Select Kids ${index + 1} Age`} 
                                              />
                                            </div>
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