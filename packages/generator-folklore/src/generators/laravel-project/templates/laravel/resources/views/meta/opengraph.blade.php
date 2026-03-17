<!-- Open Graph -->
<meta property="og:locale" content="{{$locale}}">
<meta property="og:title" content="{{ $title }}">
<meta property="og:type" content="website">
<meta property="og:description" content="{{ $description }}">
<meta property="og:url" content="{{ $url }}">
@if(isset($image))
    <meta property="og:image" content="{{ $image }}">
@endif
