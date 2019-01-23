@extends('layouts.main')

@section('title', trans('meta.title_404'))

@section('body')
    @hypernova('Root', $props)
@endsection
