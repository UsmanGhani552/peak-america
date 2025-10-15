import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { generateGuestId, getApiInstance } from "../../src/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Toaster from "../Layout/Toaster";
import LoadingSpinner from "../LoadingSpinner";
import { useStepContext } from "../../src/hooks/StepContext";
import { Formik, Form, Field } from 'formik';

function Step3NeedsAndHealthCare() {
    const navigate = useNavigate();
    const note = localStorage.getItem('note');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [loadedData, setLoadedData] = useState(null);
    const { markStepCompleted } = useStepContext();
    const isSingleStatus = localStorage.getItem('spouseStatus');

    const initialValues = {
        needs: {
            you: [{ description: '', amount: 0 }],
            spouse: [{ description: '', amount: 0 }],
            youTotal: 0,
            youAnnual: 0,
            spouseTotal: 0,
            spouseAnnual: 0
        },
        wants: {
            you: [{ description: '', amount: 0 }],
            spouse: [{ description: '', amount: 0 }],
            youTotal: 0,
            youAnnual: 0,
            spouseTotal: 0,
            spouseAnnual: 0
        },
        liabilities: {
            you: [{ description: '', amount: 0 }],
            spouse: [{ description: '', amount: 0 }],
            youTotal: 0,
            youAnnual: 0,
            spouseTotal: 0,
            spouseAnnual: 0
        },
        largeExpense: {
            you: [{ description: '', amount: 0 }],
            spouse: [{ description: '', amount: 0 }]
        },
        notes: note || ''
    };

    const calculateTotals = (values, section, person) => {
        const items = values[section][person];
        return items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    };

    const addInputs = (setFieldValue, values, person, type) => {
        const newItem = { description: '', amount: 0 };
        const currentValues = values[type][person];
        setFieldValue(
            `${type}.${person}`,
            [...currentValues, newItem]
        );
    };

    const removeInputs = (setFieldValue, values, person, index, type) => {
        const currentValues = values[type][person];
        const updatedItems = currentValues.filter((_, i) => i !== index);
        setFieldValue(
            `${type}.${person}`,
            updatedItems
        );
    };

    const handleFileChange = (e) => {
        setDocuments(e.target.files);
    };

    const loadStep3DataFromApi = async () => {
        const api = await getApiInstance();
        try {
            const response = await api.post('get-form', { step: 3 });
            const { note, multi_step_form3 } = response.data.data;

            // Create deep copies of initial values to avoid reference issues
            const newNeeds = JSON.parse(JSON.stringify(initialValues.needs));
            const newWants = JSON.parse(JSON.stringify(initialValues.wants));
            const newLiabilities = JSON.parse(JSON.stringify(initialValues.liabilities));
            const newLargeExpense = JSON.parse(JSON.stringify(initialValues.largeExpense));

            // If no data or empty array, return initial values with at least one empty row
            if (!multi_step_form3 || multi_step_form3.length === 0) {
                setLoadedData({
                    needs: newNeeds,
                    wants: newWants,
                    liabilities: newLiabilities,
                    largeExpense: newLargeExpense,
                    notes: note || ''
                });
                return;
            }

            multi_step_form3.forEach((p) => {
                const isSpouse = p.is_spouse;
                const target = isSpouse ? 'spouse' : 'you';

                p.expenses.forEach((expense) => {
                    const label = expense.label;
                    const details = expense.expense_details || [];

                    // Ensure we always have at least one item in each array
                    const mappedItems = details.length > 0
                        ? details.map((d) => ({
                            description: d.label || '',
                            amount: parseFloat(d.amount) || 0,
                        }))
                        : [{ description: '', amount: 0 }]; // Default empty item

                    const total = parseFloat(expense.total) || 0;
                    const annual = parseFloat(expense.estimated_annual_amount) || 0;

                    if (label === 'your_needs') {
                        newNeeds[target] = mappedItems;
                        newNeeds[`${target}Total`] = total;
                        newNeeds[`${target}Annual`] = annual;
                    } else if (label === 'your_wants') {
                        newWants[target] = mappedItems;
                        newWants[`${target}Total`] = total;
                        newWants[`${target}Annual`] = annual;
                    } else if (label === 'liabilities') {
                        newLiabilities[target] = mappedItems;
                        newLiabilities[`${target}Total`] = total;
                        newLiabilities[`${target}Annual`] = annual;
                    } else if (label === 'large_expense') {
                        newLargeExpense[target] = mappedItems;
                    }
                });
            });

            setLoadedData({
                needs: newNeeds,
                wants: newWants,
                liabilities: newLiabilities,
                largeExpense: newLargeExpense,
                notes: note || ''
            });
        } catch (error) {
            console.error("Error loading step 3 data:", error);
            // Ensure we always have default data structure
            setLoadedData({
                needs: JSON.parse(JSON.stringify(initialValues.needs)),
                wants: JSON.parse(JSON.stringify(initialValues.wants)),
                liabilities: JSON.parse(JSON.stringify(initialValues.liabilities)),
                largeExpense: JSON.parse(JSON.stringify(initialValues.largeExpense)),
                notes: note || ''
            });
        }
    };

    useEffect(() => {
        loadStep3DataFromApi();
    }, []);

    const handleSubmit = async (values, { setSubmitting }) => {
        setIsSubmitting(true);
        setSubmitting(true);

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
                        needs: values.needs.you,
                        wants: values.wants.you,
                        liabilities: values.liabilities.you,
                        largeExpense: values.largeExpense.you,
                        wantsTotal: values.wants.youTotal,
                        wantsAnnual: values.wants.youAnnual,
                        liabilitiesTotal: values.liabilities.youTotal,
                        liabilitiesAnnual: values.liabilities.youAnnual
                    }, values.needs.youTotal, values.needs.youAnnual)
                },
                {
                    is_spouse: true,
                    expenses: formatExpenses({
                        needs: values.needs.spouse,
                        wants: values.wants.spouse,
                        liabilities: values.liabilities.spouse,
                        largeExpense: values.largeExpense.spouse,
                        wantsTotal: values.wants.spouseTotal,
                        wantsAnnual: values.wants.spouseAnnual,
                        liabilitiesTotal: values.liabilities.spouseTotal,
                        liabilitiesAnnual: values.liabilities.spouseAnnual
                    }, values.needs.spouseTotal, values.needs.spouseAnnual)
                }
            ],
            note: values.notes || ''
        };

        const buildFormData = (data) => {
            const formData = new FormData();

            formData.append('step', data.step);
            formData.append('note', data.note || '');

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

            if (documents) {
                Array.from(documents).forEach((file, index) => {
                    formData.append(`documents[]`, file);
                });
            }

            return formData;
        };

        async function getApiInstance_formData() {
            let guestId = localStorage.getItem('guestId');
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
                markStepCompleted(3);
                localStorage.setItem('note', values.notes);
                localStorage.setItem('currentStep', '4');
                setTimeout(() => {
                    setIsSubmitting(false);
                    setSubmitting(false);
                    navigate('/step4');
                }, 1500);
            })
            .catch(async error => {
                if (error.response?.data?.message === 'Guest UUID header is invalid.') {
                    await generateGuestId();
                    navigate('/step1');
                }
                setIsSubmitting(false);
                setSubmitting(false);
                if (error.response && error.response.data) {
                    const errorData = error.response.data.data.error;
                    Object.entries(errorData).forEach(([key, messages]) => {
                        toast.error(`${messages}`);
                    });
                } else {
                    toast.error("An unknown error occurred. Please try again.");
                    console.error("Unknown error:", error);
                }
            });
    };

    // Calculate max rows for labels
    const maxNeedsRows = Math.max(initialValues.needs.you.length, initialValues.needs.spouse.length);
    const maxWantsRows = Math.max(initialValues.wants.you.length, initialValues.wants.spouse.length);
    const maxLiabilitiesRows = Math.max(initialValues.liabilities.you.length, initialValues.liabilities.spouse.length);

    if (!loadedData) {
        return <LoadingSpinner show={true} />;
    }

    return (
        <>
            <LoadingSpinner show={isSubmitting} />
            <Toaster />
            <div className="container-fluid personal-detail-container">
                <Formik
                    initialValues={loadedData}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ values, setFieldValue, setValues, isSubmitting: formikSubmitting }) => (
                        <Form className="container-fluid" encType="multipart/form-data">
                            {/* Auto-calculate totals */}
                            {(() => {
                                const needsYouTotal = calculateTotals(values, 'needs', 'you');
                                const needsSpouseTotal = calculateTotals(values, 'needs', 'spouse');
                                const wantsYouTotal = calculateTotals(values, 'wants', 'you');
                                const wantsSpouseTotal = calculateTotals(values, 'wants', 'spouse');
                                const liabilitiesYouTotal = calculateTotals(values, 'liabilities', 'you');
                                const liabilitiesSpouseTotal = calculateTotals(values, 'liabilities', 'spouse');

                                // Update totals if they don't match
                                if (needsYouTotal !== values.needs.youTotal ||
                                    needsSpouseTotal !== values.needs.spouseTotal ||
                                    wantsYouTotal !== values.wants.youTotal ||
                                    wantsSpouseTotal !== values.wants.spouseTotal ||
                                    liabilitiesYouTotal !== values.liabilities.youTotal ||
                                    liabilitiesSpouseTotal !== values.liabilities.spouseTotal) {

                                    // Use setTimeout to avoid state updates during render
                                    setTimeout(() => {
                                        setValues({
                                            ...values,
                                            needs: {
                                                ...values.needs,
                                                youTotal: needsYouTotal,
                                                spouseTotal: needsSpouseTotal
                                            },
                                            wants: {
                                                ...values.wants,
                                                youTotal: wantsYouTotal,
                                                spouseTotal: wantsSpouseTotal
                                            },
                                            liabilities: {
                                                ...values.liabilities,
                                                youTotal: liabilitiesYouTotal,
                                                spouseTotal: liabilitiesSpouseTotal
                                            }
                                        });
                                    }, 0);
                                }
                            })()}

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
                                                    {values.needs.you.map((expense, index) => (
                                                        <div key={`you-${index}`} className={`position-relative p-3 ${index !== values.needs.you.length - 1 ? 'mb-3' : ''} border rounded`}>
                                                            <div className="buttons position-absolute top-0 end-0 m-1">
                                                                {index === values.needs.you.length - 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => addInputs(setFieldValue, values, 'you', 'needs')}
                                                                        className="btn btn-sm btn-danger"
                                                                        style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                        aria-label="Add expense"
                                                                    >+</button>
                                                                )}
                                                                {values.needs.you.length > 1 && (
                                                                    <>
                                                                        <span>  </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeInputs(setFieldValue, values, 'you', index, 'needs')}
                                                                            className="btn btn-sm btn-danger"
                                                                            style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                            aria-label="Remove expense"
                                                                        >-</button>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <label className="form-label responsive-label">Estimated Monthly Expenses</label>
                                                            <Field
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Expense"
                                                                name={`needs.you[${index}].description`}
                                                            />
                                                            <label className="form-label responsive-label">Enter Amount</label>
                                                            <Field
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="Enter Amount"
                                                                name={`needs.you[${index}].amount`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-auto">
                                                    <label className="form-label responsive-label">Total</label>
                                                    <Field
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="$00.00"
                                                        name="needs.youTotal"
                                                        readOnly
                                                    />
                                                    <div>
                                                        <label className="form-label responsive-label">Estimated Annual Expenses</label>
                                                        <Field
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Enter Annual Expense"
                                                            name="needs.youAnnual"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Spouse Section */}
                                        <div className={`col-md-6 ${isSingleStatus ? 'disabled-section' : ''}`}>
                                            <div className="personal-detail-input d-flex flex-column">
                                                <h2>Spouse</h2>
                                                <div style={{ flex: 1 }}>
                                                    {values.needs.spouse.map((expense, index) => (
                                                        <div key={`spouse-${index}`} className="position-relative p-3 mb-3 border rounded">
                                                            <div className="buttons position-absolute top-0 end-0 m-1">
                                                                {index === values.needs.spouse.length - 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => addInputs(setFieldValue, values, 'spouse', 'needs')}
                                                                        className="btn btn-sm btn-danger"
                                                                        style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                        aria-label="Add expense"
                                                                    >+</button>
                                                                )}
                                                                {values.needs.spouse.length > 1 && (
                                                                    <>
                                                                        <span> </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeInputs(setFieldValue, values, 'spouse', index, 'needs')}
                                                                            className="btn btn-sm btn-danger"
                                                                            style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                            aria-label="Remove expense"
                                                                        >-</button>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <label className="form-label responsive-label">Estimated Monthly Expenses</label>
                                                            <Field
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Expense"
                                                                name={`needs.spouse[${index}].description`}
                                                            />
                                                            <label className="form-label responsive-label">Enter Amount</label>
                                                            <Field
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="Enter Amount"
                                                                name={`needs.spouse[${index}].amount`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-top">
                                                    <label className="form-label responsive-label">Total</label>
                                                    <Field
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="$00.00"
                                                        name="needs.spouseTotal"
                                                        readOnly
                                                    />
                                                    <label className="form-label responsive-label">Estimated Annual Expenses</label>
                                                    <Field
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Enter Annual Expense"
                                                        name="needs.spouseAnnual"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Continue with the same pattern for Wants, Liabilities, and Large Expense sections */}
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
                                                    {values.wants.you.map((expense, index) => (
                                                        <div key={`you-${index}`} className={`position-relative p-3 ${index !== values.wants.you.length - 1 ? 'mb-3' : ''} border rounded`}>
                                                            <div className="buttons position-absolute top-0 end-0 m-1">
                                                                {index === values.wants.you.length - 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => addInputs(setFieldValue, values, 'you', 'wants')}
                                                                        className="btn btn-sm btn-danger"
                                                                        style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                        aria-label="Add expense"
                                                                    >+</button>
                                                                )}
                                                                {values.wants.you.length > 1 && (
                                                                    <>
                                                                        <span>  </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeInputs(setFieldValue, values, 'you', index, 'wants')}
                                                                            className="btn btn-sm btn-danger"
                                                                            style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                            aria-label="Remove expense"
                                                                        >-</button>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <label className="form-label responsive-label">Estimated Monthly Expenses</label>
                                                            <Field
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Expense"
                                                                name={`wants.you[${index}].description`}
                                                            />
                                                            <label className="form-label responsive-label">Enter Amount</label>
                                                            <Field
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="Enter Amount"
                                                                name={`wants.you[${index}].amount`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-auto">
                                                    <label className="form-label responsive-label">Total</label>
                                                    <Field
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="$00.00"
                                                        name="wants.youTotal"
                                                        readOnly
                                                    />
                                                    <div>
                                                        <label className="form-label responsive-label">Estimated Annual Expenses</label>
                                                        <Field
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Enter Annual Expense"
                                                            name="wants.youAnnual"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Spouse Section */}
                                        <div className={`col-md-6 ${isSingleStatus ? 'disabled-section' : ''}`}>
                                            <div className="personal-detail-input d-flex flex-column">
                                                <h2>Spouse</h2>
                                                <div style={{ flex: 1 }}>
                                                    {values.wants.spouse.map((expense, index) => (
                                                        <div key={`spouse-${index}`} className="position-relative p-3 mb-3 border rounded">
                                                            <div className="buttons position-absolute top-0 end-0 m-1">
                                                                {index === values.wants.spouse.length - 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => addInputs(setFieldValue, values, 'spouse', 'wants')}
                                                                        className="btn btn-sm btn-danger"
                                                                        style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                        aria-label="Add expense"
                                                                    >+</button>
                                                                )}
                                                                {values.wants.spouse.length > 1 && (
                                                                    <>
                                                                        <span> </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeInputs(setFieldValue, values, 'spouse', index, 'wants')}
                                                                            className="btn btn-sm btn-danger"
                                                                            style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                            aria-label="Remove expense"
                                                                        >-</button>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <label className="form-label responsive-label">Estimated Monthly Expenses</label>
                                                            <Field
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Expense"
                                                                name={`wants.spouse[${index}].description`}
                                                            />
                                                            <label className="form-label responsive-label">Enter Amount</label>
                                                            <Field
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="Enter Amount"
                                                                name={`wants.spouse[${index}].amount`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-top">
                                                    <label className="form-label responsive-label">Total</label>
                                                    <Field
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="$00.00"
                                                        name="wants.spouseTotal"
                                                        readOnly
                                                    />
                                                    <label className="form-label responsive-label">Estimated Annual Expenses</label>
                                                    <Field
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Enter Annual Expense"
                                                        name="wants.spouseAnnual"
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
                                                    {values.liabilities.you.map((expense, index) => (
                                                        <div key={`you-${index}`} className={`position-relative p-3 ${index !== values.liabilities.you.length - 1 ? 'mb-3' : ''} border rounded`}>
                                                            <div className="buttons position-absolute top-0 end-0 m-1">
                                                                {index === values.liabilities.you.length - 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => addInputs(setFieldValue, values, 'you', 'liabilities')}
                                                                        className="btn btn-sm btn-danger"
                                                                        style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                        aria-label="Add Liability"
                                                                    >+</button>
                                                                )}
                                                                {values.liabilities.you.length > 1 && (
                                                                    <>
                                                                        <span>  </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeInputs(setFieldValue, values, 'you', index, 'liabilities')}
                                                                            className="btn btn-sm btn-danger"
                                                                            style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                            aria-label="Remove Liability"
                                                                        >-</button>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <label className="form-label responsive-label">Estimated Monthly Liabilities</label>
                                                            <Field
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Liability"
                                                                name={`liabilities.you[${index}].description`}
                                                            />
                                                            <label className="form-label responsive-label">Enter Amount</label>
                                                            <Field
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="Enter Amount"
                                                                name={`liabilities.you[${index}].amount`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-auto">
                                                    <label className="form-label responsive-label">Total</label>
                                                    <Field
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="$00.00"
                                                        name="liabilities.youTotal"
                                                        readOnly
                                                    />
                                                    <div>
                                                        <label className="form-label responsive-label">Estimated Annual Expenses</label>
                                                        <Field
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Enter Annual Liabilities"
                                                            name="liabilities.youAnnual"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Spouse Section */}
                                        <div className={`col-md-6 ${isSingleStatus ? 'disabled-section' : ''}`}>
                                            <div className="personal-detail-input d-flex flex-column">
                                                <h2>Spouse</h2>
                                                <div style={{ flex: 1 }}>
                                                    {values.liabilities.spouse.map((expense, index) => (
                                                        <div key={`spouse-${index}`} className="position-relative p-3 mb-3 border rounded">
                                                            <div className="buttons position-absolute top-0 end-0 m-1">
                                                                {index === values.liabilities.spouse.length - 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => addInputs(setFieldValue, values, 'spouse', 'liabilities')}
                                                                        className="btn btn-sm btn-danger"
                                                                        style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                        aria-label="Add Liability"
                                                                    >+</button>
                                                                )}
                                                                {values.liabilities.spouse.length > 1 && (
                                                                    <>
                                                                        <span> </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeInputs(setFieldValue, values, 'spouse', index, 'liabilities')}
                                                                            className="btn btn-sm btn-danger"
                                                                            style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                            aria-label="Remove Liability"
                                                                        >-</button>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <label className="form-label responsive-label">Estimated Monthly Liabilities</label>
                                                            <Field
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Liability"
                                                                name={`liabilities.spouse[${index}].description`}
                                                            />
                                                            <label className="form-label responsive-label">Enter Amount</label>
                                                            <Field
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="Enter Amount"
                                                                name={`liabilities.spouse[${index}].amount`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-top">
                                                    <label className="form-label responsive-label">Total</label>
                                                    <Field
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="$00.00"
                                                        name="liabilities.spouseTotal"
                                                        readOnly
                                                    />
                                                    <label className="form-label responsive-label">Estimated Annual Expenses</label>
                                                    <Field
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Enter Annual Liabilities"
                                                        name="liabilities.spouseAnnual"
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
                                                    {values.largeExpense.you.map((expense, index) => (
                                                        <div key={`you-${index}`} className={`position-relative p-3 ${index !== values.largeExpense.you.length - 1 ? 'mb-3' : ''} border rounded`}>
                                                            <div className="buttons position-absolute top-0 end-0 m-1">
                                                                {index === values.largeExpense.you.length - 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => addInputs(setFieldValue, values, 'you', 'largeExpense')}
                                                                        className="btn btn-sm btn-danger"
                                                                        style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                    >+</button>
                                                                )}
                                                                {values.largeExpense.you.length > 1 && (
                                                                    <>
                                                                        <span>  </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeInputs(setFieldValue, values, 'you', index, 'largeExpense')}
                                                                            className="btn btn-sm btn-danger"
                                                                            style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                        >-</button>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <label className="form-label responsive-label">Expense Description</label>
                                                            <Field
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Description"
                                                                name={`largeExpense.you[${index}].description`}
                                                            />
                                                            <label className="form-label responsive-label">Estimated Amount</label>
                                                            <Field
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="Enter Amount"
                                                                name={`largeExpense.you[${index}].amount`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Spouse Section */}
                                        <div className={`col-md-6 ${isSingleStatus ? 'disabled-section' : ''}`}>
                                            <div className="personal-detail-input d-flex flex-column">
                                                <h2>Spouse</h2>
                                                <div style={{ flex: 1 }}>
                                                    {values.largeExpense.spouse.map((expense, index) => (
                                                        <div key={`spouse-${index}`} className="position-relative p-3 mb-3 border rounded">
                                                            <div className="buttons position-absolute top-0 end-0 m-1">
                                                                {index === values.largeExpense.spouse.length - 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => addInputs(setFieldValue, values, 'spouse', 'largeExpense')}
                                                                        className="btn btn-sm btn-danger"
                                                                        style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                        aria-label="Add Liability"
                                                                    >+</button>
                                                                )}
                                                                {values.largeExpense.spouse.length > 1 && (
                                                                    <>
                                                                        <span> </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeInputs(setFieldValue, values, 'spouse', index, 'largeExpense')}
                                                                            className="btn btn-sm btn-danger"
                                                                            style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                                                                            aria-label="Remove Liability"
                                                                        >-</button>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <label className="form-label responsive-label">Expense Description</label>
                                                            <Field
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Description"
                                                                name={`largeExpense.spouse[${index}].description`}
                                                            />
                                                            <label className="form-label responsive-label">Estimated Amount</label>
                                                            <Field
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="Enter Amount"
                                                                name={`largeExpense.spouse[${index}].amount`}
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
                                    <Field
                                        as="textarea"
                                        className="form-control"
                                        placeholder="Enter note here..."
                                        name="notes"
                                    />

                                    <div className="d-flex justify-content-between mt-3">
                                        <Link className="next-btn" type="submit" to='/step2'>Previous</Link>
                                        <button type="submit" className="next-btn" disabled={formikSubmitting}>
                                            {formikSubmitting ? 'Submitting...' : 'Next'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    );
}

export default Step3NeedsAndHealthCare;