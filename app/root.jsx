import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useFetcher } from 'remix';
import { useEffect } from 'react';
import supabase from '~/utils/supabase';
import styles from '~/styles/app.css';

export const meta = () => ({
  charset: 'utf-8',
  title: 'Animal Chat',
  viewport: 'width=device-width,initial-scale=1',
});

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export const loader = () => {
  return {
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
    },
  };
};

export default function App() {
  const { env } = useLoaderData();
  const fetcher = useFetcher();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // POST to our '/login' route, this triggers the action fn
        fetcher.submit(
          {
            accessToken: session.access_token,
          },
          {
            method: 'post',
            action: '/login',
          }
        );
      }
      // event === 'SIGNED_OUT' isn't being popped properly on logout
      // logic has been moved directly into /logout instead
    });
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
