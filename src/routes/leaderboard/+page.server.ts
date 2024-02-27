import { prisma } from '$lib/server/db';
import { checkLoggedIn, findSubmissions } from '$lib/server/db';
import type { PageServerLoad } from './$types';

interface Ranking {
    username: string,
    points: number,
    submissions: number,
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
        },
    });

    const performances = await prisma.performance.findMany({
        include: {
            aktivitet: true,
            user: true
        }
    });

    const submissions = await prisma.aktivitet.findMany({
        where: {
            approved: true
        },
        include: {
            creator: true
        }
    });

    let cIndex = 0;
    performances?.forEach(async performance => {
        let points = performance.aktivitet.points;
        const username = performance.user.username;

        let rankIndex:number|undefined = rankedUsers.get(username);
    
        if(!rankIndex){
            rankedUsers.set(username, ++cIndex); 
            rankings.push({
                username: username,
                points: points,
                submissions: 0
            });
        } else {
            points = rankings[rankIndex].points + points;
            rankings[rankIndex] = {
                username: username,
                points: points,
                submissions: 0
            } 
        }
    });

    unrankedUsers.forEach(async user => {
        rankings.push({
            username: user.username,
            points: 0,
            submissions: 0
        });
    });

    rankings.sort((a, b) => {
        if (a.points < b.points) return 1;
        if (a.points > b.points) return -1;
        return a.username.localeCompare(b.username);
    });

    if(submissions){
        submissions.forEach(submission => {
            let rankIndex:number|undefined = rankedUsers.get(submission.creator.username);
            if(rankIndex)
                rankings[rankIndex-1].submissions += 1;
        });
    }
    
    return { loggedIn, rankings };
}) satisfies PageServerLoad;
