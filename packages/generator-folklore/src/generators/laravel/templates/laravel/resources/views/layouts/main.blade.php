<!doctype html>
@include('partials.folklore')
<!--[if IE ]> <html class="ie" lang="{{ $locale }}"> <![endif]-->
<!--[if !(IE) ]><!--> <html lang="{{ $locale }}"> <!--<![endif]-->
<head>

	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="language" content="{{ $locale }}">

	<title>@yield('title')</title>
	<meta name="description" content="@yield('description')" data-react-helmet="true">

	<link rel="shortcut icon" href="{{ asset('favicon.ico') }}" type="image/x-ico">
	<link rel="icon" href="{{ asset('favicon.png') }}" type="image/png">

	@section('head:opengraph')
        <!-- Open Graph meta -->
		<meta property="og:locale" content="{{ $locale }}_CA">
		@hasSection('thumbnail')
			<meta property="og:image" content="@yield('thumbnail')" data-react-helmet="true">
		@endif
		<meta property="og:title" content="@yield('title')" data-react-helmet="true">
		<meta property="og:type" content="website" data-react-helmet="true">
		<meta property="og:description" content="@yield('description')" data-react-helmet="true">
		<meta property="og:url" content="{{ Request::url() }}" data-react-helmet="true">
    @show

    @section('head:analytics')
        @if($tagManagerId)
            <!-- Google Tag Manager -->
            <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','{{ $tagManagerId }}');</script>
            <!-- End Google Tag Manager -->
        @endif
        @if($analyticsId)
            <!-- Global site tag (gtag.js) - Google Analytics -->
            <script async src="https://www.googletagmanager.com/gtag/js?id={{ $analyticsId }}"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '{{ $analyticsId }}');
            </script>
        @endif
    @show

    @section('head:styles')
		<!-- Head Style -->
        <link href="{{ asset('css/main.css') }}" rel="stylesheet" type="text/css" />
		@stack('styles:head')
	@show

	@section('head:scripts')
		<!-- Head Javascript -->
		@stack('scripts:head')
	@show

</head>
<body>
    @section('body:analytics')
        @if($tagManagerId)
            <!-- Google Tag Manager (noscript) -->
            <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ $tagManagerId }}"
            height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
            <!-- End Google Tag Manager (noscript) -->
        @endif
    @show

	@section('body')
		@yield('content')
	@show

	@section('body:scripts')
		<!-- Footer javascript -->
        <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Set,Map,WeakMap,Object.values,Object.entries,Intl,Intl.~locale.fr,Intl.~locale.en"></script>
		<script async src="{{ asset('js/main.js') }}" type="text/javascript"></script>
		@stack('scripts:footer')
	@show

    @section('body:styles')
		<!-- Footer styles -->
		@stack('styles:footer')
	@show

</body>
</html>
