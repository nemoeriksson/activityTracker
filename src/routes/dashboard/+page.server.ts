import { getUserByAuthToken, getActivities, findSubmissions } from '$lib/db';
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
	let sub = await findSubmissions(user.username)
	let activites = await getActivities();
	return {username: user.username, point: user.points, submited: sub, activites}
}) satisfies PageServerLoad;

