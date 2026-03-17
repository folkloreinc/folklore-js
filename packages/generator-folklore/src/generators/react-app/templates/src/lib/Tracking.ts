import { Tracking as BaseTracking } from '@folklore/tracking';

class Tracking extends BaseTracking {
    user: User | null;
    identified: boolean;
    options: BaseTracking['options'] & {
        user?: User | null;
    };

    constructor(opts = {}) {
        super(opts);

        this.user = null;
        this.identified = false;

        const { user = null } = this.options;
        if (user !== null) {
            this.setUser(user);
        }
    }

    setUser(user) {
        if (user === this.user && this.identified) {
            return;
        }

        this.user = user;
        this.identified = true;

        this.pushEventNow('identify', {
            identified: true,
            userId: user !== null ? user.id : null,
            user_id: user !== null ? user.id : null,
            user,
        });
    }
}

export default Tracking;
