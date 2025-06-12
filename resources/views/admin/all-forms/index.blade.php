@extends('admin.layout.master')
@section('content')
    <div class="row">
        <div class="col-sm-12">
            <div class="page-title-box">
                <div class="btn-group float-right">
                    <a type="button" href="{{ route('admin.form.create') }}"
                        class="btn btn-primary waves-effect waves-light text-white"><i
                            class="fas fa-plus-square mr-2"></i>Create</a>
                </div>
                <h4 class="page-title">Forms</h4>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card">
                @if ($message = Session::get('success'))
                    <div class="alert alert-success alert-block">
                        <strong>{{ $message }}</strong>
                    </div>
                @endif
                <div class="card-body">


                    <table id="datatable" class="table table-striped table-bordered dt-responsive nowrap"
                        style="border-collapse: collapse; border-spacing: 0; width: 100%;">
                        <thead>
                            <tr>
                                <th>Name</th>
                                {{-- <th>Icon</th> --}}
                                <th>Actions</th>
                            </tr>
                        </thead>


                        <tbody>
                            @foreach ($guestsData as $data)
                                <tr>
                                    <td>{{ $data['uuid'] }}</td>
                                    {{-- <td><img src="{{ asset('images/farm/data/'.$data->icon) }}" alt=""
                                            class="thumb-sm mr-1"></td> --}}
                                    <td>
                                        <a type="button" class="btn btn-sm btn-dark text-white show-form-data"
                                            data-id="{{ $data['id'] }}" data-uuid="{{ $data['uuid'] }}" data-toggle="modal"
                                            data-animation="bounce" data-target=".form-modal-lg">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <a type="button" href="{{ route('admin.form.edit', $data['id']) }}"
                                            class="btn btn-sm btn-success text-white">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <a type="button" href="{{ route('admin.form.delete', $data['id']) }}"
                                            class="btn btn-sm btn-danger text-white">
                                            <i class="fas fa-trash-alt"></i>
                                        </a>
                                    </td>
                                </tr>
                            @endforeach

                        </tbody>
                    </table>
                    <!--  Modal content for the above example -->
                    <div class="modal fade form-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
                        aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title mt-0" id="myLargeModalLabel">Large modal</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                                </div>
                                <div class="modal-body">
                                    <div class="row">
                                        <div class="col-6">
                                            <h2>You</h2>
                                        </div>
                                        <div class="col-6">
                                            <h2>Spouse</h2>
                                        </div>
                                        <p>Note:</p>
                                    </div>
                                </div>
                            </div><!-- /.modal-content -->
                        </div><!-- /.modal-dialog -->
                    </div><!-- /.modal -->
                </div>
            </div>
        </div> <!-- end col -->
    </div> <!-- end row -->
@endsection

@push('scripts')
    <script>
        $(document).ready(function () {
            $('.show-form-data').on('click', function () {
                var id = $(this).data('id');
                var uuid = $(this).data('uuid');

                $.ajax({
                    url: 'form/show/' + id,
                    type: 'GET',
                    success: function (response) {
                        console.log(response);
                        $('.modal-body').html('');

                        if (response && response.data && response.data.forms) {
                            var formData = response.data.forms;
                            var htmlContent = `
                            <div class="modal-header">
                                <h5 class="modal-title mt-0">Form Details - ${uuid}</h5>
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
                    html += `<div class="alert alert-info mb-4"><strong>Note:</strong> ${formStep.note}</div>`;
                }

                html += `<div class="row">`;

                // Primary (You) column
                html += `<div class="col-md-6 border-right">`;
                html += `<h4 class="text-center mb-4">You</h4>`;
                if (primaryForm) {
                    html += renderFormData(primaryForm, formStep.step);
                } else {
                    html += `<p>No data available</p>`;
                }
                html += `</div>`;

                // Spouse column
                html += `<div class="col-md-6">`;
                html += `<h4 class="text-center mb-4">Spouse</h4>`;
                if (spouseForm) {
                    html += renderFormData(spouseForm, formStep.step);
                } else {
                    html += `<p>No data available</p>`;
                }
                html += `</div>`;

                html += `</div>`;
                return html;
            }

            function renderFormData(formData, step) {
                let html = '';
                console.log(step);
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
                                        <div class="card mb-2">
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
                                            <td>Question ${qa.question_id}</td>
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
@endpush