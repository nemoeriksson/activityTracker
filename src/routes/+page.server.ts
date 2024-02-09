import { checkLoggedIn } from '$lib/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    const authTokenId = cookies.get('token');
    const loggedIn = await checkLoggedIn(authTokenId);

    return { loggedIn };
}) satisfies PageServerLoad;

export const actions: Actions = {
    logout: async ({cookies})=>{
        cookies.delete('token', {path: '/'});
        return fail(403, {status: 'reload'});
    }
};