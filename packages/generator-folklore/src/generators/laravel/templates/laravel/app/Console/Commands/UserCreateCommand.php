<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Hackzilla\PasswordGenerator\Generator\HybridPasswordGenerator;
use App\User;

class UserCreateCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create {email?} {--name=} {--password=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a user';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $email = $this->argument('email');
        $name = $this->option('name');
        $password = $this->option('password');

        if (empty($email)) {
            $email = $this->ask('Enter the email address');
        }

        if (empty($name)) {
            $name = $this->ask('Enter the name');
        }

        if (empty($password)) {
            $password = $this->ask('Enter the password (leave empty for auto-generated)', $this->generatePassword());
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => bcrypt($password)
        ]);

        $this->info('User #'.$user->id.' created.');
        $this->line('<info>Email:</info> '.$user->email);
        $this->line('<info>Name:</info> '.$user->name);
        $this->line('<info>Password:</info> '.$password);
    }

    protected function generatePassword()
    {
        $generator = new HybridPasswordGenerator();
        $generator
            ->setUppercase()
            ->setLowercase()
            ->setNumbers()
            ->setSymbols(false)
            ->setSegmentLength(3)
            ->setSegmentCount(4)
            ->setSegmentSeparator('-');
        return $generator->generatePassword();
    }
}
