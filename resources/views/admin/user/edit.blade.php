@extends('admin.layout.master')
@section('content')
    <div class="row">
        <div class="col-sm-12">
            <div class="page-title-box">
                <div class="btn-group float-right">
                    <a type="button" href="{{ route('admin.user.index') }}"
                        class="btn btn-primary waves-effect waves-light text-white"><i
                            class="fas fa-plus-square mr-2"></i>Back</a>
                </div>
                <h4 class="page-title">Create Admin</h4>
            </div>
        </div>
    </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-xl-12">
                            <form action="{{ route('admin.user.update', $user->id) }}" method="POST" enctype="multipart/form-data">
                                @csrf
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group row">
                                            <label for="name" class="col-sm-3 col-form-label">Name</label>
                                            <div class="col-sm-9">
                                                <input class="form-control" type="text" name="name" id="name" value="{{ $user->name }}">
                                                @error('name')
                                                    <span class="text-danger">{{ $message }}</span>
                                                @enderror
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group row">
                                            <label for="email" class="col-sm-3 col-form-label">Email</label>
                                            <div class="col-sm-9">
                                                <input type="email" class="form-control" name="email" id="email" value="{{ $user->email }}">
                                                @error('email')
                                                    <span class="text-danger">{{ $message }}</span>
                                                @enderror
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group row">
                                            <label for="password" class="col-sm-3 col-form-label">Password</label>
                                            <div class="col-sm-9">
                                                <input type="password" class="form-control" name="password" id="password">
                                                @error('password')
                                                    <span class="text-danger">{{ $message }}</span>
                                                @enderror
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group row">
                                            <label for="password_confirmation" class="col-sm-3 col-form-label">Confirm
                                                Password</label>
                                            <div class="col-sm-9">
                                                <input type="password" class="form-control" name="password_confirmation"
                                                    id="password_confirmation">
                                                @error('password_confirmation')
                                                    <span class="text-danger">{{ $message }}</span>
                                                @enderror
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group mb-0">
                                    <div>
                                        <button type="submit"
                                            class="btn btn-primary waves-effect waves-light">Submit</button>
                                        <button type="reset" class="btn btn-secondary waves-effect m-l-5">Cancel</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div> <!-- end col -->
    </div>
@endsection