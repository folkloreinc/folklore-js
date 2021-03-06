<!doctype html>
<!--[if IE ]> <html class="ie" lang="{{ $locale }}"> <![endif]-->
<!--[if !(IE) ]><!--> <html lang="{{ $locale }}"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

	<title>@yield('title')</title>
	<meta name="description" content="@yield('description')">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="shortcut icon" href="/favicon.ico" type="image/x-ico">
	<link rel="icon" href="/favicon.gif" type="image/gif">
    <meta name="csrf-token" content="{{ csrf_token() }}">

	@section('head:scripts')
		<!-- Head Javascript -->
        <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=WeakMap,Object.values,Object.entries,Intl,Intl.~locale.fr,Intl.~locale.en"></script>
        <script type="text/javascript">
            var PANNEAU_ASSETS_PATH = '{{ asset('vendor/panneau') }}/';
            window._panneau_config=window._panneau_config||{};
            function panneau_config(a,b){
                if("undefined"===typeof a)return window._panneau_config;
                if("undefined"===typeof b)return window._panneau_config[a];
                window._panneau_config[a]=b
            };
        </script>
		@stack('scripts:head')
	@show

	@section('head:styles')
        <link href="{{asset('vendor/panneau/panneau.css')}}?version={{config('app.version')}}" rel="stylesheet" type="text/css" />
        @if (app()->environment() === 'production')
        <link href="{{asset('panneau/main.css')}}?version={{config('app.version')}}" rel="stylesheet" type="text/css" />
        @endif
		@stack('styles:head')
	@show

</head>
<body>
	@section('body')
        <div id="panneau"></div>
	@show

	@section('body:scripts')
		@stack('scripts:footer')
	@show

    @section('body:styles')
        <script type="text/javascript">
            panneau_config('locale', '{{ $locale }}');
            panneau_config('messages', {!! json_encode($messages) !!});
            panneau_config('definition', {!! json_encode($definition) !!});
        </script>
        <script src="{{asset('panneau/main.js')}}?version={{config('app.version')}}" type="text/javascript"></script>
		@stack('styles:footer')
	@show

</body>
</html>
