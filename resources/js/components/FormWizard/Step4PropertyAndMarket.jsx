import { useState } from "react";
import { Link } from "react-router-dom";

function Step4PropertyAndMarket() {
    // State for each property type (You and Spouse separately)
    const [primaryResidence, setPrimaryResidence] = useState({
        you: { address: '', value: '' },
        spouse: { address: '', value: '' }
    });

    const [rentalProperties, setRentalProperties] = useState({
        you: [{ address: '', value: '' }],
        spouse: [{ address: '', value: '' }]
    });

    const [vacationProperties, setVacationProperties] = useState({
        you: [{ address: '', value: '' }],
        spouse: [{ address: '', value: '' }]
    });

    // Generic handler for adding properties
    const addProperty = (propertyType, person) => {
        if (propertyType === 'rental') {
            setRentalProperties(prev => ({
                ...prev,
                [person]: [...prev[person], { address: '', value: '' }]
            }));
        } else if (propertyType === 'vacation') {
            setVacationProperties(prev => ({
                ...prev,
                [person]: [...prev[person], { address: '', value: '' }]
            }));
        }
    };

    // Generic change handler
    const handlePropertyChange = (propertyType, person, index, field, value) => {
        if (propertyType === 'primary') {
            setPrimaryResidence(prev => ({
                ...prev,
                [person]: { ...prev[person], [field]: value }
            }));
        } else if (propertyType === 'rental') {
            setRentalProperties(prev => {
                const newProperties = [...prev[person]];
                newProperties[index][field] = value;
                return { ...prev, [person]: newProperties };
            });
        } else if (propertyType === 'vacation') {
            setVacationProperties(prev => {
                const newProperties = [...prev[person]];
                newProperties[index][field] = value;
                return { ...prev, [person]: newProperties };
            });
        }
    };

    const removeProperty = (propertyType, person, index) => {
        if (propertyType === 'rental') {
            setRentalProperties(prev => {
                const updated = [...prev[person]];
                updated.splice(index, 1);
                return { ...prev, [person]: updated };
            });
        } else if (propertyType === 'vacation') {
            setVacationProperties(prev => {
                const updated = [...prev[person]];
                updated.splice(index, 1);
                return { ...prev, [person]: updated };
            });
        }
    };

    // Render property inputs (reusable function)
    const renderPropertyInputs = (properties, propertyType, person) => {
        return properties.map((property, index) => (
            <div key={`${propertyType}-${person}-${index}`} className={`property-group  ${index > 0 ? 'position-relative mb-3 p-3 border rounded' : ''}`}>
                {index > 0 && (
                    <button
                        type="button"
                        onClick={() => removeProperty(propertyType, person, index)}
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                        style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                        aria-label="Remove property"
                    >
                        ×
                    </button>
                )}
                <label className="form-label responsive-label">
                    Property Address
                </label>
                <input
                    id={`${propertyType}-${person}-address-${index}`}
                    type="text"
                    className="form-control"
                    value={property.address}
                    onChange={(e) => handlePropertyChange(propertyType, person, index, 'address', e.target.value)}
                    placeholder={`Enter Address ${index + 1}`}
                />
                <label className="form-label responsive-label">
                    Estimated Value
                </label>
                <input
                    id={`${propertyType}-${person}-value-${index}`}
                    type="text"
                    className="form-control"
                    value={property.value}
                    onChange={(e) => handlePropertyChange(propertyType, person, index, 'value', e.target.value)}
                    placeholder="Enter Value"
                />
            </div>
        ));
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
                                    <label className="form-label responsive-label">
                                        Primary Residence
                                    </label>
                                    <input
                                        id="primary-you-address"
                                        type="text"
                                        className="form-control"
                                        value={primaryResidence.you.address}
                                        onChange={(e) => handlePropertyChange('primary', 'you', 0, 'address', e.target.value)}
                                        placeholder="Enter Address"
                                    />
                                    <label className="form-label responsive-label">
                                        Estimated Value
                                    </label>
                                    <input
                                        id="primary-you-value"
                                        type="text"
                                        className="form-control"
                                        value={primaryResidence.you.value}
                                        onChange={(e) => handlePropertyChange('primary', 'you', 0, 'value', e.target.value)}
                                        placeholder="Enter Value"
                                    />
                                </div>
                            </div>

                            {/* Spouse */}
                            <div className="col-md-6">
                                <div className="personal-detail-input">
                                    <h2>Spouse</h2>
                                    <label className="form-label responsive-label">
                                        Primary Residence
                                    </label>
                                    <input
                                        id="primary-spouse-address"
                                        type="text"
                                        className="form-control"
                                        value={primaryResidence.spouse.address}
                                        onChange={(e) => handlePropertyChange('primary', 'spouse', 0, 'address', e.target.value)}
                                        placeholder="Enter Address"
                                    />
                                    <label className="form-label responsive-label">
                                        Estimated Value
                                    </label>
                                    <input
                                        id="primary-spouse-value"
                                        type="text"
                                        className="form-control"
                                        value={primaryResidence.spouse.value}
                                        onChange={(e) => handlePropertyChange('primary', 'spouse', 0, 'value', e.target.value)}
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
                                    {renderPropertyInputs(rentalProperties.you, 'rental', 'you')}
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
                                    {renderPropertyInputs(rentalProperties.spouse, 'rental', 'spouse')}
                                    <button
                                        type="button"
                                        onClick={() => addProperty('rental', 'spouse')}
                                        className="rental-property-btn"
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
                                    {renderPropertyInputs(vacationProperties.you, 'vacation', 'you')}
                                    <button
                                        type="button"
                                        onClick={() => addProperty('vacation', 'you')}
                                        className="vacation-property-btn"
                                    >
                                        Add Another Vacation Property
                                    </button>
                                </div>
                            </div>

                            {/* Spouse */}
                            <div className="col-md-6">
                                <div className="personal-detail-input">
                                    <h2>Spouse</h2>
                                    {renderPropertyInputs(vacationProperties.spouse, 'vacation', 'spouse')}
                                    <button
                                        type="button"
                                        onClick={() => addProperty('vacation', 'spouse')}
                                        className="vacation-property-btn"
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