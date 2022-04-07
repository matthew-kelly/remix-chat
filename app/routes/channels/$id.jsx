import { Form, useLoaderData, useFetcher } from 'remix';
import supabase from '~/utils/supabase';
import { useEffect, useState } from 'react';

export const loader = async ({ params: { id } }) => {
  const { data: channel, error } = await supabase
    .from('channels')
    .select('id, title, description, messages(id, content)')
    .match({ id })
    .single();
  if (error) {
    console.log(error.message);
  }
  return {
    channel,
  };
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const content = formData.get('content');
  const channelId = formData.get('channelId');
  const { error } = await supabase.from('messages').insert({ content, channel_id: channelId });
  if (error) {
    console.log(error.message);
  }
  return null;
};

export default () => {
  const { channel } = useLoaderData();
  const fetcher = useFetcher();
  const [messages, setMessages] = useState([...channel.messages]);

  useEffect(() => {
    supabase
      .from(`messages:channel_id=eq.${channel.id}`)
      .on('*', (payload) => {
        // something changed
        // call loader
        fetcher.load(`/channels/${channel.id}`);
        // setMessages((current) => [...current, { id: payload.new.id, content: payload.new.content }]);
      })
      .subscribe();
  }, []);

  useEffect(() => {
    if (fetcher.data) {
      setMessages([...fetcher.data.channel.messages]);
    }
  }, [fetcher.data]);

  useEffect(() => {
    setMessages([...channel.messages]);
  }, [channel]);

  return (
    <div>
      <pre>{JSON.stringify(messages, null, 2)}</pre>
      <Form method="post">
        <input type="text" name="content" placeholder="Type your message" />
        <input type="hidden" value={channel.id} name="channelId" />
        <button type="submit">Send</button>
      </Form>
    </div>
  );
};
