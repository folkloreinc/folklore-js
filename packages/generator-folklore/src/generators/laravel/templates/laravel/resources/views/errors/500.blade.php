@extends('layouts.main')

@section('title', trans('meta.title_500'))

@section('body')
    @hypernova('Root', $props)
@endsection
