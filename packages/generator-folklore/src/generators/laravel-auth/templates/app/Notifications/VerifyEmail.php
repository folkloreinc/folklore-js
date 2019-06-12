<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class VerifyEmail extends BaseVerifyEmail implements ShouldQueue
{
    use Queueable;

    /**
     * Get the notification email messages
     *
     * @return array
     */
    protected function mailMessages()
    {
        return [
            'subject' => trans('notifications.verify_subject'),
            'intro' => trans('notifications.verify_intro'),
            'button' => trans('notifications.verify_button'),
            'footer' => trans('notifications.verify_footer'),
        ];
    }

    /**
     * Build the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        if (static::$toMailCallback) {
            return call_user_func(static::$toMailCallback, $notifiable);
        }

        $messages = $this->mailMessages();
        return (new MailMessage())
            ->subject($messages['subject'])
            ->line($messages['intro'])
            ->action($messages['button'], $this->verificationUrl($notifiable))
            ->line($messages['footer']);
    }

    /**
     * Get the verification URL for the given notifiable.
     *
     * @param  mixed  $notifiable
     * @return string
     */
    protected function verificationUrl($notifiable)
    {
        return URL::temporarySignedRoute(
            'auth.verification.verify',
            Carbon::now()->addMinutes(config('auth.verification.expire', 60 * 10)),
            ['id' => $notifiable->getKey()]
        );
    }
}
