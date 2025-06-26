import { initTRPC, TRPCError } from '@trpc/server';
import { auth } from '../auth';
import { headers } from 'next/headers';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
const t = initTRPC.create({});

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return {
        session,
    };
};

const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: {
            session: ctx.session,
            userId: ctx.session.user.id,
        },
    });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed); 