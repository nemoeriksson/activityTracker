import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserByAuthToken } from '$lib/db';

export const load = (async ({cookies}) => {
    const authTokenId = cookies.get('token');

    if(!authTokenId)
        throw redirect(301, '/');

	if(authTokenId){
		const user = await getUserByAuthToken(authTokenId);
		if(!user)
			throw redirect(301, '/');
	}

    return {};
}) satisfies PageServerLoad;