<!doctype html>
@include('partials.folklore')
<!--[if IE ]> <html class="ie" lang="{{ $locale }}"> <![endif]-->
<!--[if !(IE) ]><!--> <html lang="{{ $locale }}"> <!--<![endif]-->
<head>

	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

	<title>@yield('title')</title>
	<meta name="description" content="@yield('description')">

	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="shortcut icon" href="/favicon.ico" type="image/x-ico">
	<link rel="icon" href="/favicon.gif" type="image/gif">

	@section('head:opengraph')
        <!-- Open Graph meta -->
		<meta property="og:locale" content="{{ $locale }}_CA">
		@hasSection('thumbnail')
			<meta property="og:image" content="@yield('thumbnail')">
		@endif
		<meta property="og:title" content="@yield('title')">
		<meta property="og:type" content="website">
		<meta property="og:description" content="@yield('description')">
		<meta property="og:url" content="{{ Request::url() }}">
    @show

	@section('head:scripts')
		<!-- Head Javascript -->
		<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Array.prototype.find,Map,Set,Array.prototype.findIndex" type="text/javascript"></script>
		<script src="{{ asset('js/modernizr.js') }}" type="text/javascript"></script>
		<script src="{{ asset('js/manifest.js') }}" type="text/javascript"></script>
		<script src="{{ asset('js/config.js') }}" type="text/javascript"></script>
		@stack('scripts:head')
		<script type="text/javascript">
			app_config('locale', '{{ $locale }}');
		</script>
	@show

	@section('head:styles')
		<!-- CSS -->
		<link href="{{ asset('css/main.css') }}" rel="stylesheet" type="text/css">
		@stack('styles:head')
	@show

</head>
<body>
	@section('body:analytics')
        @if(config('services.google.analytics_id'))
    		<script>

    			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    			ga('create', '{{ config('services.google.analytics_id') }}');
    			ga('send', 'pageview');

    		</script>
        @endif
	@show

	@section('body')
		<header id="header">
			@yield('header')
		</header>

		<section id="content">
			@yield('content')
		</section>

		<footer id="footer">
			@yield('footer')
		</footer>
	@show

	@section('body:scripts')
		<!-- Footer javascript -->
		<script src="{{ asset('js/vendor.js') }}" type="text/javascript"></script>
		<script src="{{ asset('js/main.js') }}" type="text/javascript"></script>
		@stack('scripts:footer')
	@show

    @section('body:styles')
		<!-- Footer styles -->
		@stack('styles:footer')
	@show

</body>
</html>
