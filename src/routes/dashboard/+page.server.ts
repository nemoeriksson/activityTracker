import { getUserByAuthToken, getActivities, completeActivity, findSubmissions, getPoints } from '$lib/db';
import { redirect, type Actions } from '@sveltejs/kit';
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
	const submissionCount = await findSubmissions(user.username)
	const activites = await getActivities();
	const points = await getPoints(user.id);
	return {username: user.username, points: points, submitted: submissionCount, activites}
}) satisfies PageServerLoad;

export const actions: Actions = {
	complete: async ({request})=>{
		const data = await request.formData();
		const activityId = parseInt(data.get('activityId')!.toString());
		const username = data.get('username')!.toString();

		completeActivity(activityId, username);
	}
};
