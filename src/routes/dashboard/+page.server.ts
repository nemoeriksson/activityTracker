import { getUserByAuthToken, getActivities } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({cookies}) => {
	let token = cookies.get("token");
	if (!token) {
		throw redirect(303, "/login");
	}
	let user = await getUserByAuthToken(token);
	if (!user) {
		throw redirect(303, "/login");
	}
	let activites = await getActivities(true);
	return {username: user.username, activites}
}) satisfies PageServerLoad;
