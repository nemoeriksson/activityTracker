import { prisma, getUserByAuthToken, createActivity, getUserById, getActivities, getYourActivities, getUnnaprovedActivities, getAllUsers } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { redirect, fail } from '@sveltejs/kit';

export const load = (async ({ cookies }) => {
    const authTokenId = cookies.get('token');
	if (!authTokenId) throw redirect(301, '/');
	
	const user = await getUserByAuthToken(authTokenId);
	if (!user) throw redirect(301, '/');
	
	let activities = <any>[];
	let users = <any>[];

	if(user.admin){
		activities = await getUnnaprovedActivities();
		users = await getAllUsers();
	}

    return { isAdmin: user.admin, userId: user.id,  activities, users };
}) satisfies PageServerLoad;

export const actions: Actions = {
	createActivity: async ({request, cookies}) => {
		const data = await request.formData();
	
		const token = cookies.get("token");
		if (!token) {
			throw redirect(303, "/login");
		}
		const user = await getUserByAuthToken(token);
		if (!user) {
			throw redirect(303, "/login");
		}

		const title = data.get('title')!.toString();
		const description = data.get('description')!.toString();
		const category = data.get('category')!.toString();
		const reps = parseInt(data.get('reps')?.toString() || '0')	
		const sets = parseInt(data.get('sets')?.toString() || '0');

		await prisma.aktivitet.create({
			data: {
				name: title,
				description: description,
				sets: sets == 0 ? undefined : sets,
				reps: reps == 0 ? undefined : reps,
				category: category,
				userId: user.id
			}
		});

		throw redirect(302, '/dashboard');
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
	toggleAdminRole: async ({request, cookies}) => {
		const token = cookies.get("token");
		if (!token) {
			throw redirect(303, "/login");
		}
		
		const user = await getUserByAuthToken(token);
		if (!user) {
			throw redirect(303, "/login");
		}
		if (!user.admin) {
			error(404, "you are not admin. how he do dis?");
		}

		const formData = await request.formData();
		const isAdmin = formData.get("admin") == "true";
		const userId = parseInt(formData.get("userId")!.toString());
		
		const updatedUser = await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				admin: !isAdmin,
			},
		});
	},
};
