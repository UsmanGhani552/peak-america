import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getApiInstance } from "../../src/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Toaster from "../Layout/Toaster";
import useStepRedirect from "../../src/hooks/useStepRedirect";
import LoadingSpinner from "../LoadingSpinner";

function Step4PropertyAndMarket() {
    const navigate = useNavigate();
    useStepRedirect('4');
    const [isSubmitting, setIsSubmitting] = useState(false);
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
    const handleFormData = () => {
        const youProperties = [
            {
                type: 'primary',
                address: primaryResidence.you.address,
                value: Number(primaryResidence.you.value) || 0
            },
            ...rentalProperties.you.map(p => ({
                type: 'rental',
                address: p.address,
                value: Number(p.value) || 0
            })),
            ...vacationProperties.you.map(p => ({
                type: 'vacation',
                address: p.address,
                value: Number(p.value) || 0
            }))
        ];

        const spouseProperties = [
            {
                type: 'primary',
                address: primaryResidence.spouse.address,
                value: Number(primaryResidence.spouse.value) || 0
            },
            ...rentalProperties.spouse.map(p => ({
                type: 'rental',
                address: p.address,
                value: Number(p.value) || 0
            })),
            ...vacationProperties.spouse.map(p => ({
                type: 'vacation',
                address: p.address,
                value: Number(p.value) || 0
            }))
        ];

        const newFormData = {
            step: 4,
            person: [
                {
                    is_spouse: false,
                    properties: youProperties
                },
                {
                    is_spouse: true,
                    properties: spouseProperties
                }
            ],
            note: ''
        };

        setFormData(newFormData);
    };
    useEffect(() => {
        handleFormData();
    }, [primaryResidence, rentalProperties, vacationProperties]);
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


    const [formData, setFormData] = useState({
        step: 4,
        person: [
            {
                is_spouse: false,
                properties: [
                    {
                        type: 'primary',
                        address: '',
                        value: 0
                    },
                    {
                        type: 'rental',
                        address: '',
                        value: 0
                    },
                    {
                        type: 'vacation',
                        address: '',
                        value: 0
                    }
                ]
            },
            {
                is_spouse: true,
                properties: [
                    {
                        type: 'primary',
                        address: '',
                        value: 0
                    }
                ]
            }
        ],
        note: ''
    });
    console.log('Initial Form Data:', formData);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
            const api = await getApiInstance();
            await api.post('submit-form', formData)
                .then(response => {
                    console.log("Form submitted successfully:", response.data);
                    toast.success("Success! Your details have been saved.");
                    localStorage.setItem('currentStep', '5');
                    setTimeout(() => {
                        setIsSubmitting(false);
                        navigate('/step5');
                    }, 1500);
                })
                .catch(error => {
                    setIsSubmitting(false);
                    if (error.response && error.response.data) {
                        const errorData = error.response.data.data.error;
                        // Process each error and show in toast
                        Object.entries(errorData).forEach(([key, messages]) => {
                            // Show each error message in a toast
                            toast.error(`${messages}`);
    
                        });
                    } else {
                        toast.error("An unknown error occurred. Please try again.");
                        console.error("Unknown error:", error);
                    }
                });
        }

    // console.log( rentalProperties);
    console.log('Form Data:', formData);

    return (
        <>
        <LoadingSpinner show={isSubmitting} />
        <Toaster/>
        <div className="container-fluid personal-detail-container">
            <form onSubmit={handleSubmit} className="container-fluid">
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
                        <textarea id="notes" className="form-control" placeholder="Enter note here..." onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}></textarea>
                        <div className="d-flex justify-content-between mt-3">
                            <Link className="next-btn" to="/step3">Previous</Link>
                            <button className="next-btn" type="submit">Next</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        </>
    );
}

export default Step4PropertyAndMarket;