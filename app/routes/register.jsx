import Filter from 'bad-words';
import { useState } from 'react';
import { Link } from 'remix';
import supabase from '~/utils/supabase';

export default () => {
  const [error, setError] = useState('');
  const filter = new Filter({ placeholder: '*' });

  const handleSignUp = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const username = formData.get('username');
    if (filter.clean(username).includes('*')) {
      setError('Profanity in usernames is not allowed');
      return;
    }
    const { data: profile, error } = await supabase.rpc('check_if_username_is_available', { username_var: username });
    if (profile || error) {
      setError('Username is already taken');
      return;
    } else {
      const { user } = await supabase.auth.signUp({ email, password });
      await supabase.from('profiles').update({ username: username }).match({ id: user.id });
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
      <h1 className="text-4xl mb-4">Sign Up</h1>
      <form className="flex flex-col mb-4" onSubmit={handleSignUp}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          placeholder="How you'll appear in chat"
          className="border border-gray-200 bg-transparent px-2 mb-4"
          required
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          className="border border-gray-200 bg-transparent px-2 mb-4"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border border-gray-200 bg-transparent px-2 mb-4"
          required
        />
        {error && <span className="text-red-600 text-center font-semibold">{error}</span>}
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
