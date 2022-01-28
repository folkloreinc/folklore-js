<?php

namespace App\Contracts\Resources;

use Carbon\Carbon;
use Panneau\Contracts\ResourceItem;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Contracts\Auth\MustVerifyEmail;

interface User extends
    Resource,
    ResourceItem,
    Authorizable,
    Authenticatable,
    CanResetPassword,
    MustVerifyEmail
{
    public function id(): string;

    public function getKey(): string;

    public function role(): ?string;

    public function name(): ?string;

    public function email(): string;

    public function country(): ?string;

    public function postalCode(): ?string;

    public function newsletter(): bool;

    public function hasVerifiedEmail(): bool;

    public function isNew(): bool;

    public function loginProvider(): ?string;

    public function sendPurchaseConfirmedNotification(Purchase $purchase, $locale = null): void;

    public function purchases(): Collection;

    public function createdAt(): ?Carbon;
}
