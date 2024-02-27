import type {Actions, PageServerLoad} from './$types';
import {getUserByName, createUser, passwordToHash, deleteAuthToken, createAuthToken, validatePassword, getUserByAuthToken} from "$lib/server/db";
import {fail, redirect} from "@sveltejs/kit";

const expirationTime = 30 * 3600 * 24;
const redirectionTarget = '/dashboard';

export const load = (async ({cookies}) => {
	const authTokenId = cookies.get('token');

	if(authTokenId){
		const user = await getUserByAuthToken(authTokenId);
		if(user)
			throw redirect(301, redirectionTarget);
	}

	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	register: async({request, cookies}) => {
		const data = await request.formData();
		const username = data.get('username')!.toString();

		const password = data.get('password')!.toString();
		const passwordConfirm = data.get('password-confirm')!.toString();

		const existingUser = await getUserByName(username);

		if(existingUser)
			return fail(403, {error: 'Username taken', errorType: 1});

		else if(password != passwordConfirm)
			return fail(422, {error: 'Passwords do not match', errorType: 2});
		
		const user = await createUser(username, password);
		const authToken = await createAuthToken(user);

		cookies.set('token', authToken.id, {secure: false, path: '/', expires:new Date(Date.now() + expirationTime)});
		
		throw redirect(301, redirectionTarget);
	},
	login: async({request, cookies}) => {
		const data = await request.formData();
		const username = data.get('username')!.toString();
		const password = data.get('password')!.toString();

		const existingUser = await getUserByName(username);

		if(!existingUser)
			return fail(403, {error: 'Incorrect validation input', errorType: 3});

		const validPassword = await validatePassword(existingUser, password);
		
		if(validPassword){
			const authToken = await createAuthToken(existingUser);
			cookies.set('token', authToken.id, {secure: false, path: '/', expires:new Date(Date.now() + expirationTime)});
			
			throw redirect(301, redirectionTarget);
		}
		return fail(403, {error: "inccorect Password"})
	}
};
