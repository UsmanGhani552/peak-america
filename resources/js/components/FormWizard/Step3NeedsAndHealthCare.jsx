import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getApiInstance, getApiInstance_formData } from "../../src/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Toaster from "../Layout/Toaster";
import useStepRedirect from "../../src/hooks/useStepRedirect";
import axios from 'axios';
import LoadingSpinner from "../LoadingSpinner";

function Step3NeedsAndhealthCare() {
    // Initialize all state with proper structure
    const navigate = useNavigate();
    useStepRedirect('3');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState();
    const [needs, setNeeds] = useState({
        you: [{ description: '', amount: 0 }],
        spouse: [{ description: '', amount: 0 }],
        youTotal: 0,
        youAnnual: 0,
        spouseTotal: 0,
        spouseAnnual: 0
    });

    const [wants, setWants] = useState({
        you: [{ description: '', amount: 0 }],
        spouse: [{ description: '', amount: 0 }],
        youTotal: 0,
        youAnnual: 0,
        spouseTotal: 0,
        spouseAnnual: 0
    });

    const [liabilities, setLiabilities] = useState({
        you: [{ description: '', amount: 0 }],
        spouse: [{ description: '', amount: 0 }],
        youTotal: 0,
        youAnnual: 0,
        spouseTotal: 0,
        spouseAnnual: 0
    });

    const [largeExpense, setLargeExpense] = useState({
        you: [{ description: '', amount: 0 }],
        spouse: [{ description: '', amount: 0 }]
    });

    const [documents, setDocuments] = useState([]);
    const [notes, setNotes] = useState('');

    // Calculate totals whenever the amounts change
    useEffect(() => {
        calculateTotals('needs');
        calculateTotals('wants');
        calculateTotals('liabilities');
    }, [needs.you, needs.spouse, wants.you, wants.spouse, liabilities.you, liabilities.spouse, documents]);

    // Function to calculate totals for a given section
    const calculateTotals = (section) => {
        let state, setState;

        switch (section) {
            case 'needs':
                state = needs;
                setState = setNeeds;
                break;
            case 'wants':
                state = wants;
                setState = setWants;
                break;
            case 'liabilities':
                state = liabilities;
                setState = setLiabilities;
                break;
            default:
                return;
        }

        // Calculate totals for "you"
        const youTotal = state.you.reduce((sum, item) => {
            const amount = parseFloat(item.amount) || 0;
            return sum + amount;
        }, 0).toFixed(2);


        // Calculate totals for "spouse"
        const spouseTotal = state.spouse.reduce((sum, item) => {
            const amount = parseFloat(item.amount) || 0;
            return sum + amount;
        }, 0).toFixed(2);

        // Update the state with new totals
        setState(prev => ({
            ...prev,
            youTotal,
            spouseTotal,
        }));
    };

    // Generic function to add inputs
    const addInputs = (person, type) => {
        const newItem = { description: '', amount: '' };

        if (type === 'needs') {
            setNeeds(prev => ({
                ...prev,
                [person]: [...prev[person], newItem]
            }));
        } else if (type === 'wants') {
            setWants(prev => ({
                ...prev,
                [person]: [...prev[person], newItem]
            }));
        } else if (type === 'liabilities') {
            setLiabilities(prev => ({
                ...prev,
                [person]: [...prev[person], newItem]
            }));
        } else if (type === 'largeExpense') {
            setLargeExpense(prev => ({
                ...prev,
                [person]: [...prev[person], newItem]
            }));
        }
    };

    // Generic function to remove inputs
    const removeInputs = (person, index, type) => {
        if (type === 'needs') {
            setNeeds(prev => ({
                ...prev,
                [person]: prev[person].filter((_, i) => i !== index)
            }));
        } else if (type === 'wants') {
            setWants(prev => ({
                ...prev,
                [person]: prev[person].filter((_, i) => i !== index)
            }));
        } else if (type === 'liabilities') {
            setLiabilities(prev => ({
                ...prev,
                [person]: prev[person].filter((_, i) => i !== index)
            }));
        } else if (type === 'largeExpense') {
            setLargeExpense(prev => ({
                ...prev,
                [person]: prev[person].filter((_, i) => i !== index)
            }));
        }
    };

    // Handle changes for all input types
    const handleChange = (type, person, index, field, value) => {
        switch (type) {
            case 'needs':
                setNeeds(prev => ({
                    ...prev,
                    [person]: prev[person].map((item, i) =>
                        i === index ? { ...item, [field]: value } : item
                    )
                }));
                break;

            case 'wants':
                setWants(prev => ({
                    ...prev,
                    [person]: prev[person].map((item, i) =>
                        i === index ? { ...item, [field]: value } : item
                    )
                }));
                break;

            case 'liabilities':
                setLiabilities(prev => ({
                    ...prev,
                    [person]: prev[person].map((item, i) =>
                        i === index ? { ...item, [field]: value } : item
                    )
                }));
                break;

            case 'largeExpense':
                setLargeExpense(prev => ({
                    ...prev,
                    [person]: prev[person].map((item, i) =>
                        i === index ? { ...item, [field]: value } : item
                    )
                }));
                break;

            case 'needsAnnual':
                setNeeds(prev => ({ ...prev, [`${person}Annual`]: value }));
                break;

            case 'wantsAnnual':
                setWants(prev => ({ ...prev, [`${person}Annual`]: value }));
                break;

            case 'liabilitiesAnnual':
                setLiabilities(prev => ({ ...prev, [`${person}Annual`]: value }));
                break;

            default:
                break;
        }
    };

    // Handle file upload
    const handleFileChange = (e) => {
        setDocuments(e.target.files);
    };
    const handleFormData = () => {
        const formatExpenses = (data, total, annual) => {
            return [
                {
                    label: `your_needs`,
                    total,
                    estimated_annual_amount: annual,
                    details: data.needs.map(item => ({
                        label: item.description,
                        amount: parseFloat(item.amount || 0)
                    }))
                },
                {
                    label: `your_wants`,
                    total: data.wantsTotal,
                    estimated_annual_amount: data.wantsAnnual,
                    details: data.wants.map(item => ({
                        label: item.description,
                        amount: parseFloat(item.amount || 0)
                    }))
                },
                {
                    label: `liabilities`,
                    total: data.liabilitiesTotal,
                    estimated_annual_amount: data.liabilitiesAnnual,
                    details: data.liabilities.map(item => ({
                        label: item.description,
                        amount: parseFloat(item.amount || 0)
                    }))
                },
                {
                    label: `large_expense`,
                    total: 0, // Optional: add total if needed
                    estimated_annual_amount: 0,
                    details: data.largeExpense.map(item => ({
                        label: item.description,
                        amount: parseFloat(item.amount || 0)
                    }))
                }
            ];
        };
        const jsonData = new FormData();
        const newFormData = {
            step: 3,
            person: [
                {
                    is_spouse: false,
                    expenses: formatExpenses({
                        needs: needs.you,
                        wants: wants.you,
                        liabilities: liabilities.you,
                        largeExpense: largeExpense.you,
                        wantsTotal: wants.youTotal,
                        wantsAnnual: wants.youAnnual,
                        liabilitiesTotal: liabilities.youTotal,
                        liabilitiesAnnual: liabilities.youAnnual
                    }, needs.youTotal, needs.youAnnual)
                },
                {
                    is_spouse: true,
                    expenses: formatExpenses({
                        needs: needs.spouse,
                        wants: wants.spouse,
                        liabilities: liabilities.spouse,
                        largeExpense: largeExpense.spouse,
                        wantsTotal: wants.spouseTotal,
                        wantsAnnual: wants.spouseAnnual,
                        liabilitiesTotal: liabilities.spouseTotal,
                        liabilitiesAnnual: liabilities.spouseAnnual
                    }, needs.spouseTotal, needs.spouseAnnual)
                }
            ],
            note: notes || '',
        };
        jsonData.append('data', JSON.stringify(newFormData));

        // Append each file individually
        if (documents) {
            for (let i = 0; i < documents.length; i++) {
                jsonData.append('documents[]', documents[i]);
            }
        }
        setFormData(jsonData);
    }
    useEffect(() => {
        handleFormData();
    }, [needs, wants, liabilities, largeExpense]);

    // Handle form submission (for API integration)
    const handleSubmit = async (e) => {
        e.preventDefault();
    setIsSubmitting(true);

        const formatExpenses = (data, total, annual) => {
            return [
                {
                    label: `your_needs`,
                    total,
                    estimated_annual_amount: annual,
                    details: data.needs
                    .filter(item => item.description)
                    .map(item => ({
                        label: item.description,
                        amount: parseFloat(item.amount || 0)
                    }))
                },
                {
                    label: `your_wants`,
                    total: data.wantsTotal,
                    estimated_annual_amount: data.wantsAnnual,
                    details: data.wants
                    .filter(item => item.description)
                    .map(item => ({
                        label: item.description,
                        amount: parseFloat(item.amount || 0)
                    }))
                },
                {
                    label: `liabilities`,
                    total: data.liabilitiesTotal,
                    estimated_annual_amount: data.liabilitiesAnnual,
                    details: data.liabilities
                    .filter(item => item.description)
                    .map(item => ({
                        label: item.description || "iiiuu8ugfvtg",
                        amount: parseFloat(item.amount || 0)
                    }))
                },
                {
                    label: `large_expense`,
                    total: 0,
                    estimated_annual_amount: 0,
                    details: data.largeExpense
                    .filter(item => item.description)
                    .map(item => ({
                        label: item.description,
                        amount: parseFloat(item.amount || 0)
                    }))
                }
            ];
        };

        const jsonData = {
            step: 3,
            person: [
                {
                    is_spouse: false,
                    expenses: formatExpenses({
                        needs: needs.you,
                        wants: wants.you,
                        liabilities: liabilities.you,
                        largeExpense: largeExpense.you,
                        wantsTotal: wants.youTotal,
                        wantsAnnual: wants.youAnnual,
                        liabilitiesTotal: liabilities.youTotal,
                        liabilitiesAnnual: liabilities.youAnnual
                    }, needs.youTotal, needs.youAnnual)
                },
                {
                    is_spouse: true,
                    expenses: formatExpenses({
                        needs: needs.spouse,
                        wants: wants.spouse,
                        liabilities: liabilities.spouse,
                        largeExpense: largeExpense.spouse,
                        wantsTotal: wants.spouseTotal,
                        wantsAnnual: wants.spouseAnnual,
                        liabilitiesTotal: liabilities.spouseTotal,
                        liabilitiesAnnual: liabilities.spouseAnnual
                    }, needs.spouseTotal, needs.spouseAnnual)
                }
            ],
            note: notes || ''
        };

        const buildFormData = (data) => {
            const formData = new FormData();

            // Step & Note
            formData.append('step', data.step);
            formData.append('note', data.note || '');

            // Loop through person array
            data.person.forEach((person, pIndex) => {
                formData.append(`person[${pIndex}][is_spouse]`, person.is_spouse ? 1 : 0);

                person.expenses.forEach((expense, eIndex) => {
                    formData.append(`person[${pIndex}][expenses][${eIndex}][label]`, expense.label);
                    formData.append(`person[${pIndex}][expenses][${eIndex}][total]`, expense.total);
                    formData.append(`person[${pIndex}][expenses][${eIndex}][estimated_annual_amount]`, expense.estimated_annual_amount);

                    expense.details.forEach((detail, dIndex) => {
                        formData.append(`person[${pIndex}][expenses][${eIndex}][details][${dIndex}][label]`, detail.label);
                        formData.append(`person[${pIndex}][expenses][${eIndex}][details][${dIndex}][amount]`, detail.amount);
                    });
                });
            });

            // 3. Append the actual files with metadata
            if (documents) {
                Array.from(documents).forEach((file, index) => {
                    console.log(file);
                    formData.append(`documents[]`, file);
                });
            }

            return formData;
        };
        async function getApiInstance_formData() {
            let guestId = localStorage.getItem('guestId');
            console.log('Retrieved Guest ID from localStorage:', guestId);
            if (!guestId) {
                guestId = await generateGuestId();
            }

            let apiInstance = axios.create({
                baseURL: '/api',
                headers: {
                    'X-Guest-UUID': guestId,
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
            });
            return apiInstance;
        }
        const api = await getApiInstance_formData();
        await api.post('submit-form', buildFormData(jsonData))
            .then(response => {
                console.log("Form submitted successfully:", response.data);
                toast.success("Success! Your details have been saved.");
                localStorage.setItem('currentStep', '4');
                setTimeout(() => {
                    setIsSubmitting(false);
                    navigate('/step4');
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

    const maxNeedsRows = Math.max(needs.you.length, needs.spouse.length);
    const maxWantsRows = Math.max(wants.you.length, wants.spouse.length);
    const maxLiabilitiesRows = Math.max(liabilities.you.length, liabilities.spouse.length);

    return (
        <>
        <LoadingSpinner show={isSubmitting} />
        <Toaster/>
        <div className="container-fluid personal-detail-container">
            <form className="container-fluid" onSubmit={handleSubmit} encType="multipart/formdata">
                {/* Your Needs Section */}
                <div className="row">
                    <div className="col personal-detail-header">
                        <h2>Your Needs (Non-Discretionary)</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 d-flex flex-column personal-detail-label expense-detail-label">
                        {Array.from({ length: maxNeedsRows }).map((_, index) => (
                            <div key={`labels-${index}`} className={`expense-label`}>
                                <label className="form-label">Estimated Monthly Expenses</label>
                                <label className="form-label">Enter Amount</label>
                            </div>
                        ))}
                        <label className="form-label">Total</label>
                        <label className="form-label">Estimated Annual Expenses</label>
                    </div>
                    <div className="col-md-10">
                        <div className="row gx-4 personal-detail-input-container">
                            {/* You Section */}
                            <div className="col-md-6">
                                <div className="personal-detail-input d-flex flex-column">
                                    <h2>You</h2>
                                    <div style={{ flex: 1 }}>
                                        {needs.you.map((expense, index) => (
                                            <div key={`you-${index}`} className={`position-relative p-3 ${index !== needs.you.length - 1 ? 'mb-3' : ''} border rounded`}>
                                                <div className="buttons position-absolute top-0 end-0 m-1">
                                                    {index === needs.you.length - 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => addInputs('you', 'needs')}
                                                            className="btn btn-sm btn-danger"
                                                            style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                            aria-label="Add expense"
                                                        >+</button>
                                                    )}
                                                    {needs.you.length > 1 && (
                                                        <>
                                                            <span>  </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeInputs('you', index, 'needs')}
                                                                className="btn btn-sm btn-danger"
                                                                style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                aria-label="Remove expense"
                                                            >-</button>
                                                        </>
                                                    )}
                                                </div>
                                                <label className="form-label responsive-label">Estimated Monthly Expenses</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Expense"
                                                    value={expense.description}
                                                    onChange={(e) => handleChange('needs', 'you', index, 'description', e.target.value)}
                                                />
                                                <label className="form-label responsive-label">Enter Amount</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Enter Amount"
                                                    value={expense.amount}
                                                    onChange={(e) => handleChange('needs', 'you', index, 'amount', e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-auto">
                                        <label className="form-label responsive-label">Total</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="$00.00"
                                            value={needs.youTotal}
                                            readOnly
                                        />
                                        <div>
                                            <label className="form-label responsive-label">Estimated Annual Expenses</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Enter Annual Expense"
                                                onChange={(e) => setNeeds(prevNeeds => ({
                                                    ...prevNeeds,
                                                    youAnnual: e.target.value
                                                }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Spouse Section */}
                            <div className="col-md-6">
                                <div className="personal-detail-input d-flex flex-column">
                                    <h2>Spouse</h2>
                                    <div style={{ flex: 1 }}>
                                        {needs.spouse.map((expense, index) => (
                                            <div key={`spouse-${index}`} className="position-relative p-3 mb-3 border rounded">
                                                <div className="buttons position-absolute top-0 end-0 m-1">
                                                    {index === needs.spouse.length - 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => addInputs('spouse', 'needs')}
                                                            className="btn btn-sm btn-danger"
                                                            style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                            aria-label="Add expense"
                                                        >+</button>
                                                    )}
                                                    {needs.spouse.length > 1 && (
                                                        <>
                                                            <span> </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeInputs('spouse', index, 'needs')}
                                                                className="btn btn-sm btn-danger"
                                                                style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                aria-label="Remove expense"
                                                            >-</button>
                                                        </>
                                                    )}
                                                </div>
                                                <label className="form-label responsive-label">Estimated Monthly Expenses</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Expense"
                                                    value={expense.description}
                                                    onChange={(e) => handleChange('needs', 'spouse', index, 'description', e.target.value)}
                                                />
                                                <label className="form-label responsive-label">Enter Amount</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Enter Amount"
                                                    value={expense.amount}
                                                    onChange={(e) => handleChange('needs', 'spouse', index, 'amount', e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-top">
                                        <label className="form-label responsive-label">Total</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="$00.00"
                                            value={needs.spouseTotal}
                                            readOnly
                                        />
                                        <label className="form-label responsive-label">Estimated Annual Expenses</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter Annual Expense"
                                            onChange={(e) => setNeeds(prevNeeds => ({
                                                ...prevNeeds,
                                                spouseAnnual: e.target.value
                                            }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Your Wants Section */}
                <div className="row">
                    <div className="col personal-detail-header">
                        <h2>Your Wants (Discretionary)</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 d-flex flex-column personal-detail-label">
                        {Array.from({ length: maxWantsRows }).map((_, index) => (
                            <div key={`labels-${index}`} className={`expense-label`}>
                                <label className="form-label">Estimated Monthly Expenses</label>
                                <label className="form-label">Enter Amount</label>
                            </div>
                        ))}
                        <label className="form-label" htmlFor="">Total</label>
                        <label className="form-label" htmlFor="">Estimated Annual Expenses</label>
                    </div>
                    <div className="col-md-10">
                        <div className="row gx-4 personal-detail-input-container">
                            {/* You Section */}
                            <div className="col-md-6">
                                <div className="personal-detail-input d-flex flex-column">
                                    <h2>You</h2>
                                    <div style={{ flex: 1 }}>
                                        {wants.you.map((expense, index) => (
                                            <div key={`you-${index}`} className={`position-relative p-3 ${index !== wants.you.length - 1 ? 'mb-3' : ''} border rounded`}>
                                                <div className="buttons position-absolute top-0 end-0 m-1">
                                                    {index === wants.you.length - 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => addInputs('you', 'wants')}
                                                            className="btn btn-sm btn-danger"
                                                            style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                            aria-label="Add expense"
                                                        >+</button>
                                                    )}
                                                    {wants.you.length > 1 && (
                                                        <>
                                                            <span>  </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeInputs('you', index, 'wants')}
                                                                className="btn btn-sm btn-danger"
                                                                style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                aria-label="Remove expense"
                                                            >-</button>
                                                        </>
                                                    )}
                                                </div>
                                                <label className="form-label responsive-label">Estimated Monthly Expenses</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Expense"
                                                    value={expense.description}
                                                    onChange={(e) => handleChange('wants', 'you', index, 'description', e.target.value)}
                                                />
                                                <label className="form-label responsive-label">Enter Amount</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Enter Amount"
                                                    value={expense.amount}
                                                    onChange={(e) => handleChange('wants', 'you', index, 'amount', e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-auto">
                                        <label className="form-label responsive-label">Total</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="$00.00"
                                            value={wants.youTotal}
                                            readOnly
                                        />
                                        <div>
                                            <label className="form-label responsive-label">Estimated Annual Expenses</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Enter Annual Expense"
                                                onChange={(e) => setWants(prevWants => ({
                                                    ...prevWants,
                                                    youAnnual: e.target.value
                                                }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Spouse Section */}
                            <div className="col-md-6">
                                <div className="personal-detail-input d-flex flex-column">
                                    <h2>Spouse</h2>
                                    <div style={{ flex: 1 }}>
                                        {wants.spouse.map((expense, index) => (
                                            <div key={`spouse-${index}`} className="position-relative p-3 mb-3 border rounded">
                                                <div className="buttons position-absolute top-0 end-0 m-1">
                                                    {index === wants.spouse.length - 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => addInputs('spouse', 'wants')}
                                                            className="btn btn-sm btn-danger"
                                                            style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                            aria-label="Add expense"
                                                        >+</button>
                                                    )}
                                                    {wants.spouse.length > 1 && (
                                                        <>
                                                            <span> </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeInputs('spouse', index, 'wants')}
                                                                className="btn btn-sm btn-danger"
                                                                style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                aria-label="Remove expense"
                                                            >-</button>
                                                        </>
                                                    )}
                                                </div>
                                                <label className="form-label responsive-label">Estimated Monthly Expenses</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Expense"
                                                    value={expense.description}
                                                    onChange={(e) => handleChange('wants', 'spouse', index, 'description', e.target.value)}
                                                />
                                                <label className="form-label responsive-label">Enter Amount</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Enter Amount"
                                                    value={expense.amount}
                                                    onChange={(e) => handleChange('wants', 'spouse', index, 'amount', e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-top">
                                        <label className="form-label responsive-label">Total</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="$00.00"
                                            value={wants.spouseTotal}
                                            readOnly
                                        />
                                        <label className="form-label responsive-label">Estimated Annual Expenses</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter Annual Expense"
                                            onChange={(e) => setWants(prevWants => ({
                                                ...prevWants,
                                                spouseAnnual: e.target.value
                                            }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Liabilities Section */}
                <div className="row">
                    <div className="col personal-detail-header">
                        <h2>Liabilities</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 d-flex flex-column personal-detail-label expense-detail-label">
                        {Array.from({ length: maxLiabilitiesRows }).map((_, index) => (
                            <div key={`labels-${index}`} className={`expense-label`}>
                                <label className="form-label">Estimated Monthly Liabilities</label>
                                <label className="form-label">Enter Amount</label>
                            </div>
                        ))}
                        <label className="form-label">Total</label>
                        <label className="form-label">Estimated Annual Liabilities</label>
                    </div>
                    <div className="col-md-10">
                        <div className="row gx-4 personal-detail-input-container">
                            {/* You Section */}
                            <div className="col-md-6">
                                <div className="personal-detail-input d-flex flex-column">
                                    <h2>You</h2>
                                    <div style={{ flex: 1 }}>
                                        {liabilities.you.map((expense, index) => (
                                            <div key={`you-${index}`} className={`position-relative p-3 ${index !== liabilities.you.length - 1 ? 'mb-3' : ''} border rounded`}>
                                                <div className="buttons position-absolute top-0 end-0 m-1">
                                                    {index === liabilities.you.length - 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => addInputs('you', 'liabilities')}
                                                            className="btn btn-sm btn-danger"
                                                            style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                            aria-label="Add Liability"
                                                        >+</button>
                                                    )}
                                                    {liabilities.you.length > 1 && (
                                                        <>
                                                            <span>  </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeInputs('you', index, 'liabilities')}
                                                                className="btn btn-sm btn-danger"
                                                                style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                aria-label="Remove Liability"
                                                            >-</button>
                                                        </>
                                                    )}
                                                </div>
                                                <label className="form-label responsive-label">Estimated Monthly Liabilities</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Liability"
                                                    value={expense.description}
                                                    onChange={(e) => handleChange('liabilities', 'you', index, 'description', e.target.value)}
                                                />
                                                <label className="form-label responsive-label">Enter Amount</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Enter Amount"
                                                    value={expense.amount}
                                                    onChange={(e) => handleChange('liabilities', 'you', index, 'amount', e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-auto">
                                        <label className="form-label responsive-label">Total</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="$00.00"
                                            value={liabilities.youTotal}
                                            readOnly
                                        />
                                        <div>
                                            <label className="form-label responsive-label">Estimated Annual Expenses</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Enter Annual Liabilities"
                                                onChange={(e) => setLiabilities(prevLiabilities => ({
                                                    ...prevLiabilities,
                                                    youAnnual: e.target.value
                                                }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Spouse Section */}
                            <div className="col-md-6">
                                <div className="personal-detail-input d-flex flex-column">
                                    <h2>Spouse</h2>
                                    <div style={{ flex: 1 }}>
                                        {liabilities.spouse.map((expense, index) => (
                                            <div key={`spouse-${index}`} className="position-relative p-3 mb-3 border rounded">
                                                <div className="buttons position-absolute top-0 end-0 m-1">
                                                    {index === liabilities.spouse.length - 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => addInputs('spouse', 'liabilities')}
                                                            className="btn btn-sm btn-danger"
                                                            style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                            aria-label="Add Liability"
                                                        >+</button>
                                                    )}
                                                    {liabilities.spouse.length > 1 && (
                                                        <>
                                                            <span> </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeInputs('spouse', index, 'liabilities')}
                                                                className="btn btn-sm btn-danger"
                                                                style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                aria-label="Remove Liability"
                                                            >-</button>
                                                        </>
                                                    )}
                                                </div>
                                                <label className="form-label responsive-label">Estimated Monthly Liabilities</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Liability"
                                                    value={expense.description}
                                                    onChange={(e) => handleChange('liabilities', 'spouse', index, 'description', e.target.value)}
                                                />
                                                <label className="form-label responsive-label">Enter Amount</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Enter Amount"
                                                    value={expense.amount}
                                                    onChange={(e) => handleChange('liabilities', 'spouse', index, 'amount', e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-top">
                                        <label className="form-label responsive-label">Total</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="$00.00"
                                            value={liabilities.spouseTotal}
                                            readOnly
                                        />
                                        <label className="form-label responsive-label">Estimated Annual Expenses</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter Annual Liabilities"
                                            onChange={(e) => setLiabilities(prevLiabilities => ({
                                                ...prevLiabilities,
                                                spouseAnnual: e.target.value
                                            }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Large Expense Section */}
                <div className="row">
                    <div className="col personal-detail-header">
                        <h2>Large Expense Within The Next 12 Months</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 d-flex flex-column personal-detail-label">
                        <label className="form-label" htmlFor="">Expense Description</label>
                        <label className="form-label" htmlFor="">Estimated Amount</label>
                    </div>
                    <div className="col-md-10">
                        <div className="row gx-4 personal-detail-input-container">
                            {/* You Section */}
                            <div className="col-md-6">
                                <div className="personal-detail-input d-flex flex-column">
                                    <h2>You</h2>
                                    <div style={{ flex: 1 }}>
                                        {largeExpense.you.map((expense, index) => (
                                            <div key={`you-${index}`} className={`position-relative p-3 ${index !== largeExpense.you.length - 1 ? 'mb-3' : ''} border rounded`}>
                                                <div className="buttons position-absolute top-0 end-0 m-1">
                                                    {index === largeExpense.you.length - 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => addInputs('you', 'largeExpense')}
                                                            className="btn btn-sm btn-danger"
                                                            style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                        >+</button>
                                                    )}
                                                    {largeExpense.you.length > 1 && (
                                                        <>
                                                            <span>  </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeInputs('you', index, 'largeExpense')}
                                                                className="btn btn-sm btn-danger"
                                                                style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                            >-</button>
                                                        </>
                                                    )}
                                                </div>
                                                <label className="form-label responsive-label">Expense Description</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Description"
                                                    value={expense.description}
                                                    onChange={(e) => handleChange('largeExpense', 'you', index, 'description', e.target.value)}
                                                />
                                                <label className="form-label responsive-label">Estimated Amount</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Enter Amount"
                                                    value={expense.amount}
                                                    onChange={(e) => handleChange('largeExpense', 'you', index, 'amount', e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Spouse Section */}
                            <div className="col-md-6">
                                <div className="personal-detail-input d-flex flex-column">
                                    <h2>Spouse</h2>
                                    <div style={{ flex: 1 }}>
                                        {largeExpense.spouse.map((expense, index) => (
                                            <div key={`spouse-${index}`} className="position-relative p-3 mb-3 border rounded">
                                                <div className="buttons position-absolute top-0 end-0 m-1">
                                                    {index === largeExpense.spouse.length - 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => addInputs('spouse', 'largeExpense')}
                                                            className="btn btn-sm btn-danger"
                                                            style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                            aria-label="Add Liability"
                                                        >+</button>
                                                    )}
                                                    {largeExpense.spouse.length > 1 && (
                                                        <>
                                                            <span> </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeInputs('spouse', index, 'largeExpense')}
                                                                className="btn btn-sm btn-danger"
                                                                style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                aria-label="Remove Liability"
                                                            >-</button>
                                                        </>
                                                    )}
                                                </div>
                                                <label className="form-label responsive-label">Expense Description</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Description"
                                                    value={expense.description}
                                                    onChange={(e) => handleChange('largeExpense', 'spouse', index, 'description', e.target.value)}
                                                />
                                                <label className="form-label responsive-label">Estimated Amount</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Enter Amount"
                                                    value={expense.amount}
                                                    onChange={(e) => handleChange('largeExpense', 'spouse', index, 'amount', e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documents Section */}
                <div className="row">
                    <div className="col-md-2 my-4 text-area-label">
                        <label className="form-label" htmlFor="">Expense Documents</label>
                    </div>
                    <div className="col-md-10 my-4">
                        <input
                            type="file"
                            className="form-control"
                            id="expense-documents"
                            name="documents[]"
                            multiple
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                {/* Notes Section */}
                <div className="row">
                    <div className="col-md-2 my-4 text-area-label">
                        <label className="form-label" htmlFor="">Note</label>
                    </div>
                    <div className="col-md-10 my-4 form-textarea">
                        <textarea
                            className="form-control"
                            placeholder="Enter note here..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        ></textarea>

                        <div className="d-flex justify-content-between mt-3">
                            <Link className="next-btn" type="submit" to='/step2'>Previous</Link>
                            <button type="submit" className="next-btn">Next</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        </>
    );
}

export default Step3NeedsAndhealthCare;