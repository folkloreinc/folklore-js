<?php

namespace App\Repositories;

use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use App\Contracts\Repositories\Users as UsersRepositoryContract;
use App\Models\User as UserModel;
use App\Contracts\Resources\User as UserContract;
use App\Contracts\Resources\Resourcable;
use Illuminate\Contracts\Hashing\Hasher;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Auth\EloquentUserProvider;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use App\Contracts\Services\Newsletter as NewsletterService;
use App\Repositories\Concerns\SyncRelations;
use App\Repositories\Concerns\UsesDataColumn;

class UsersRepository extends ModelResourcesRepository implements UsersRepositoryContract
{
    use UsesDataColumn, SyncRelations;

    public const MEDIAS_PATH = ['image'];

    protected $medias;

    protected $userProvider;

    protected $newsletterService;

    protected $contentRepository;

    public function __construct(Hasher $hasher, NewsletterService $newsletterService)
    {
        $this->userProvider = new EloquentUserProvider($hasher, UserModel::class);
        $this->newsletterService = $newsletterService;
    }

    protected function newModel(): UserModel
    {
        return new UserModel();
    }

    protected function newQuery($params = null)
    {
        return parent::newQuery($params)->with('medias', 'medias.files', 'medias.metadatas');
    }

    public function findById(string $id): ?UserContract
    {
        return parent::findById($id);
    }

    public function findByEmail(string $email): ?UserContract
    {
        $model = $this->newQuery()
            ->where('email', 'LIKE', $email)
            ->first();
        return $model instanceof Resourcable ? $model->toResource() : $model;
    }

    public function findByName(string $name): ?UserContract
    {
        $model = $this->newQuery()
            ->where('name', $name)
            ->first();
        return $model instanceof Resourcable ? $model->toResource() : $model;
    }

    public function findBySocialiteUser(string $provider, SocialiteUser $user): ?UserContract
    {
        $model = $this->newQuery()
            ->where('socialite_provider', $provider)
            ->where('socialite_id', $user->getId())
            ->first();
        return $model instanceof Resourcable ? $model->toResource() : $model;
    }

    public function create(array $data): UserContract
    {
        if (!isset($data['role'])) {
            $data['role'] = 'guest';
        }
        $data['isNew'] = true;
        return parent::create($data);
    }

    public function createFromSocialiteUser(
        string $provider,
        SocialiteUser $user,
        array $data = []
    ): UserContract {
        $data['socialite_provider'] = $provider;
        $data['socialite_id'] = $user->getId();
        $data['name'] = $user->getName();
        $data['email'] = $user->getEmail();
        return $this->create($data);
    }

    public function update(string $id, array $data): ?UserContract
    {
        $userResource = parent::update($id, $data);
        if (app()->environment() === 'production') {
            $this->updateNewsletter($userResource);
        }
        return $userResource;
    }

    public function updateFromSocialiteUser(
        string $id,
        string $provider,
        SocialiteUser $user
    ): ?UserContract {
        $data = [];
        $data['socialite_provider'] = $provider;
        $data['socialite_id'] = $user->getId();
        return $this->update($id, $data);
    }

    public function updatePassword(string $id, string $password): ?UserContract
    {
        return $this->update($id, [
            'password' => $password,
        ]);
    }

    protected function updateNewsletter(UserContract $user)
    {
        $newsletter = $user->newsletter();
        $listId = config('services.mailchimp.list_id');
        if ($newsletter) {
            $this->newsletterService->subscribe($user, $listId);
        } else {
            $this->newsletterService->unsubscribe($user, $listId);
        }
    }

    protected function removeFromNewsletter(UserContract $user)
    {
        $listId = config('services.mailchimp.list_id');
        $this->newsletterService->unsubscribe($user, $listId);
    }

    public function destroy(string $id): bool
    {
        $userResource = $this->findById($id);
        if (is_null($userResource)) {
            return false;
        }
        if (app()->environment() === 'production') {
            $this->removeFromNewsletter($userResource);
        }
        return parent::destroy($id);
    }

    protected function fillModel($model, array $data)
    {
        // In case of an email change reset the verification
        $email = data_get($data, 'email');
        if (!is_null($email) && $email !== $model->email) {
            $model->email_verified_at = null;
        }

        $model->fill(Arr::only($data, $model->getFillable()));

        if (isset($data['password']) && !empty($data['password'])) {
            $model->password = Hash::make($data['password']);
        }

        if (isset($data['email_verified']) && !empty($data['email_verified'])) {
            $model->email_verified_at = Carbon::now();
        }

        if (isset($data['role'])) {
            $model->role = $data['role'];
        }

        $newData = Arr::only($data, $model->getDataFields());

        $newData = $this->replaceRelationsByPath(self::MEDIAS_PATH, $newData, 'media');

        $model->data = array_merge($model->data ?? [], $newData);
    }

    protected function syncRelations($model, array $data)
    {
        $mediaIds = $this->getRelationIds(self::MEDIAS_PATH, $data);
        $model->medias()->sync($mediaIds);
        $model->refresh();
    }

    protected function buildQueryFromParams($query, $params)
    {
        if (isset($params['search'])) {
            $modelClass = get_class($this->newModel());
            return $modelClass::search($params['search']);
        }

        if (isset($params['ids']) && !empty($params['ids'])) {
            $ids = $this->getParamIds($params['ids']);
            $query->whereIn('id', $ids);
        }

        if (isset($params['email'])) {
            $query->where('email', 'LIKE', $params['email']);
        }

        if (isset($params['role'])) {
            $query->where('role', $params['role']);
        }

        if (isset($params['with_shift72_purchases']) && $params['with_shift72_purchases']) {
            $query->whereHas('purchases.items', function ($query) {
                $query->where('purchases.confirmed', true);
                $query->where('purchases_items.type', 'shift72');
            });
        }

        if (isset($params['order']) && is_array($params['order'])) {
            $query->orderBy($params['order'][0], $params['order'][1]);
        } elseif (isset($params['order'])) {
            $query->orderBy($params['order'], 'ASC');
        }

        $query = parent::buildQueryFromParams($query, $params);

        return $query;
    }

    public function connectUser(UserContract $user)
    {
        $model = $this->findModelById($user->id());
        $model->connected_at = $model->freshTimestamp();
        $model->save();
    }

    /**
     * Retrieve a user by their unique identifier.
     *
     * @param  mixed  $identifier
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function retrieveById($identifier)
    {
        $model = $this->userProvider->retrieveById($identifier);
        return !is_null($model) && $model instanceof Resourcable ? $model->toResource() : null;
    }

    /**
     * Retrieve a user by their unique identifier and "remember me" token.
     *
     * @param  mixed  $identifier
     * @param  string  $token
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function retrieveByToken($identifier, $token)
    {
        $model = $this->userProvider->retrieveByToken($identifier, $token);
        return !is_null($model) && $model instanceof Resourcable ? $model->toResource() : null;
    }

    /**
     * Update the "remember me" token for the given user in storage.
     *
     * @param  \Illuminate\Contracts\Auth\Authenticatable  $user
     * @param  string  $token
     * @return void
     */
    public function updateRememberToken(Authenticatable $user, $token)
    {
        if (!is_null($user)) {
            $id = $user instanceof UserContract ? $user->id() : $user->id;
            $model = $this->findModelById($id);
            return $this->userProvider->updateRememberToken($model, $token);
        }
    }

    /**
     * Retrieve a user by the given credentials.
     *
     * @param  array  $credentials
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function retrieveByCredentials(array $credentials)
    {
        $model = $this->userProvider->retrieveByCredentials($credentials);

        $resource = !is_null($model) && $model instanceof Resourcable ? $model->toResource() : null;

        return $resource;
    }

    /**
     * Validate a user against the given credentials.
     *
     * @param  \Illuminate\Contracts\Auth\Authenticatable  $user
     * @param  array  $credentials
     * @return bool
     */
    public function validateCredentials(Authenticatable $user, array $credentials)
    {
        return $this->userProvider->validateCredentials($user, $credentials);
    }
}
