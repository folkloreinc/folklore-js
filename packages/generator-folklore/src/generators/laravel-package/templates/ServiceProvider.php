<?php namespace <%= namespace %>;

use Illuminate\Support\ServiceProvider as BaseServiceProvider;

class <%= baseClassName %>ServiceProvider extends BaseServiceProvider
{

    /**
     * Indicates if loading of the provider is deferred.
     *
     * @var bool
     */
    protected $defer = false;

    protected function getRouter()
    {
        return $this->app['router'];
    }

    /**
     * Bootstrap the application events.
     *
     * @return void
     */
    public function boot()
    {
        $this->bootPublishes();
    }

    public function bootPublishes()
    {
        // Config file path
        $configPath = __DIR__ . '/../../config/config.php';
        $viewsPath = __DIR__ . '/../../resources/views/';
        $langPath = __DIR__ . '/../../resources/lang/';

        // Merge files
        $this->mergeConfigFrom($configPath, '<%= baseName %>');

        // Publish
        $this->publishes([
            $configPath => config_path('<%= baseName %>.php')
        ], 'config');

        $this->publishes([
            $viewsPath => base_path('resources/views/vendor/<%= basePath %>')
        ], 'views');

        $this->publishes([
            $langPath => base_path('resources/lang/vendor/<%= basePath %>')
        ], 'lang');
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {

    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return [];
    }
}
