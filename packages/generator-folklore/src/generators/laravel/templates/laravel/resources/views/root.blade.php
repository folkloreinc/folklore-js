@extends('layouts.main')

@section('title', trans('meta.title'))

@section('body')
    @hypernova('Root', $props)
@endsection
