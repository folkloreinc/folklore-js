@extends('layouts.main')

@if(isset($inWebpack) && $inWebpack)
    @section('assets:body')
        <script type="text/javascript" src="/static/js/bundle.js"></script>
        <script type="text/javascript" src="/static/js/main.chunk.js"></script>
    @endsection
@else
    @include('assets')
@endif

@section('content')
    <div id="app"></div>
    <script type="application/json" id="app-props">@json($props)</script>
@endsection
