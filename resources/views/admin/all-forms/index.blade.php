@extends('admin.layout.master')
@section('content')
    <div class="row">
        <div class="col-sm-12">
            <div class="page-title-box">
                <div class="btn-group float-right">
                    {{-- <a type="button" href="{{ route('admin.form.create') }}"
                        class="btn btn-primary waves-effect waves-light text-white"><i
                            class="fas fa-plus-square mr-2"></i>Create</a> --}}
                </div>
                <h4 class="page-title">All Forms</h4>
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
                                <th>Assigned To</th>
                                <th>Actions</th>
                            </tr>
                        </thead>


                        <tbody>
                            @foreach ($guestsData as $data)
                                @php
                                    $primaryForm1 = $data->multiStepForm1->first(fn($f) => !$f->is_spouse) ?? $data->multiStepForm1->first();
                                    $spouseForm1  = $data->multiStepForm1->first(fn($f) => (bool)$f->is_spouse);
                                    $primaryName  = $primaryForm1 ? trim(($primaryForm1->first_name ?? '').' '.($primaryForm1->last_name ?? '')) : null;
                                    $spouseName   = $spouseForm1  ? trim(($spouseForm1->first_name  ?? '').' '.($spouseForm1->last_name  ?? '')) : null;
                                    $displayName  = $primaryName ?: ($data->uuid ?? 'N/A');
                                    if ($spouseName) $displayName .= ' & ' . $spouseName;
                                @endphp
                                <tr>
                                    <td>{{ $displayName }}</td>
                                    <td>{{ $data['formAssigned'][0]->user->name ?? 'No user assigned' }}</td>
                                    {{-- <td><img src="{{ asset('images/farm/data/'.$data->icon) }}" alt=""
                                            class="thumb-sm mr-1"></td> --}}
                                    <td>
                                        <a type="button" class="btn btn-sm btn-dark text-white show-form-data"
                                            data-id="{{ $data['id'] }}" data-uuid="{{ $data['uuid'] }}" data-name="{{ $displayName }}" data-toggle="modal"
                                            data-animation="bounce" data-target=".form-modal-lg">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <a href="{{ route('admin.form.download-pdf', $data['id']) }}"
                                            class="btn btn-sm btn-danger text-white ml-1" title="Download PDF">
                                            <i class="fas fa-file-pdf"></i>
                                        </a>
                                        <a href="{{ route('admin.form.delete', $data['id']) }}"
                                            class="btn btn-sm btn-outline-danger ml-1" title="Delete Form"
                                            onclick="return confirm('Are you sure you want to delete this form? This cannot be undone.')">
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

                                </div>
                            </div><!-- /.modal-content -->
                        </div><!-- /.modal-dialog -->
                    </div><!-- /.modal -->
                </div>
            </div>
        </div> <!-- end col -->
    </div> <!-- end row -->
@endsection
@section('scripts')
    @include('admin.layout.form_data');
@endsection