<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Lang;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Auth\Notifications\ResetPassword as BaseResetPassword;

class ResetPassword extends BaseResetPassword implements ShouldQueue
{
    use Queueable;

    /**
     * Build the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        if (static::$toMailCallback) {
            return call_user_func(static::$toMailCallback, $notifiable, $this->token);
        }

        return (new MailMessage)
            ->subject(trans('notifications.reset_password_subject'))
            ->line(trans('notifications.reset_password_intro'))
            ->action(trans('notifications.reset_password_button'), url(config('app.url').route('auth.password.reset', $this->token, false)))
            ->line(trans('notifications.reset_password_expiration', ['count' => config('auth.passwords.users.expire')]))
            ->line(trans('notifications.reset_password_footer'));
    }
}
