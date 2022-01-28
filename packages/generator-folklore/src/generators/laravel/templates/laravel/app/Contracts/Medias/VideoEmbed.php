<?php

namespace App\Contracts\Medias;

interface VideoEmbed extends Video
{
    public function iframeUrl(): string;

    public function provider(): string;

    public function live(): bool;
}
