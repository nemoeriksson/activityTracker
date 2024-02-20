import { getUserByAuthToken, createActivity, getUserById, getActivities } from '$lib/db';
import type { Actions, PageServerLoad } from './$types';

import { redirect, fail } from '@sveltejs/kit';

export const load = (async ({ cookies }) => {
    const authTokenId = cookies.get('token');
	if (!authTokenId) throw redirect(301, '/');
	const user = await getUserByAuthToken(authTokenId);
	if (!user) throw redirect(301, '/');
	let new_user = {
		admin: user.admin,
		username: user.username,
	};
	let activites = await Promise.all((await getActivities()).map(async (input) => {
		let object: any = input;
		let user = await getUserById(input.userId);
		object.creatorName = user ? user.username : "[deleted]";
		return object;
	}));

    return { user: new_user, activites };
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