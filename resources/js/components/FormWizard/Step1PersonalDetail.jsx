import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateGuestId, getApiInstance } from "../../src/api";
import { toast } from 'react-toastify';
import Toaster from "../Layout/Toaster";
import LoadingSpinner from "../LoadingSpinner";
import { useStepContext } from "../../src/hooks/StepContext";

function Step1PersonalDetail() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [inputYou, setYouValue] = useState("");
    const [inputSpouse, setSpouseValue] = useState("");
    const { markStepCompleted } = useStepContext();
    const initialFormData = {
        step: '1',
        note: '',
        person: [
            {
                is_spouse: false,
                first_name: '',
                last_name: '',
                email: '',
                age: '',
                cell_phone: '',
                marital_status: '',
                kids: "",
                kids_age: [],
            },
            {
                is_spouse: true,
                first_name: '',
                last_name: '',
                email: '',
                age: '',
                cell_phone: '',
                marital_status: '',
                kids: "",
                kids_age: [],
            }
        ]
    };
    const [formData, setFormData] = useState(initialFormData);
    const isKid = formData.person[0].kids > 0 || formData.person[1].kids > 0;
    const isSingleStatus = formData.person[0].marital_status === 'single';
    console.log('spouse status',isSingleStatus);
    // Fetch saved data on component mount
    useEffect(() => {
        const fetchSavedData = async () => {
            try {
                const api = await getApiInstance();
                const response = await api.post('get-form', { step: '1' });

                if (response.data && response.data.data) {
                    const savedData = response.data.data;
                    const youData = savedData.multi_step_form1.find(p => !p.is_spouse);
                    const spouseData = savedData.multi_step_form1.find(p => p.is_spouse);

                    // Get kids counts from the length of kids arrays
                    const youKids = youData?.kids?.length || "";
                    const spouseKids = spouseData?.kids?.length || "";

                    setYouValue(youKids.toString());
                    setSpouseValue(spouseKids.toString());

                    // Extract kids ages
                    const youKidsAges = youData?.kids?.map(kid => kid.age.toString()) || [];
                    const spouseKidsAges = spouseData?.kids?.map(kid => kid.age.toString()) || [];

                    setFormData({
                        step: savedData.step?.toString() || '1',
                        note: savedData.note || '',
                        person: [
                            {
                                ...initialFormData.person[0],
                                first_name: youData?.first_name || '',
                                last_name: youData?.last_name || '',
                                email: youData?.email || '',
                                age: youData?.age ? new Date(youData.age).toISOString().split('T')[0] : '',
                                cell_phone: youData?.cell_phone || '',
                                marital_status: youData?.marital_status || '',
                                kids: youKids.toString(),
                                kids_age: youKidsAges
                            },
                            {
                                ...initialFormData.person[1],
                                first_name: spouseData?.first_name || '',
                                last_name: spouseData?.last_name || '',
                                email: spouseData?.email || '',
                                age: spouseData?.age ? new Date(spouseData.age).toISOString().split('T')[0] : '',
                                cell_phone: spouseData?.cell_phone || '',
                                marital_status: spouseData?.marital_status || '',
                                kids: spouseKids.toString(),
                                kids_age: spouseKidsAges
                            }
                        ]
                    });
                }
            } catch (error) {
                console.error("Error loading saved data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSavedData();
    }, []);

    const handleYouChange = (event) => {
        const value = event.target.value;
        setYouValue(value);
        setFormData(prev => ({
            ...prev,
            person: prev.person.map((p, index) =>
                index === 0 ? {
                    ...p,
                    kids: value,
                    kids_age: Array.from({ length: value }, (_, i) => p.kids_age[i] || "")
                } : p
            )
        }));
    };

    const handleSpouseChange = (event) => {
        const value = event.target.value;
        setSpouseValue(value);
        setFormData(prev => ({
            ...prev,
            person: prev.person.map((p, index) =>
                index === 1 ? {
                    ...p,
                    kids: value,
                    kids_age: Array.from({ length: value }, (_, i) => p.kids_age[i] || "")
                } : p
            )
        }));
    };

    const handleKidAgeChange = (personIndex, kidIndex, value) => {
        setFormData(prev => {
            const updatedPerson = [...prev.person];
            const updatedKidsAge = [...updatedPerson[personIndex].kids_age];
            updatedKidsAge[kidIndex] = value;
            updatedPerson[personIndex] = {
                ...updatedPerson[personIndex],
                kids_age: updatedKidsAge
            };
            return {
                ...prev,
                person: updatedPerson
            };
        });
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setYouValue("");
        setSpouseValue("");
        toast.info("Form reset successfully!");
    };
    const cleanedPayload = {
        ...formData,
        person: formData.person.filter(p => p.marital_status !== null && p.marital_status !== "")
    };
    console.log(cleanedPayload);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const api = await getApiInstance();
            await api.post('submit-form', cleanedPayload);
            toast.success("Data saved successfully!");
            markStepCompleted(1);
            localStorage.setItem('spouseStatus', isSingleStatus);
            localStorage.setItem('note',formData.note)
            setTimeout(() => {
                setIsSubmitting(false);
                navigate('/step2');
            }, 1500);
        } catch (error) {
            if (error.response.data.message == 'Guest UUID header is invalid.') {
                await generateGuestId();
                handleSubmit(e);
            }
            setIsSubmitting(false);
            if (error.response?.data?.data?.error) {
                const errorData = error.response.data.data.error;
                Object.entries(errorData).forEach(([key, messages]) => {
                    const parts = key.split('.');
                    if (parts[0] === 'person' && parts.length >= 3) {
                        const personIndex = parseInt(parts[1]);
                        const field = parts[2];
                        const personName = personIndex === 0 ? 'You' : 'Spouse';
                        messages.forEach(message => {
                            toast.error(`${personName}'s ${field.replace('_', ' ')}: ${message}`);
                        });
                    } else {
                        messages.forEach(message => {
                            toast.error(message);
                        });
                    }
                });
            } else {
                toast.error("An error occurred. Please try again.");
                console.error("Submission error:", error);
            }
        }
    };

    if (isLoading) {
        return <LoadingSpinner show={true} />;
    }

    const youKidsArray = Array.from({ length: parseInt(inputYou) }, (_, i) => i);
    const spouseKidsArray = Array.from({ length: parseInt(inputSpouse) }, (_, i) => i);

    return (
        <>
            <LoadingSpinner show={isSubmitting} />
            <Toaster />
            <div className="personal-detail-container">
                <div className="row">
                    <div className="col personal-detail-header">
                        <h2>Help us learn a little more about you.</h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-2 d-flex flex-column personal-detail-label">
                            <label className="form-label">First Name</label>
                            <label className="form-label">Last Name</label>
                            <label className="form-label">Age</label>
                            <label className="form-label">Cell Phone</label>
                            <label className="form-label">Email</label>
                            <label className="form-label">Marital Status</label>
                            <label className="form-label">Kids</label>
                            {isKid && (
                                <label className="form-label">Kids Age</label>
                            )}
                        </div>
                        <div className="col-md-10">
                            <div className="row gx-4 personal-detail-input-container">
                                {/* You Section */}
                                <div className="col-md-6">
                                    <div className="personal-detail-input">
                                        <h2>You</h2>
                                        <label className="form-label responsive-label">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter First Name"
                                            value={formData.person[0].first_name}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                person: formData.person.map((p, index) =>
                                                    index === 0 ? { ...p, first_name: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Last Name"
                                            value={formData.person[0].last_name}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                person: formData.person.map((p, index) =>
                                                    index === 0 ? { ...p, last_name: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Age</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            placeholder="Age"
                                            value={formData.person[0].age}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                person: formData.person.map((p, index) =>
                                                    index === 0 ? { ...p, age: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Cell Phone</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="000-000-000"
                                            value={formData.person[0].cell_phone}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                person: formData.person.map((p, index) =>
                                                    index === 0 ? { ...p, cell_phone: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter Email Address"
                                            value={formData.person[0].email}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                person: formData.person.map((p, index) =>
                                                    index === 0 ? { ...p, email: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Marital Status</label>
                                        <select
                                            className="form-select"
                                            value={formData.person[0].marital_status}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                person: formData.person.map((p, index) =>
                                                    index === 0 ? { ...p, marital_status: e.target.value } : p
                                                )
                                            })}
                                        >
                                            <option value="">Select marital status</option>
                                            <option value="single">Single</option>
                                            <option value="married">Married</option>
                                        </select>

                                        <label className="form-label responsive-label">Kids</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={inputYou}
                                            onChange={handleYouChange}
                                            placeholder="Number of kids"
                                        />

                                        {youKidsArray.map((_, kidIndex) => (
                                            <div key={`you-kid-${kidIndex}`}>
                                                <label className="form-label responsive-label">Kid {kidIndex + 1} Age</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={formData.person[0].kids_age[kidIndex] || ""}
                                                    onChange={(e) => handleKidAgeChange(0, kidIndex, e.target.value)}
                                                    placeholder={`Enter age for kid ${kidIndex + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Spouse Section */}
                                <div className={`col-md-6 child-two ${isSingleStatus ? 'disabled-section' : ''}`}>
                                    <div className="personal-detail-input">
                                        <h2>Spouse</h2>
                                        <label className="form-label responsive-label">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter First Name"
                                            value={formData.person[1].first_name}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                person: formData.person.map((p, index) =>
                                                    index === 1 ? { ...p, first_name: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Last Name"
                                            value={formData.person[1].last_name}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                person: formData.person.map((p, index) =>
                                                    index === 1 ? { ...p, last_name: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Age</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            placeholder="Age"
                                            value={formData.person[1].age}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                person: formData.person.map((p, index) =>
                                                    index === 1 ? { ...p, age: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Cell Phone</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="000-000-000"
                                            value={formData.person[1].cell_phone}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                person: formData.person.map((p, index) =>
                                                    index === 1 ? { ...p, cell_phone: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter Email Address"
                                            value={formData.person[1].email}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                person: formData.person.map((p, index) =>
                                                    index === 1 ? { ...p, email: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Marital Status</label>
                                        <select
                                            className="form-select"
                                            value={formData.person[1].marital_status}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                person: formData.person.map((p, index) =>
                                                    index === 1 ? { ...p, marital_status: e.target.value } : p
                                                )
                                            })}
                                        >
                                            <option value="">Select marital status</option>
                                            <option value="single">Single</option>
                                            <option value="married">Married</option>
                                        </select>

                                        <label className="form-label responsive-label">Kids</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={inputSpouse}
                                            onChange={handleSpouseChange}
                                            placeholder="Number of kids"
                                        />

                                        {spouseKidsArray.map((_, kidIndex) => (
                                            <div key={`spouse-kid-${kidIndex}`}>
                                                <label className="form-label responsive-label">Kid {kidIndex + 1} Age</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={formData.person[1].kids_age[kidIndex] || ""}
                                                    onChange={(e) => handleKidAgeChange(1, kidIndex, e.target.value)}
                                                    placeholder={`Enter age for kid ${kidIndex + 1}`}
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
                            <textarea
                                className="form-control"
                                placeholder="Enter note here..."
                                value={formData.note}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    note: e.target.value
                                })}
                            />

                            <div className="text-end mt-3">
                                <button className="btn btn-secondary me-2" type="button" onClick={resetForm}>
                                    Reset
                                </button>
                                <button className="next-btn" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Next'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Step1PersonalDetail;
