import { getUserByAuthToken } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({cookies}) => {
	let token = cookies.get("token");
	if (!token) {
		throw redirect(303, "/login");
	}
	let user = await getUserByAuthToken(token);
	if (!user) {
		throw redirect(303, "/login");
	}
	return {username: user.username}
}) satisfies PageServerLoad;

export const actions: Actions = {
	logout: async ({cookies})=>{
		cookies.delete('token', {path: '/'});
		throw redirect(301, '/');
	}
};