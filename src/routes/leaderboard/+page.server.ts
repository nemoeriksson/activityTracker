import { prisma } from '$lib';
import { checkLoggedIn } from '$lib/db';
import type { PageServerLoad } from './$types';

interface Ranking {
    username: string,
    points: number
}

export const load = (async ({cookies}) => {
    const authTokenId = cookies.get('token');
    const loggedIn = await checkLoggedIn(authTokenId);

    const rankings:Ranking[] = [];
    const rankedUsers = new Map<string, number>();

    const unrankedUsers = await prisma.user.findMany({
        where: {
            performances: {
                none: {}
            }
        }
    });

    const performances = await prisma.performance.findMany({
        include: {
            aktivitet: true,
            user: true
        }
    });

    let cIndex = 0;
    performances?.forEach(performance => {
        let points = performance.aktivitet.points;
        const username = performance.user.username;

        let rankIndex:number|undefined = rankedUsers.get(username);
    
        if(!rankIndex){
            rankedUsers.set(username, ++cIndex); 
            rankings.push({
                username: username,
                points: points
            });
        } else {
            points = rankings[rankIndex].points + points;
            rankings[rankIndex] = {
                username: username,
                points: points
            } 
        }
    });

    unrankedUsers.forEach(user => {
        rankings.push({
            username: user.username,
            points: 0
        });
    });

    rankings.sort((a, b) => {
        if (a.points < b.points) return 1;
        if (a.points > b.points) return -1;
        return a.username.localeCompare(b.username);
    });

    return { loggedIn, rankings };
}) satisfies PageServerLoad;