import Head from 'next/head';
import RoomList from '../components/RoomList';
import SloganRotator from '../components/SloganRotator';

export default function Home() {
  return (
    <>
      <Head>
        <title>theDoorMan</title>
        <meta name="description" content="Check which Zoom rooms are live" />
      </Head>
      <main className="flex flex-col items-center justify-start min-h-screen bg-black text-accent font-orbitron py-10 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <img src="/logo.png" alt="Logo" className="w-32 drop-shadow-[0_0_15px_#00a6FF]" />
          <h1 className="text-4xl font-bold text-center"><sup>​🇹​​🇭​​🇪</sup>DOORMAN</h1>
          <SloganRotator />
        </div>
        <div className="w-full max-w-md self-start px-4">
          <RoomList />
        </div>
      </main>
    </>
  );
}