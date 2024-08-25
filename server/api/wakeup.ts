import { defineEventHandler } from 'h3';
import prisma from '../data/prisma';

export default defineEventHandler(async (event) => {
    const obj = await prisma.Bs.create({
        data: {
            name: 'name',
        },
        select: {
            id: true,
        },
    });
    await prisma.Bs.delete({
        where: {
            id: obj.id,
        },
    });

    return {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
    };
});