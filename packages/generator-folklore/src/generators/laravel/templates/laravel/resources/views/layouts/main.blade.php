<!doctype html>
<!--[if IE ]> <html class="ie" lang="{{ $locale }}"> <![endif]-->
<!--[if !(IE) ]><!--> <html lang="{{ $locale }}"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    @include('meta.all')

    @include('analytics.head')

    @yield('assets:head')
</head>
<body>
    @include('analytics.body')

    <!-- Body -->
	@section('body')
		@yield('content')
	@show

    @yield('assets:body')
</body>
</html>
