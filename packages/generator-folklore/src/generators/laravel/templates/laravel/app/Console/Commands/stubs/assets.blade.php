@@section('assets:head')
@foreach ($entrypoints as $entrypoint)
    @if(preg_match('/\/runtime-/',  $entrypoint) === 0 && preg_match('/\.js/',  $entrypoint) === 1)
        <link href="/{{ $entrypoint }}" ref="preload" as="script" />
    @endif
    @if(preg_match('/\.css$/',  $entrypoint) === 1)
        <link href="/{{ $entrypoint }}" rel="stylesheet" type="text/css" />
    @endif
@endforeach
@@endsection

@@section('assets:body')
@foreach ($entrypoints as $entrypoint)
    @if(preg_match('/\.js$/',  $entrypoint) === 1)
        @if(preg_match('/\/runtime-/',  $entrypoint) === 1)
            <script type="text/javascript">{!! file_get_contents(public_path($entrypoint)) !!}</script>
        @else
            <script type="text/javascript" src="/{{ $entrypoint }}"></script>
        @endif
    @endif
@endforeach
@@endsection
