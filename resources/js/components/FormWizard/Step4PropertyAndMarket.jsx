import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { generateGuestId, getApiInstance } from "../../src/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Toaster from "../Layout/Toaster";
import LoadingSpinner from "../LoadingSpinner";
import { useStepContext } from "../../src/hooks/StepContext";

function Step4PropertyAndMarket() {
    const navigate = useNavigate();
    const note = localStorage.getItem('note');
    console.log(note)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const isSingleStatus = localStorage.getItem('spouseStatus') === 'true';
    const { markStepCompleted } = useStepContext();
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

    const [notes, setNotes] = useState(note);

    // Load saved data from API
    const loadStep4DataFromApi = async () => {
        const api = await getApiInstance();
        try {
            const response = await api.post('get-form', { step: 4 });
            const { note, multi_step_form4 } = response.data.data;

            // Initialize empty states
            const newPrimaryResidence = { you: { address: '', value: '' }, spouse: { address: '', value: '' } };
            const newRentalProperties = { you: [], spouse: [] };
            const newVacationProperties = { you: [], spouse: [] };
            const isSingleStatus = localStorage.getItem('spouseStatus');
            multi_step_form4.forEach((personData) => {
                const isSpouse = personData.is_spouse;
                const target = isSpouse ? 'spouse' : 'you';

                personData.property.forEach((property) => {
                    console.log(property);
                    const propertyData = {
                        address: property.address || '',
                        value: property.value || '0.00' // Ensure we have a string value
                    };

                    if (property.type === 'primary') {
                        newPrimaryResidence[target] = propertyData;
                    } else if (property.type === 'rental') {
                        newRentalProperties[target].push(propertyData);
                    } else if (property.type === 'vacation') {
                        newVacationProperties[target].push(propertyData);
                    }
                });
            });

            // Update all states at once to minimize re-renders
            setPrimaryResidence(newPrimaryResidence);
            setRentalProperties(newRentalProperties);
            setVacationProperties(newVacationProperties);
            setNotes(note || '');

        } catch (error) {
            console.error("Error loading step 4 data:", error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        loadStep4DataFromApi();
    }, []);

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
            note: notes
        };

        setFormData(newFormData);
    };

    useEffect(() => {
        handleFormData();
    }, [primaryResidence, rentalProperties, vacationProperties, notes]);

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
            <div key={`${propertyType}-${person}-${index}`} className={`property-group  ${index > 0 || propertyType !== 'primary' ? 'position-relative mb-3 p-3 border rounded' : ''}`}>
                {(index > 0 || propertyType !== 'primary') && (
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
                properties: []
            },
            {
                is_spouse: true,
                properties: []
            }
        ],
        note: note
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const api = await getApiInstance();
        await api.post('submit-form', formData)
            .then(response => {
                console.log("Form submitted successfully:", response.data);
                toast.success("Success! Your details have been saved.");
                localStorage.setItem('currentStep', '');
                localStorage.setItem('note',formData.note)
                markStepCompleted(4);
                setTimeout(() => {
                    setIsSubmitting(false);
                    navigate('/step5');
                }, 1500);
            })
            .catch(async error => {
                if (error.response.data.message == 'Guest UUID header is invalid.') {
                    await generateGuestId();
                    navigate('/step1');
                }
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

    if (isLoading) {
        return <LoadingSpinner show={true} />;
    }

    return (
        <>
            <LoadingSpinner show={isSubmitting} />
            <Toaster />
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
                                        {renderPropertyInputs([primaryResidence.you], 'primary', 'you')}
                                    </div>
                                </div>

                                {/* Spouse */}
                                <div className={`col-md-6 ${isSingleStatus ? 'disabled-section' : ''}`}>
                                    <div className="personal-detail-input">
                                        <h2>Spouse</h2>
                                        {renderPropertyInputs([primaryResidence.spouse], 'primary', 'spouse')}
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
                                <div className={`col-md-6 ${isSingleStatus ? 'disabled-section' : ''}`}>
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
                                <div className={`col-md-6 ${isSingleStatus ? 'disabled-section' : ''}`}>
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
                            <textarea
                                id="notes"
                                className="form-control"
                                placeholder="Enter note here..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
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