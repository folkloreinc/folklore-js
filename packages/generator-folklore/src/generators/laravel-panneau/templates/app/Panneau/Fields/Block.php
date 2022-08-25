<?php

namespace App\Panneau\Fields;

use Panneau\Fields\ResourceItem;

class Block extends ResourceItem
{
    public function resource(): string
    {
        return 'blocks';
    }

    public function attributes(): ?array
    {
        return array_merge(parent::attributes(), [
            'placeholder' => trans('panneau.fields.blocks_placeholder'),
            'itemLabelPath' => 'title',
            'itemDescriptionPath' => null,
        ]);
    }
}
