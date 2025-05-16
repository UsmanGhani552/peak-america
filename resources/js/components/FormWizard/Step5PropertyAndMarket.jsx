import { Link } from "react-router-dom";

function Step5PropertyAndMarket() {
    return (
        <>
            <div className="container-fluid personal-detail-container">
                <form action="" className="container-fluid">
                    <div className="row">
                        <div className="col personal-detail-header">
                            <h2>Primary Residence</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-2 d-flex flex-column personal-detail-label">
                            <label className="form-label" htmlFor="">Primary Residence</label>
                            <label className="form-label" htmlFor="">Estimated Value</label>
                        </div>
                        <div className="col-md-10">

                            <div className="row gx-4 personal-detail-input-container">
                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>You</h2>
                                        <label className="form-label responsive-label" htmlFor="">Primary Residence</label>
                                        <input type="text" className="form-control" placeholder="Enter Address" />
                                        <label className="form-label responsive-label" htmlFor="">Estimated Value</label>
                                        <input type="text" className="form-control" placeholder="Enter Value" />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>Spouse</h2>
                                        <label className="form-label responsive-label" htmlFor="">Primary Residence</label>
                                        <input type="text" className="form-control" placeholder="Enter Address" />
                                        <label className="form-label responsive-label" htmlFor="">Estimated Value</label>
                                        <input type="text" className="form-control" placeholder="Enter Value" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col personal-detail-header">
                            <h2> Rental Properties</h2>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col-md-2 d-flex flex-column personal-detail-label">
                            <label className="form-label" htmlFor="">Property Address</label>
                            <label className="form-label" htmlFor="">Estimated Value</label>
                        </div>
                        <div className="col-md-10">
                            <div className="row gx-4 personal-detail-input-container">
                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>You</h2>
                                        <label className="form-label responsive-label" htmlFor="">Property Address</label>
                                        <input type="text" className="form-control" placeholder="Enter Address" />
                                        <label className="form-label responsive-label" htmlFor="">Estimated Value</label>
                                        <input type="text" className="form-control" placeholder="Enter Value" />
                                        <button className="rental-property-btn">Add Another Rental Property</button>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>Spouse</h2>
                                        <label className="form-label responsive-label" htmlFor="">Property Address</label>
                                        <input type="text" className="form-control" placeholder="Enter Address" />
                                        <label className="form-label responsive-label" htmlFor="">Estimated Value</label>
                                        <input type="text" className="form-control" placeholder="Enter Value" />
                                        <button className="rental-property-btn">Add Another Rental Property</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col personal-detail-header">
                            <h2> Vacation Properties</h2>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col-md-2 d-flex flex-column personal-detail-label">
                            <label className="form-label" htmlFor="">Property Address</label>
                            <label className="form-label" htmlFor="">Estimated Value</label>
                        </div>
                        <div className="col-md-10">
                            <div className="row gx-4 personal-detail-input-container">
                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>You</h2>
                                        <label className="form-label responsive-label" htmlFor="">Property Address</label>
                                        <input type="text" className="form-control" placeholder="Enter Address" />
                                        <label className="form-label responsive-label" htmlFor="">Estimated Value</label>
                                        <input type="text" className="form-control" placeholder="Enter Value" />
                                        <button className="vacation-property-btn">Add Another Vacation Property</button>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>Spouse</h2>
                                        <label className="form-label responsive-label" htmlFor="">Property Address</label>
                                        <input type="text" className="form-control" placeholder="Enter Address" />
                                        <label className="form-label responsive-label" htmlFor="">Estimated Value</label>
                                        <input type="text" className="form-control" placeholder="Enter Value" />
                                        <button className="vacation-property-btn">Add Another Vacation Property</button>
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
                            <Link className="next-btn" type="submit" to='/step4'>Previous</Link>
                                <Link to={'/step6'} className="next-btn" type="submit">Next</Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Step5PropertyAndMarket;