import { prisma, getUserByAuthToken, createActivity, getUserById, getActivities, getYourActivities } from '$lib/db';
import { error } from '@sveltejs/kit';
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
	let activitiesPre = user.admin
		? await getActivities(false)
		: await getYourActivities(false, user);
	let activities = await Promise.all(
		activitiesPre.map(async (input) => {
			let object: any = input;
			let user = await getUserById(input.userId);
			object.creatorName = user ? user.username : "[deleted]";
			return object; 
		})
	);

	let users = user.admin ? await Promise.all(
		(await prisma.user.findMany({})).map(async (input) => {
			input.hash = "";
			input.salt = "";
			return input;
		})
	) : [];

    return { user: new_user, activities, users};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createActivity: async ({request, cookies}) => {
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
		
		let activity: any = await createActivity(name, description, "", user);
		activity.creatorName = user ? user.username : "[deleted]";

		let returnObject = {
			activity,
		};
		// the hell is happennin in here?
		return fail(418, {error: JSON.stringify(returnObject)});
	},
	changeActivityApprove: async ({request, cookies}) => {
		let token = cookies.get("token");
		if (!token) {
			throw redirect(303, "/login");
		}
		let user = await getUserByAuthToken(token);
		if (!user) {
			throw redirect(303, "/login");
		}
		if (!user.admin) {
			error(404, "you are not admin. how he do dis?");
		}

		let formData = await request.formData();
		let approved = formData.get("approved")=="true";
		let id = parseInt(formData.get("id")!.toString());
		await prisma.aktivitet.update({
			where: {
				id,
			},
			data: {
				approved,
			},
		});
		return fail(418, {error: "it did it"});
	},
	changeActivityPoint: async ({request, cookies}) => {
		let token = cookies.get("token");
		if (!token) {
			throw redirect(303, "/login");
		}
		let user = await getUserByAuthToken(token);
		if (!user) {
			throw redirect(303, "/login");
		}
		if (!user.admin) {
			error(404, "you are not admin. how he do dis?");
		}

		let formData = await request.formData();
		let number = parseInt(formData.get("number")!.toString());
		let id = parseInt(formData.get("id")!.toString());
		await prisma.aktivitet.update({
			where: {
				id,
			},
			data: {
				points: number,
			},
		});
	},
	changeUserAdminBool: async ({request, cookies}) => {
		let token = cookies.get("token");
		if (!token) {
			throw redirect(303, "/login");
		}
		let user = await getUserByAuthToken(token);
		if (!user) {
			throw redirect(303, "/login");
		}
		if (!user.admin) {
			error(404, "you are not admin. how he do dis?");
		}

		let formData = await request.formData();
		let admin = formData.get("admin") == "true";
		let id = parseInt(formData.get("id")!.toString());
		await prisma.user.update({
			where: {
				id,
			},
			data: {
				admin,
			},
		});
	},
};
