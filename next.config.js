/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'assets.aceternity.com',
              port: '',
              pathname: '/**', // This allows all paths under the hostname
            },
            {
              protocol: 'https',
              hostname: 'stock.adobe.com',
              port: '',
              pathname: '/**',
            },
            {
              protocol: 'https',
              hostname: 'www.avatar.com',
              port: '',
              pathname: '/**',
            }
          ],

      
    }
};

export default config;
