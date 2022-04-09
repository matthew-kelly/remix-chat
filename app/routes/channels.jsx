import { Link, useLoaderData, Outlet, useLocation, NavLink } from 'remix';
import withAuthRequired from '~/utils/withAuthRequired';

export const loader = async ({ request }) => {
  const { supabase, redirect } = await withAuthRequired({ request });
  if (redirect) return redirect;
  const { data, error } = await supabase.from('channels').select('id, title');
  if (error) {
    console.error(error.message);
  }
  return {
    channels: data,
  };
};

export default () => {
  const { channels } = useLoaderData();
  const location = useLocation();

  return (
    <div className="h-screen flex">
      <div className="bg-gray-800 w-40 p-4 text-white flex flex-col justify-between">
        <div>
          {channels.map((channel, index) => (
            <p key={index} className="hover:text-gray-400">
              <NavLink
                to={`/channels/${channel.id}`}
                className={({ isActive }) => (isActive ? 'font-bold text-yellow-200' : null)}
              >
                <span className="font-normal text-gray-400 mr-1">#</span>
                {channel.title}
              </NavLink>
            </p>
          ))}
        </div>
        <p className="hover:text-gray-400">
          <Link to="/logout">Logout</Link>
        </p>
      </div>
      <div className="grow p-4 flex flex-col">
        {location.pathname === '/channels' || location.pathname === '/channels/' ? (
          <div className="grow flex items-center justify-center text-center text-2xl">👈 Choose a channel!</div>
        ) : null}
        <Outlet />
      </div>
    </div>
  );
};
