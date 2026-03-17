<title>{{ $title }}</title>

<meta name="language" content="{{ $locale }}">
<meta name="description" content="{{ $description }}">

@if (isset($keywords) && sizeof($keywords))
<meta name="keywords" content="{{ $keywords->implode(',') }}">
@endif

<link rel="shortcut icon" href="{{ asset('static/media/favicon/favicon.ico') }}" type="image/x-ico">
<link rel="icon" href="{{ asset('static/media/favicon/favicon.png') }}" type="image/png">
