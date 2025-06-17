@extends('admin.layout.master')
@section('content')
    <div class="row">
        <div class="col-sm-12">
            <div class="page-title-box">
                <div class="btn-group float-right">
                    <a type="button" href="{{ route('admin.user.create') }}" class="btn btn-primary waves-effect waves-light text-white">
                        <i class="fas fa-plus-square mr-2"></i>Create</a>
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
                                <th>Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>


                        <tbody>
                            @foreach ($users as $user)
                                <tr>
                                    <td>{{ $user['id'] }}</td>
                                    <td>{{ $user['name'] }}</td>
                                    <td>{{ $user['email'] }}</td>
                                    {{-- <td><img src="{{ asset('images/farm/user/'.$user->icon) }}" alt=""
                                            class="thumb-sm mr-1"></td> --}}
                                    <td>
                                        <a type="button" href="{{ route('admin.user.edit', $user['id']) }}"
                                            class="btn btn-sm btn-success text-white">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <a type="button" href="{{ route('admin.user.delete', $user['id']) }}"
                                            class="btn btn-sm btn-danger text-white">
                                            <i class="fas fa-trash-alt"></i>
                                        </a>
                                    </td>
                                </tr>
                            @endforeach

                        </tbody>
                    </table>
                   
                </div>
            </div>
        </div> <!-- end col -->
    </div> <!-- end row -->
@endsection