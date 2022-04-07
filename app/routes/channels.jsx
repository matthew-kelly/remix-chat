import { Link, useLoaderData, Outlet } from 'remix';
import supabase from '~/utils/supabase';
export const loader = async () => {
  const { data, error } = await supabase.from('channels').select('id, title');
  if (error) {
    console.log(error.message);
  }
  return {
    channels: data,
  };
};

export default () => {
  const { channels } = useLoaderData();
  return (
    <div className="h-screen flex">
      <div className="bg-gray-800 w-40 p-4 text-white">
        {channels.map((channel, index) => (
          <p key={index} className="hover:text-gray-400">
            <Link to={`/channels/${channel.id}`}>
              <span className="text-gray-400 mr-1">#</span>
              {channel.title}
            </Link>
          </p>
        ))}
      </div>
      <div className="grow p-4 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};
