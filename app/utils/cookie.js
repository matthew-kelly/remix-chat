import { createCookieSessionStorage } from 'remix';

const MAX_AGE = 60 * 60 * 8; // seconds * minutes * desired hours = 8 hours

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: 'sb:token',
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000), // milliseconds
    domain: '',
    path: '/',
    sameSite: 'lax',
    httpOnly: true, // prevent access via javascript, only sent to the server
    secure: true, // only https
    secrets: ['supabase is the best'],
  },
});

export { getSession, commitSession, destroySession };
