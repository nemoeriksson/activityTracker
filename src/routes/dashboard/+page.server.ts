import { getUserByAuthToken, createActivity, getActivities, getUserById } from '$lib/db';
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
	let activites = await Promise.all((await getActivities()).map(async (input) => {
		let object: any = input;
		let user = await getUserById(input.userId);
		object.creatorName = user ? user.username : "[deleted]";
		return object;
	}));
	return {username: user.username, activites}
}) satisfies PageServerLoad;
