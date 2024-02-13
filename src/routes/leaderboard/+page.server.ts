import { prisma } from '$lib';
import type { PageServerLoad } from './$types';

export const load = (async () => {

    let ranking = [];

    let rankers = await prisma.user.findMany({
    })
    return {rankers};
}) satisfies PageServerLoad;