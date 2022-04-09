import { Link } from 'remix';
import supabase from '~/utils/supabase';

const handleSignUp = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');
  await supabase.auth.signUp({ email, password });
};

export default () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
      <h1 className="text-4xl mb-4">Sign Up</h1>
      <form className="flex flex-col mb-4" onSubmit={handleSignUp}>
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
        Have an account?{' '}
        <Link to="/login" className="text-yellow-200">
          Sign In
        </Link>
      </p>
    </div>
  );
};
