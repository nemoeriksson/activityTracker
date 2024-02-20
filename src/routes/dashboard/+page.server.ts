import { getUserByAuthToken, createActivity, getActivities, getUserById } from '$lib/db';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib';

export const load = (async ({cookies}) => {
	let token = cookies.get("token");
	if (!token) {
		throw redirect(303, "/login");
	}
	let user = await getUserByAuthToken(token);
	if (!user) {
		throw redirect(303, "/login");
	}
	let activites = await getActivities();
	return {username: user.username, activites}
}) satisfies PageServerLoad;

export const actions: Actions = {
	createActivity: async ({request, cookies}) => {
		console.log("gaming");
		let formData = await request.formData();
	
		let token = cookies.get("token");
		if (!token) {
			throw redirect(303, "/login");
		}
		let user = await getUserByAuthToken(token);
		if (!user) {
			throw redirect(303, "/login");
		}

		const name = formData.get('name')!.toString();
		const description = formData.get('description')!.toString();
		
		let activity: any = await createActivity(name, description, "", "", user);
		activity.creatorName = user ? user.username : "[deleted]";

		let returnObject = {
			activity,
		};
		return fail(418, {error: JSON.stringify(returnObject)});
	},
};
