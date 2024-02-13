import { checkLoggedIn } from '$lib/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    const authTokenId = cookies.get('token');
    const loggedIn = await checkLoggedIn(authTokenId);

    return { loggedIn };
}) satisfies PageServerLoad;

export const actions: Actions = {
    logout: async ({request, cookies})=>{
        const data = await request.formData();
        const isHomepage = data.get('origin')!.toString() == '/';
        
        cookies.delete('token', {path: '/'});
        
        if(isHomepage) return fail(403, {status: 'reload'});

        throw redirect(301, '/');
    }
};