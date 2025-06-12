import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "bootstrap/dist/js/bootstrap.bundle.min";
import { api } from "../../src/api";
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Toaster from "../Layout/Toaster";

function Step1PersonalDetail() {
    const navigate = useNavigate();
    const [inputYou, setYouValue] = useState("1");
    const [inputSpouse, setSpouseValue] = useState("1");
    const [formData, setFormData] = useState({
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
                kids: inputYou,
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
                kids: inputSpouse,
                kids_age: [],
            }
        ]
    });

    const handleYouChange = (event) => {
        const value = parseInt(event.target.value);
        setYouValue(value);
        setFormData(prev => {
            const updatedPerson = prev.person.map((p, index) => {
                if (index === 0) {
                    return {
                        ...p,
                        kids: value,
                        kids_age: Array.from({ length: value }, (_, i) => p.kids_age[i] || "")
                    };
                }
                return p;
            });
            return {
                ...prev,
                person: updatedPerson
            };
        });
    };

    const handleSpouseChange = (event) => {
        const value = parseInt(event.target.value);
        setSpouseValue(value);
        setFormData(prev => {
            const updatedPerson = prev.person.map((p, index) => {
                if (index === 1) {
                    return {
                        ...p,
                        kids: value,
                        kids_age: Array.from({ length: value }, (_, i) => p.kids_age[i] || "")
                    };
                }
                return p;
            });
            return {
                ...prev,
                person: updatedPerson
            };
        });
    };

    let youValue = [];
    for (let i = 0; i < inputYou; i++) {
        youValue.push(i);
    }

    let spouseValue = [];
    for (let i = 0; i < inputSpouse; i++) {
        spouseValue.push(i);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        api.post('submit-form', formData)
            .then(response => {
                console.log("Form submitted successfully:", response.data);
                toast.success("Success! Your details have been saved.");
                setTimeout(() => {
                    navigate('/step2'); // Replace with your actual next step route
                }, 1500);
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    const errorData = error.response.data.data.error;
                    console.log(errorData);
                    // Process each error and show in toast
                    Object.entries(errorData).forEach(([key, messages]) => {
                        const parts = key.split('.');
                        if (parts[0] === 'person' && parts.length >= 3) {
                            const personIndex = parseInt(parts[1]);
                            const field = parts[2];
                            const personName = personIndex === 0 ? 'You' : 'Spouse';
                            const mainMessage = messages[0].split('.');
                            // Show each error message in a toast
                            console.log(messages);
                            messages.forEach(message => {
                                toast.error(`${personName}'s ${field.replace('_', ' ')}: ${message}`);
                            });
                        } else {
                            // For non-person related errors
                            messages.forEach(message => {
                                toast.error(message);
                            });
                        }
                    });
                } else {
                    toast.error("An unknown error occurred. Please try again.");
                    console.error("Unknown error:", error);
                }
            });
    }

    return (
        <>
           <Toaster/>

            <div className="personal-detail-container">
                <div className="row">
                    <div className="col personal-detail-header">
                        <h2>Help us learn a little more about you.</h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
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
                                        <input type="text"
                                            className="form-control"
                                            placeholder="Enter First Name"
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                person: formData.person.map((p, index) =>
                                                    index === 0 ? { ...p, first_name: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Last Name</label>
                                        <input type="text" className="form-control" placeholder="Enter Last Name"
                                            onChange={(e) => setFormData({
                                                ...formData, person: formData.person.map((p, index) =>
                                                    index === 0 ? { ...p, last_name: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Age</label>
                                        <input type="date" className="form-control" placeholder="Age"
                                            onChange={(e) => setFormData({
                                                ...formData, person: formData.person.map((p, index) =>
                                                    index === 0 ? { ...p, age: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Cell Phone</label>
                                        <input type="number" className="form-control" placeholder="000-000-000"
                                            onChange={(e) => setFormData({
                                                ...formData, person: formData.person.map((p, index) =>
                                                    index === 0 ? { ...p, cell_phone: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Email</label>
                                        <input type="text" className="form-control" placeholder="Enter Email Address"
                                            onChange={(e) => setFormData({
                                                ...formData, person: formData.person.map((p, index) =>
                                                    index === 0 ? { ...p, email: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Marital Status</label>
                                        <select name="" id="" className="form-select" placeholder="Select Marital Status"
                                            onChange={(e) => {
                                                const selected = e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    person: formData.person.map((p, index) =>
                                                        index === 0 ? { ...p, marital_status: selected } : p
                                                    )
                                                })
                                            }}>
                                            <option>Select marital status</option>
                                            <option value="single">Single</option>
                                            <option value="married">Married</option>
                                        </select>

                                        <label className="form-label responsive-label">Kids</label>
                                        <input type="number" className="form-control" onChange={handleYouChange} placeholder="Select Kids" />

                                        {youValue.map((_, kidIndex) => (
                                            <div key={kidIndex}>
                                                <label className="form-label responsive-label">Kids {kidIndex + 1} Age</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={formData.person[0].kids_age[kidIndex] || ""}
                                                    onChange={(e) => {
                                                        const updatedPerson = formData.person.map((p, personIndex) => {
                                                            if (personIndex === 0) {
                                                                const updatedKidsAge = [...p.kids_age];
                                                                updatedKidsAge[kidIndex] = e.target.value;
                                                                return {
                                                                    ...p,
                                                                    kids_age: updatedKidsAge
                                                                };
                                                            }
                                                            return p;
                                                        })
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            person: updatedPerson
                                                        }))
                                                    }}
                                                    placeholder={`Select Kids ${kidIndex + 1} Age`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-md-6 child-two">
                                    <div className="personal-detail-input">
                                        <h2>Spouse</h2>
                                        <label className="form-label responsive-label">First Name</label>
                                        <input type="text"
                                            className="form-control"
                                            placeholder="Enter First Name"
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                person: formData.person.map((p, index) =>
                                                    index === 1 ? { ...p, first_name: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Last Name</label>
                                        <input type="text" className="form-control" placeholder="Enter Last Name"
                                            onChange={(e) => setFormData({
                                                ...formData, person: formData.person.map((p, index) =>
                                                    index === 1 ? { ...p, last_name: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Age</label>
                                        <input type="date" className="form-control" placeholder="Age"
                                            onChange={(e) => setFormData({
                                                ...formData, person: formData.person.map((p, index) =>
                                                    index === 1 ? { ...p, age: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Cell Phone</label>
                                        <input type="number" className="form-control" placeholder="000-000-000"
                                            onChange={(e) => setFormData({
                                                ...formData, person: formData.person.map((p, index) =>
                                                    index === 1 ? { ...p, cell_phone: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Email</label>
                                        <input type="text" className="form-control" placeholder="Enter Email Address"
                                            onChange={(e) => setFormData({
                                                ...formData, person: formData.person.map((p, index) =>
                                                    index === 1 ? { ...p, email: e.target.value } : p
                                                )
                                            })}
                                        />

                                        <label className="form-label responsive-label">Marital Status</label>
                                        <select name="" id="" className="form-select" placeholder="Select Marital Status"
                                            onChange={(e) => {
                                                const selected = e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    person: formData.person.map((p, index) =>
                                                        index === 1 ? { ...p, marital_status: selected } : p
                                                    )
                                                })
                                            }}>
                                            <option>Select marital status</option>
                                            <option value="single">Single</option>
                                            <option value="married">Married</option>
                                        </select>

                                        <label className="form-label responsive-label">Kids</label>
                                        <input type="number" className="form-control" onChange={handleSpouseChange} placeholder="Select Kids" />

                                        {spouseValue.map((_, kidIndex) => (
                                            <div key={kidIndex}>
                                                <label className="form-label responsive-label">Kids {kidIndex + 1} Age</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={formData.person[1].kids_age[kidIndex] || ""}
                                                    onChange={(e) => {
                                                        const updatedPerson = formData.person.map((p, personIndex) => {
                                                            if (personIndex === 1) {
                                                                const updatedKidsAge = [...p.kids_age];
                                                                updatedKidsAge[kidIndex] = e.target.value;
                                                                return {
                                                                    ...p,
                                                                    kids_age: updatedKidsAge
                                                                };
                                                            }
                                                            return p;
                                                        })
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            person: updatedPerson
                                                        }))
                                                    }}
                                                    placeholder={`Select Kids ${kidIndex + 1} Age`}
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
                                value={formData.notes}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    notes: e.target.value
                                })}
                            />

                            <div className="text-end mt-3">
                                <button className="next-btn" type="submit">Next</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Step1PersonalDetail;