@extends('layouts.main')

@section('title', trans('meta.title_401'))
@section('description', array_get($meta, 'description', trans('meta.description')))
@section('thumbnail', array_get($meta, 'thumbnail', trans('meta.thumbnail')))
@section('title_facebook', trans('meta.title_401'))
@section('description_facebook', array_get($meta, 'description_facebook', array_get($meta, 'description', trans('meta.description'))))

@section('body')
    <div id="root"></div>
    <script id="root-props" type="application/json">{!! json_encode($props) !!}</script>
@endsection
