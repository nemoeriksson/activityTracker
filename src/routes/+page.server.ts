import type {PageServerLoad} from "./$types";
import { error } from '@sveltejs/kit';
import {redirect} from "@sveltejs/kit";

import {getUserByAuthToken} from "$lib/db";

import {
} from "$lib/db";

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
