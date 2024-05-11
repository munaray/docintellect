import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';

const t = initTRPC.create();

/* Creating a private procedure */
const middleware = t.middleware
const isAuth = middleware(async (options) => {
    const { getUser } = getKindeServerSession()
    const user = getUser()

    if (!user || !user.id) throw new TRPCError({ code: "UNAUTHORIZED" })
    return options.next({
        ctx: {
            userId: user.id,
            user
        }
    })
})

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth)