@extends('layouts.main')

@section('title', 'Accueil')

@section('head:styles')
    @parent
    <style type="text/css">
        .folklore {
            background: url("{{ asset('img/folklore.png') }}") no-repeat top left;
            background-size: 100% 100%;
            width:200px;
            height:200px;
            position:fixed;
            top: 50%;
            left: 50%;
            margin-top:-100px;
            margin-left:-100px;
            transition: all 0.2s ease-out;
        }
        
        .folklore:hover {
            -webkit-filter: blur(100px);
            -webkit-transform: scale(0.5) rotate(260deg);
            -moz-filter: blur(100px);
            -moz-transform: scale(0.5) rotate(260deg);
            -ms-filter: blur(100px);
            -ms-transform: scale(0.5) rotate(260deg);
            filter: blur(100px);
            transform: scale(0.5) rotate(260deg);
        }
    </style>
@endsection

@section('content')
    <div class="folklore"></div>
@endsection
