<?php

namespace App\Panneau;

use Illuminate\Support\ServiceProvider as BaseServiceProvider;
use Illuminate\Contracts\View\Factory as ViewFactory;
use Illuminate\Support\Facades\Gate;
use Panneau\Fields\Upload as UploadField;
use Panneau\Support\LocalizedField;
use Folklore\Panneau\Fields\PageSlug as PageSlugField;
use Panneau\Support\Facade as Panneau;

use Illuminate\Http\Request;
use Laravel\Fortify\Fortify;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class PanneauServiceProvider extends BaseServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        Gate::policy(\Panneau\Panneau::class, \App\Panneau\Policies\PanneauPolicy::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->bootFields();
        $this->bootViews();
        $this->bootAuth();
    }

    protected function bootFields()
    {
        $this->app->booted(function () {
            LocalizedField::setLocalesResolver(function () {
                return config('locale.locales');
            });

            UploadField::setEndpoint(route('panneau.upload'));

            PageSlugField::setRoutesResolver(function ($locale) {
                return [
                    'page' => url()->routeForReactRouter($locale . '.page', [
                        'withoutPatterns' => config('panneau.routes.without_patterns', true),
                    ]),
                    'page_with_parent' => url()->routeForReactRouter(
                        $locale . '.page_with_parent',
                        [
                            'withoutPatterns' => config('panneau.routes.without_patterns', true),
                        ]
                    ),
                ];
            });
        });
    }

    protected function bootViews()
    {
        $view = $this->app[ViewFactory::class];

        // Panneau
        $view->composer('panneau::app', \App\Panneau\Composers\AppComposer::class);

        Panneau::serving(function () use ($view) {
            $view->composer('errors::*', \Panneau\Composers\PanneauComposer::class);
            $view->composer('errors::*', \Panneau\Composers\AppComposer::class);
            $view->composer('errors::*', \App\Panneau\Composers\AppComposer::class);
        });
    }

    protected function bootAuth()
    {
        Fortify::authenticateUsing(function (Request $request) {
            $user = User::where('email', $request->email)->first();
            if (!is_null($user) && Hash::check($request->password, $user->password)) {
                return $user;
            }
        });
    }
}
