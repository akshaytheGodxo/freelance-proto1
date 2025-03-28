import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { employerRouter } from "./routers/employer";
import { freelancerRouter } from "./routers/freelancer";
import { notificationRouter } from "./routers/notification";
import { mainRouter } from "./routers/main";
import { paymentRouter } from "./routers/payment";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  empl: employerRouter,
  frel: freelancerRouter,
  main: mainRouter,
  notif: notificationRouter,
  payment: paymentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
