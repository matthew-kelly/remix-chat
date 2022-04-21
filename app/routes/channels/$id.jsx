import { Form, useLoaderData, useFetcher, useTransition } from 'remix';
import supabase from '~/utils/supabase';
import { useEffect, useState, useRef } from 'react';
import withAuthRequired from '~/utils/withAuthRequired';

export const loader = async ({ request, params: { id } }) => {
  const { supabase, redirect, user } = await withAuthRequired({ request });
  if (redirect) return redirect;
  const { data: channel, error } = await supabase
    .from('channels')
    .select('id, title, description, messages(id, content, likes, profiles(id, email, username))') // FIXME: update supabase to only allow viewing other users usernames
    .match({ id })
    .order('created_at', { foreignTable: 'messages' })
    .single();
  if (error) {
    console.error(error.message);
  }
  return {
    channel,
    user,
  };
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const content = formData.get('content');
  if (content.trim() === '') return null;
  const channelId = formData.get('channelId');
  const { supabase, user } = await withAuthRequired({ request });
  const { error } = await supabase.from('messages').insert({ content, channel_id: channelId, user_id: user.id });
  if (error) {
    console.error(error.message);
  }
  return null;
};

export default () => {
  const { channel, user } = useLoaderData();
  const fetcher = useFetcher();
  const [messages, setMessages] = useState([...channel.messages]);
  const transition = useTransition();
  const newMessageRef = useRef();
  const messagesRef = useRef();

  useEffect(() => {
    if (transition.state !== 'submitting') {
      // reset the text input
      newMessageRef.current?.reset();
    }
  }, [transition.state]);

  useEffect(() => {
    supabase
      .from(`messages:channel_id=eq.${channel.id}`)
      .on('*', (payload) => {
        // something changed
        // call loader
        fetcher.load(`/channels/${channel.id}`);
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

  useEffect(() => {
    // messagesRef.current?.scrollIntoView({
    //   behaviour: 'smooth',
    //   block: 'end',
    // });
    messagesRef.current.scroll({
      top: 1000000,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleIncrement = async (message_id) => {
    // call increment function from postgres
    await supabase.rpc('increment_likes', { message_id });
  };

  return (
    <>
      <h1 className="text-2xl uppercase mb-2">{channel.title}</h1>
      <p className="text-gray-600 border-b border-gray-300 pb-4">{channel.description}</p>
      <div className="grow flex flex-col p-2 overflow-y-auto scroll-smooth" ref={messagesRef}>
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex hover:bg-gray-50 py-2 ${
                message.profiles.id === user.id ? 'flex-col items-end text-right' : 'items-center'
              }`}
            >
              <p className="max-w-xs">
                {message.content}
                {message.profiles.id !== user.id && (
                  <span className="block text-xs text-gray-400">
                    {message.profiles.username ?? message.profiles.email}
                  </span>
                )}
              </p>
              <div className="text-xs ml-4">
                {message.likes > 0 && (
                  <span className="text-gray-400">
                    {message.likes}
                    {message.profiles.id === user.id && ' likes'}
                  </span>
                )}
                {message.profiles.id !== user.id && (
                  <button type="button" onClick={() => handleIncrement(message.id)} className="ml-1">
                    ❤️
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="font-bold text-center">Be the first to send a message!</p>
        )}
      </div>
      <Form method="post" className="flex flex-shrink-0" ref={newMessageRef}>
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
