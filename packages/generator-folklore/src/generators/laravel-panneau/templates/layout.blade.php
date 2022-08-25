<!doctype html>
<!--[if IE ]> <html class="ie" lang="{{ $locale }}"> <![endif]-->
<!--[if !(IE) ]><!--> <html lang="{{ $locale }}"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Head Assets -->
    @if(!isset($inWebpack) || !$inWebpack)
        @include('assets_head')
    @endif
    @stack('assets:head')
</head>
<body>
    <!-- Body -->
	@section('body')
		@yield('content')
	@show

	@if(isset($inWebpack) && $inWebpack)
        <script type="text/javascript" src="/static/js/bundle.js"></script>
        <script type="text/javascript" src="/static/js/main.chunk.js"></script>
    @else
        @include('assets_body')
    @endif
    @stack('assets:body')
</body>
</html>
