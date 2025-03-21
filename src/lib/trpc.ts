// utils/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { AppRouter } from '@/server/api/root';
import SuperJSON from 'superjson';
export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser should use relative url
    return '';
  }
  if (process.env.VERCEL_URL) {
    // Reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    // Reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }
  // Assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
        transformer: SuperJSON,
    }),
  ],
});
