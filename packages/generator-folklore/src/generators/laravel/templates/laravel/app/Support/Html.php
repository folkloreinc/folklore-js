<?php

namespace App\Support;

use HTMLPurifier;
use HTMLPurifier_Config;

class Html
{
    protected static $purifier;

    public static function clean($text)
    {
        if (!isset(self::$purifier)) {
            $storagePath = storage_path('app/htmlpurifier');
            if (!file_exists($storagePath)) {
                mkdir($storagePath, 0777, true);
            }

            $config = HTMLPurifier_Config::createDefault();
            $config->set('HTML.Allowed', 'div,p,b,a[href],i,br,img[src],strong');
            $config->set('Core.Encoding', 'UTF-8');
            $config->set('Cache.SerializerPath', $storagePath);
            // $config->set('URI.Base', 'http://www.example.com');
            // $config->set('URI.MakeAbsolute', false);
            self::$purifier = new HTMLPurifier($config);
        }

        if (!is_string($text)) {
            return $text;
        }

        return self::$purifier->purify($text);
    }
}
