<?php

namespace App\Contracts\Resources;

interface Pageable
{
    public function pageType(): string;

    public function url(string $locale, bool $absolute = false): string;

    public function metadata(): PageMetadata;
}
