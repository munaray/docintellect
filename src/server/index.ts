import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession()
    const user = getUser()

    if (!user.id || !user.email)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    // check user in db if not exist
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id
      }
    })

    if (!dbUser) {
      // create db if user does not exit
      db.user.create({
        data: {
          id: user.id,
          email: user.email
        }
      })
    }
  })
});

export type AppRouter = typeof appRouter;