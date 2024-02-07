import type {Actions} from './$types';
import {getUserByName, createUser, passwordToHash, deleteAuthToken, createAuthToken} from "$lib/db";
import {redirect} from "@sveltejs/kit";

import { error } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({cookies, request}) => {
		let tokenStr = cookies.get("token");
		if (tokenStr != undefined) {
			await deleteAuthToken(tokenStr);
		}
		let form_data = await request.formData();
		let username = form_data.get("username")?.toString();
		let password = form_data.get("password")?.toString();
		if (!username) return; // unreachable
		if (!password) return; // unreachable
		
		console.log(username, password);

		let user = await getUserByName(username);
		if (form_data.get("login")) {
			if (user) {
				if (await passwordToHash(password, user.salt) == user.hash) {
				}
			} else {
				throw error(404, "user does not exist");
			}
		} else {
			if (user) {
				throw error(404, "user already exists");
			} else {
				user = await createUser(username, password);
			}
		}
		if (user) {
			let expireDate = new Date();
			expireDate.setFullYear(expireDate.getFullYear()+1);
			let token = await createAuthToken(user);
			cookies.set("token", token.id, {
				path: "/",
				expires: expireDate,
			});
			throw redirect(303, "/");
		}
	},
};
