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
    <>
      <h1 className="text-2xl uppercase mb-2">{channel.title}</h1>
      <p className="text-gray-600 border-b border-gray-300 pb-4 mb-8">{channel.description}</p>
      <div className="grow flex flex-col p-2 overflow-auto">
        <div className="mt-auto">
          {messages.map((message) => (
            <p key={message.id} className="p-2">
              {message.content}
            </p>
          ))}
        </div>
      </div>
      <Form method="post" className="flex">
        <input
          type="text"
          name="content"
          placeholder="Type your message"
          className="border border-gray-200 px-2 grow"
        />
        <input type="hidden" value={channel.id} name="channelId" />
        <button type="submit" className="px-4 py-2 ml-4 bg-blue-200">
          Send
        </button>
      </Form>
    </>
  );
};
