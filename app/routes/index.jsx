import { Link } from 'remix';

export default function Index() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
      <h1 className="text-4xl mb-4">Welcome to the chat!</h1>

      <p className="text-center text-2xl">
        <Link to="/channels" className="text-yellow-200">
          Come on in!
        </Link>
      </p>
    </div>
  );
}
