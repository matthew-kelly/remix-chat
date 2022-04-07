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
    <div>
      {channels.map((channel, index) => (
        <p key={index}>
          <Link to={`/channels/${channel.id}`}>{channel.title}</Link>
        </p>
      ))}
      <p>
        <Link to={`/channels/about`}>About</Link>
      </p>
      <Outlet />
    </div>
  );
};
