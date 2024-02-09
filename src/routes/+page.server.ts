import { checkLoggedIn } from '$lib/db';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    const authTokenId = cookies.get('token');
    const loggedIn = await checkLoggedIn(authTokenId);

    return { loggedIn };
}) satisfies PageServerLoad;