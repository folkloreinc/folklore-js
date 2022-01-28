<?php

namespace App\Contracts\Repositories;

interface Repository
{
    public function get(array $query = [], ?int $page = null, ?int $count = 10);
    
    public function setGlobalQuery(array $query);
}
