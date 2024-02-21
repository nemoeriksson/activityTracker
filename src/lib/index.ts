import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

const tiers = {
    0: 'Beginner',
    25: 'Interested',
    50: 'Enthusiast',
    100: 'Trained',
    250: 'Athlete',
    500: 'Professional'
}

export function getTier(points:number){
    let result = '';
    Object.entries(tiers).forEach(([pointRequirement, title]) => {
        if (points >= parseInt(pointRequirement)){
            result = title;
        }
    });
    return result;
}

