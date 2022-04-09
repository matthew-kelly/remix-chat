import { Link, redirect } from 'remix';
import supabase from '~/utils/supabase';
import { getSession, commitSession } from '~/utils/cookie';

// hit from a POST to /login, sets cookie and redirects to '/channels'
export const action = async ({ request }) => {
  const formData = await request.formData();
  const accessToken = formData.get('accessToken');
  const session = await getSession();
  session.set('accessToken', accessToken);
  const cookie = await commitSession(session);

  return redirect('/channels', {
    headers: {
      'Set-Cookie': cookie,
    },
  });
};

const handleSignIn = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');
  await supabase.auth.signIn({ email, password });
};

export default () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
      <h1 className="text-4xl mb-4">Sign In</h1>
      <form className="flex flex-col mb-4" onSubmit={handleSignIn}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          className="border border-gray-200 bg-transparent px-2 mb-4"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border border-gray-200 bg-transparent px-2 mb-4"
        />
        <button className="bg-gray-700 px-4 py-2 mt-4">Go!</button>
      </form>
      <p className="text-center text-xs">
        Don't have an account?{' '}
        <Link to="/register" className="text-yellow-200">
          Sign Up
        </Link>
      </p>
    </div>
  );
};
