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

    @section('head:analytics')
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

	<link rel="shortcut icon" href="{{ asset('favicon.gif') }}" type="image/x-ico">
	<link rel="icon" href="{{ asset('favicon.png') }}" type="image/png">

    @section('head:styles')
		<!-- Head Style -->
		@stack('styles:head')
	@show

	@section('head:scripts')
		<!-- Head Javascript -->
		@stack('scripts:head')
	@show

</head>
<body>

	@section('body')
		@yield('content')
	@show



    @section('body:styles')
        <noscript id="deferred-styles">
    		<!-- CSS -->
            @if(app()->environment() !== 'local')
    		<link href="{{ asset('css/main.css') }}" rel="stylesheet" type="text/css" />
            @endif
    		@stack('styles:body')
        </noscript>
        <script type="text/javascript">
            var loadDeferredStyles = function() {
                var addStylesNode = document.getElementById("deferred-styles");
                var replacement = document.createElement("div");
                replacement.innerHTML = addStylesNode.textContent;
                document.body.appendChild(replacement)
                addStylesNode.parentElement.removeChild(addStylesNode);
            };
            var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            if (raf) raf(function() { window.setTimeout(loadDeferredStyles, 0); });
            else window.addEventListener('load', loadDeferredStyles);
        </script>
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
