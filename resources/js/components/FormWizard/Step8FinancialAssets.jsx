import { Link } from "react-router-dom";

function Step8FinancialAssets() {

    return (
        <>
            <div className="container-fluid personal-detail-container">
                <div className="row">
                    <div className="col personal-detail-header">
                        <h2>We are nearly finished. Tell us what is top of mind and keeps you up at night when you think about your money in retirement.</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6 d-flex flex-column personal-detail-label financial-assets-label">
                        <label className="form-label" htmlFor="">What is the estimated value of your investable financial assets</label>
                        <label className="form-label" htmlFor="">When you think of the word "risk" in a financial context, which word best describes your thinking?</label>
                        <label className="form-label" htmlFor="">When faced with a major financial decision, on which outcome are you most focused?</label>
                        <label className="form-label" htmlFor="">After you have made a major financial decision, how do you typically feel?</label>
                        <label className="form-label" htmlFor="">During market declines, you typically sell portions of your riskier assets and invest the money in safer assets.</label>
                        <label className="form-label" htmlFor="">What percentage of loss over the course of a year would make you AWARE, WORRIED, and ALARMED?</label>
                        <label className="form-label" htmlFor="">How much money could you lose in total before needing to adjust your life-style spending?</label>
                        <label className="form-label" htmlFor="">How well do you understand the market?</label>
                        <label className="form-label" htmlFor="">How long have you been investing?</label>
                        <label className="form-label" htmlFor="">How much time do you spend per week reviewing your investments?</label>
                    </div>
                    <div className="col-md-6">
                        <form action="" className="container-fluid">
                            <div className="row gx-5 personal-detail-input-container financial-assets">
                                <div className="col">
                                    <div className="personal-detail-input financial-assets-input">
                                        <label className="form-label responsive-label" htmlFor="">What is the estimated value of your investable financial assets</label>
                                        <input type="text" className="form-control" placeholder="Enter value" />
                                        <label className="form-label responsive-label" htmlFor="">When you think of the word "risk" in a financial context, which word best describes your thinking?</label>
                                        <input type="text" className="form-control" placeholder="Enter value" />
                                        <label className="form-label responsive-label" htmlFor="">When faced with a major financial decision, on which outcome are you most focused?</label>
                                        <input type="text" className="form-control" placeholder="Enter value" />
                                        <label className="form-label responsive-label" htmlFor="">After you have made a major financial decision, how do you typically feel?</label>
                                        <input type="text" className="form-control" placeholder="Enter value" />
                                        <label className="form-label responsive-label" htmlFor="">During market declines, you typically sell portions of your riskier assets and invest the money in safer assets.</label>
                                        <input type="text" className="form-control" placeholder="Enter value" />
                                        <label className="form-label responsive-label" htmlFor="">What percentage of loss over the course of a year would make you AWARE, WORRIED, and ALARMED?</label>
                                        <div className="row">
                                            <div className="col-4 pr-0">
                                                <input type="number" className="form-control m-0" placeholder="Aware" />
                                            </div>
                                            <div className="col-4 p-0">
                                                <input type="number" className="form-control m-0" placeholder="Worried" />
                                            </div>
                                            <div className="col-4 pl-0">
                                                <input type="number" className="form-control m-0" placeholder="Alarmed" />
                                            </div>
                                        </div>
                                        <label className="form-label responsive-label" htmlFor="">How much money could you lose in total before needing to adjust your life-style spending?</label>
                                        <input type="text" className="form-control" placeholder="Enter value" />
                                        <label className="form-label responsive-label" htmlFor="">How well do you understand the market?</label>
                                        <select name="" id="" className="form-select" placeholder="Select Marital Status">
                                            <option value="">Single</option>
                                            <option value="">Married</option>
                                        </select>
                                        <label className="form-label responsive-label" htmlFor="">How long have you been investing?</label>
                                        <select name="" id="" className="form-select" placeholder="Select Marital Status">
                                            <option value="">Single</option>
                                            <option value="">Married</option>
                                        </select>
                                        <label className="form-label responsive-label" htmlFor="">How much time do you spend per week reviewing your investments?</label>
                                        <select name="" id="" className="form-select" placeholder="Select Marital Status">
                                            <option value="">Single</option>
                                            <option value="">Married</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 my-4 text-area-label">
                        <label className="form-label" htmlFor="">Note</label>
                    </div>
                    <div className="col-md-10 my-4 form-textarea">
                        <textarea className="form-control" placeholder="Enter note here..."></textarea>

                        <div className="d-flex justify-content-between mt-3">
                        <Link className="next-btn" type="submit" to='/step7'>Previous</Link>
                            <Link className="next-btn" type="submit">Submit</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Step8FinancialAssets;