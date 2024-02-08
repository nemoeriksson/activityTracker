
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getUserByName(username: string) {
	const user = await prisma.user.findUnique({
		where: {
			username,
		},
	});
	return user;
}

export async function getUserById(id: number) {
	const user = await prisma.user.findUnique({
		where: {
			id,
		},
	});
	return user;
}

// https://developer.mozilla.org/en-US/docs/Glossary/Base64
function bytesToBase64(bytes: Uint8Array) {
	const binString = String.fromCodePoint(...bytes);
	return btoa(binString);
}

// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
async function sha256(message: string) {
    const msgBuffer = new TextEncoder().encode(message);                    
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function createSalt() {
	return await sha256(Math.random().toString());
}

export async function passwordToHash(password: string, salt: string) {
	return await sha256(password+salt);
}

export async function createUser(username: string, password: string) {
	let salt = await createSalt();
	const user = await prisma.user.create({
		data: {
			username: username,
			hash: await passwordToHash(password, salt),
			salt: salt,
		},
	});
	return user;
}

export async function deleteAuthToken(id: string) {
	return await prisma.authToken.delete({
		where: {
			id: id,
		}
	});
}

export async function createAuthToken(user: any) {
	let auth_token_id;
	while (true) {
		const bytes = crypto.getRandomValues(new Uint8Array(32));
		auth_token_id = bytesToBase64(bytes);

		let auth_token = await prisma.authToken.findUnique({
			where: {
				id: auth_token_id,
			}
		});
		if (!auth_token) {
			break;
		}
	}
	return await prisma.authToken.create({
		data: {
			id: auth_token_id,
			userId: user.id,
		},
	});
}

export async function getUserByAuthToken(auth_token_id: string) {
	const auth_token = await prisma.authToken.findUnique({
		where: {
			id: auth_token_id,
		},
		include: {
			user: true,
		},
	});
	if (!auth_token) {
		return null;
	}
	return auth_token.user;
}

export async function validatePassword(user:any, password:string) {
	return user.hash == await passwordToHash(password, user.salt);
}
