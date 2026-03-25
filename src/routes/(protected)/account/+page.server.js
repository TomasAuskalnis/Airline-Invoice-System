import { redirect } from '@sveltejs/kit';

import { auth } from '$lib/server/auth';

export const load = async (event) => {
    if (!event.locals.user) {
        return redirect(302, '/auth/better-auth/login');
    }
    return { user: event.locals.user };
};