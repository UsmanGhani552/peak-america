<script>
    $(document).ready(function () {
        $('.show-form-data').on('click', function () {
            var id = $(this).data('id');
            var uuid = $(this).data('uuid');

            $.ajax({
                url: 'unassigned-form/show/' + id,
                type: 'GET',
                success: function (response) {
                    console.log(response);
                    $('.modal-body').html('');

                    if (response && response.data && response.data.forms) {
                        var formData = response.data.forms;
                        var guestId = response.data.id; // Get the ID from your response
                        var assignFormRoute = '{{ route("admin.unassigned-form.assign", ["guest_id" => ":id"]) }}'.replace(':id', guestId);
                        var htmlContent = `
                                <div class="modal-header">
                                    <h5 class="modal-title mt-0">Form Details - ${uuid}</h5>
                                    ${window.location.pathname == '/admin/unassigned-form' ? `<a href="${assignFormRoute}" class="btn btn-success btn-sm m-auto"><i
                                    class="fas fa-plus-square mr-2"></i>Accept</a>` : ''}
                                    
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                                </div>
                                <div class="modal-body">`;

                        // Create tabs for each form step
                        htmlContent += `<ul class="nav nav-tabs" id="formTabs" role="tablist">`;
                        formData.forEach((formStep, index) => {
                            const active = index === 0 ? 'active' : '';
                            const stepName = getStepName(formStep.step);
                            const tabId = 'step-' + formStep.step.toString().replace('.', '_');
                            htmlContent += `
                                    <li class="nav-item">
                                        <a class="nav-link ${active}" id="${tabId}-tab" data-toggle="tab" 
                                           href="#${tabId}" role="tab" aria-controls="${tabId}" 
                                           aria-selected="${index === 0}">
                                            ${stepName}
                                        </a>
                                    </li>`;
                        });
                        htmlContent += `</ul>`;

                        // Create tab content
                        htmlContent += `<div class="tab-content p-3" id="formTabsContent">`;

                        formData.forEach((formStep, index) => {
                            const active = index === 0 ? 'show active' : '';
                            const tabId = 'step-' + formStep.step.toString().replace('.', '_');
                            htmlContent += `
                                    <div class="tab-pane fade ${active}" id="${tabId}" role="tabpanel" 
                                         aria-labelledby="${tabId}-tab">
                                        ${renderFormStep(formStep)}
                                    </div>`;

                        });

                        htmlContent += `</div></div>`;
                        $('.modal-content').html(htmlContent);

                        // Initialize tabs properly
                        $('#formTabs a').on('click', function (e) {
                            e.preventDefault();
                            $(this).tab('show');
                        });
                    } else {
                        $('.modal-body').html('<p>No data found for this form.</p>');
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error fetching form data:', error);
                }
            });
        });

        function getStepName(step) {
            const stepNames = {
                '1': 'Personal Info',
                '2_1': 'Financial Assets',
                '2_2': 'Additional Assets',
                '4': 'Property',
                '5': 'Value',
                '6': 'Retirement'
            };
            return stepNames[step.toString().replace('.', '_')] || `Step ${step}`;
        }

        // ... rest of your existing functions (renderFormStep, renderFormData, formatDate) ...

        function renderFormStep(formStep) {
            let html = '';
            const primaryForm = formStep.form.find(f => !f.is_spouse);
            const spouseForm = formStep.form.find(f => f.is_spouse);

            // Add note if exists
            if (formStep.note) {
                html += `<div class="alert alert-dark mb-4"><strong>Note:</strong> ${formStep.note}</div>`;
            }

            html += `<div class="row">`;

            // Primary (You) column
            if (formStep.step < 5) {
                html += `<div class="col-md-6 border-right">`;

                html += `<h4 class="text-center mb-4">You</h4>`;
            }
            else {
                html += `<div class="col-md-12">`;
            }
            if (primaryForm) {
                html += renderFormData(primaryForm, formStep.step);
            } else {
                html += `<p>No data available</p>`;
            }
            html += `</div>`;

            // Spouse column
            if (formStep.step < 5) {
                html += `<div class="col-md-6">`;
                html += `<h4 class="text-center mb-4">Spouse</h4>`;
                if (spouseForm) {
                    html += renderFormData(spouseForm, formStep.step);
                } else {
                    html += `<p>No data available</p>`;
                }
                html += `</div>`;
            }
            html += `</div>`;
            return html;
        }

        function renderFormData(formData, step) {
            let html = '';
            switch (step) {
                case 1: // Personal Info
                    html += `
                            <div class="mb-3">
                                <p><strong>Name:</strong> ${formData.first_name} ${formData.last_name}</p>
                                <p><strong>Age:</strong> ${formatDate(formData.age)}</p>
                                <p><strong>Email:</strong> ${formData.email}</p>
                                <p><strong>Phone:</strong> ${formData.cell_phone}</p>
                                <p><strong>Marital Status:</strong> ${formData.marital_status}</p>
                            </div>`;

                    if (formData.kids && formData.kids.length > 0) {
                        html += `<div class="mb-3">
                                    <h5>Children</h5>
                                    <ul>`;
                        formData.kids.forEach(kid => {
                            html += `<li>Age: ${kid.age}</li>`;
                        });
                        html += `</ul></div>`;
                    }
                    break;

                case 2.1: // Financial Assets
                    html += `
                            <div class="mb-3">
                                <p><strong>Checking/Savings:</strong> $${formData.checking_savings}</p>
                                <p><strong>CDs:</strong> $${formData.cds}</p>
                                <p><strong>Stocks/Bonds/Brokerage:</strong> $${formData.stocks_bonds_brokerage}</p>
                                <p><strong>IRAs (Pre-tax):</strong> $${formData.iras_pre_tax}</p>
                                <p><strong>Roth IRAs:</strong> $${formData.roth_iras}</p>
                                <p><strong>Other Funds:</strong> $${formData.other_funds}</p>
                                <p><strong>Qualified Retirement Accounts:</strong> $${formData.qualified_retirement_accounts}</p>
                                <p class="font-weight-bold"><strong>Total:</strong> $${formData.total}</p>
                            </div>`;
                    break;

                case 2.2: // Additional Assets
                    html += `
                            <div class="mb-3">
                                <p><strong>Annuities:</strong> $${formData.annuities}</p>
                                <p><strong>Lump Sum Pension:</strong> $${formData.lump_sum_pension}</p>
                                <p><strong>Long Term Care Insurance:</strong> $${formData.long_term_care_insurance}</p>
                                <p><strong>Life Insurance:</strong> $${formData.life_insurance}</p>
                                <p><strong>Business Interest:</strong> $${formData.business_interest}</p>
                                <p><strong>Other Assets:</strong> $${formData.other_assets}</p>
                                <p class="font-weight-bold"><strong>Total:</strong> $${formData.total}</p>
                            </div>`;
                    break;

                case 4: // Property
                    if (formData.property && formData.property.length > 0) {
                        html += `<div class="mb-3">`;

                        formData.property.forEach(property => {
                            html += `
                                    <div class="card mb-2 shadow ">
                                        <div class="card-body">
                                            <h6 class="card-title text-capitalize">${property.type} Property</h6>
                                            <p><strong>Address:</strong> ${property.address}</p>
                                            <p><strong>Value:</strong> $${property.value}</p>
                                        </div>
                                    </div>`;
                        });

                        html += `</div>`;
                    } else {
                        html += `<p>No property information available</p>`;
                    }
                    break;

                case 5: // Questionnaire 1
                case 6: // Questionnaire 2
                    if (formData.question_answers && formData.question_answers.length > 0) {
                        html += `<div class="mb-3">
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Question</th>
                                                <th>Answer</th>
                                            </tr>
                                        </thead>
                                        <tbody>`;

                        // In a real implementation, you might want to fetch question texts by ID
                        formData.question_answers.forEach(qa => {
                            html += `
                                    <tr>
                                        <td>${qa.question}</td>
                                        <td>${qa.answer}</td>
                                    </tr>`;
                        });

                        html += `</tbody></table></div>`;
                    }
                    break;

                default:
                    html += `<p>Form data for this step cannot be displayed.</p>`;
            }

            return html;
        }

        function formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString();
        }
    });
</script>