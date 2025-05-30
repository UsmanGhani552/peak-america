import { useState } from "react";
import { Link } from "react-router-dom";

function Step4PropertyAndMarket() {

    const [rentalproperties, setRentalProperties] = useState({
        you: [{ address: '', value: '' }],
        spouse: [{ address: '', value: '' }]
    });
    const [vacationproperties, setVacationProperties] = useState({
        you: [{ address: '', value: '' }],
        spouse: [{ address: '', value: '' }]
    });

    const addProperty = (propertyType, person) => {
        if (propertyType === 'rental') {
            setRentalProperties(prev => ({
                ...prev,
                [person]: [...prev[person], { address: '', value: '' }],
            }));
        } else if (propertyType === 'vacation') {
            setVacationProperties(prev => ({
                ...prev,
                [person]: [...prev[person], { address: '', value: '' }],
            }));
        }
    };
    return (
        <div className="container-fluid personal-detail-container">
            <form className="container-fluid">
                {/* Primary Residence Section */}
                <div className="row">
                    <div className="col personal-detail-header">
                        <h2>Primary Residence</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 d-flex flex-column personal-detail-label">
                        <label className="form-label">Primary Residence</label>
                        <label className="form-label">Estimated Value</label>
                    </div>
                    <div className="col-md-10">
                        <div className="row gx-4 personal-detail-input-container">
                            {/* You */}
                            <div className="col-md-6">
                                <div className="personal-detail-input">
                                    <h2>You</h2>
                                    <label className="form-label responsive-label">Primary Residence</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Address"
                                    />
                                    <label className="form-label responsive-label">Estimated Value</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Value"
                                    />
                                </div>
                            </div>

                            {/* Spouse */}
                            <div className="col-md-6">
                                <div className="personal-detail-input">
                                    <h2>Spouse</h2>
                                    <label className="form-label responsive-label">Primary Residence</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Address"
                                    />
                                    <label className="form-label responsive-label">Estimated Value</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Value"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rental Properties Section */}
                <div className="row">
                    <div className="col personal-detail-header">
                        <h2>Rental Properties</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 d-flex flex-column personal-detail-label">
                        <label className="form-label">Property Address</label>
                        <label className="form-label">Estimated Value</label>
                    </div>
                    <div className="col-md-10">
                        <div className="row gx-4 personal-detail-input-container">
                            {/* You */}
                            <div className="col-md-6">
                                <div className="personal-detail-input">
                                    <h2>You</h2>
                                    {rentalproperties.you.map((property, index) => (
                                        <div key={index} className="property-group">
                                            <label className="form-label responsive-label">Property Address</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={"Enter Address " + (index + 1)}
                                            />
                                            <label className="form-label responsive-label">Estimated Value</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Value"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addProperty('rental', 'you')}
                                        className="rental-property-btn"
                                    >
                                        Add Another Rental Property
                                    </button>
                                </div>
                            </div>

                            {/* Spouse */}
                            <div className="col-md-6">
                                <div className="personal-detail-input">
                                    <h2>Spouse</h2>
                                    {rentalproperties.spouse.map((property, index) => (
                                        <div key={index} className="property-group">
                                            <label className="form-label responsive-label">Property Address</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={"Enter Address " + (index + 1)}
                                            />
                                            <label className="form-label responsive-label">Estimated Value</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Value"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="rental-property-btn"
                                        onClick={() => addProperty('rental', 'spouse')}
                                    >
                                        Add Another Rental Property
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vacation Properties Section */}
                <div className="row">
                    <div className="col personal-detail-header">
                        <h2>Vacation Properties</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 d-flex flex-column personal-detail-label">
                        <label className="form-label">Property Address</label>
                        <label className="form-label">Estimated Value</label>
                    </div>
                    <div className="col-md-10">
                        <div className="row gx-4 personal-detail-input-container">
                            {/* You */}
                            <div className="col-md-6">
                                <div className="personal-detail-input">
                                    <h2>You</h2>
                                    {vacationproperties.you.map((property, index) => (
                                        <div key={index} className="property-group">
                                            <label className="form-label responsive-label">Property Address</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={"Enter Address " + (index + 1)}
                                            />
                                            <label className="form-label responsive-label">Estimated Value</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Value"
                                            />
                                        </div>

                                    ))}
                                    <button
                                        type="button"
                                        className="vacation-property-btn"
                                        onClick={() => addProperty('vacation', 'you')}
                                    >
                                        Add Another Vacation Property
                                    </button>
                                </div>
                            </div>

                            {/* Spouse */}
                            <div className="col-md-6">
                                <div className="personal-detail-input">
                                    <h2>Spouse</h2>
                                    {vacationproperties.spouse.map((property, index) => (
                                        <div key={index} className="property-group">
                                            <label className="form-label responsive-label">Property Address</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={"Enter Address " + (index + 1)}
                                            />
                                            <label className="form-label responsive-label">Estimated Value</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Value"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="vacation-property-btn"
                                        onClick={() => addProperty('vacation', 'spouse')}
                                    >
                                        Add Another Vacation Property
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes and Navigation */}
                <div className="row">
                    <div className="col-md-2 my-4 text-area-label">
                        <label className="form-label" htmlFor="notes">Note</label>
                    </div>
                    <div className="col-md-10 my-4 form-textarea">
                        <textarea id="notes" className="form-control" placeholder="Enter note here..."></textarea>
                        <div className="d-flex justify-content-between mt-3">
                            <Link className="next-btn" to="/step3">Previous</Link>
                            <Link className="next-btn" to="/step5">Next</Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Step4PropertyAndMarket;