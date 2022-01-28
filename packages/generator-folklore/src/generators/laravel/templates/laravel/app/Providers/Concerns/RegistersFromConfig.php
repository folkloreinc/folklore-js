<?php

namespace App\Providers\Concerns;

trait RegistersFromConfig
{
    protected function registerConfigInjections($classes, $injections)
    {
        foreach ($injections as $variable => $configKey) {
            $this->app
                ->when($classes)
                ->needs($variable)
                ->give(function () use ($configKey) {
                    return $this->app['config']->get($configKey);
                });
        }
    }
}
