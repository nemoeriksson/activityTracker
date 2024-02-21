
import { PrismaClient } from "@prisma/client";
import { Chart, type ChartConfiguration } from 'chart.js/auto';

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
	if (await prisma.authToken.findUnique({
		where: {
			id: id,
		}
	})) {
		return await prisma.authToken.delete({
			where: {
				id: id,
			}
		});
	}
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

export async function getActivities() {
	return await prisma.aktivitet.findMany({
		where: {
			approved: true
		}
	});
}

export async function completeActivity(activityId: number, username: string){
	const user = await prisma.user.findUnique({
		where: {
			username: username
		}
	})

	if(user){
		const existingPerformance = await prisma.performance.findFirst({
			where: {
				aktivitetId: activityId,
				userId: user.id
			}
		});
		
		if(!existingPerformance){
			await prisma.performance.create({
				data: {
					aktivitetId: activityId,
					userId: user.id
				}
			});
		}
	}
}

export async function createActivity(name: string, description: string, category: string, theme: string, user: any) {
	return await prisma.aktivitet.create({
		data: {
			name,
			description,
			sets: 0,
			reps: 0,
			category,
			userId: user.id,
			points: 0,
			approved: false,
		},
	});
}

export async function checkLoggedIn(authToken:string|undefined): Promise<Boolean>{
	if(!authToken) return false;

	const user = await getUserByAuthToken(authToken);
	return user ? true : false;
}

export async function generateRadarChart(user:any, ctx:CanvasRenderingContext2D){
	const data = {
		labels: [
			'Strength',
			'Endurance',
			'Yoga',
			'Cardio',
			'Other'
		],
		datasets: [{
			data: [25, 20, 50, 10, 0],
			fill: true,
			backgroundColor: '#8039df40',
			borderColor: '#8039df'
		}]
	  };
	const config:ChartConfiguration = {
		type: 'radar',
		data: data,
		options: {
		  	elements: {
				line: {
			  		borderWidth: 2
				}
		  	},
			plugins: {
				legend: {
					display: false
				},
				tooltip: {
					enabled: false
				},
				title: {
					text: 'Category Split',
					display: true,
					font: {
						size: 20
					},
					align: 'start',
					color: '#000'
				}
			},
			scales: {
				r: {
					suggestedMin: 0,
					ticks: {
						stepSize: 10,
						color: '#000'
					},
					pointLabels: {
						font: {
							size: 16,
						},
						color: '#000',
					}
				}
			}
		},
	};
	const chart = new Chart(ctx, config);
}
