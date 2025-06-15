import Head from 'next/head';
import RoomList from '../components/RoomList';
import SloganRotator from '../components/SloganRotator';

export default function Home() {
  return (
    <>
      <Head>
        <title>theDoorMan</title>
        <meta name="description" content="Check which Zoom rooms are live" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap" rel="stylesheet" />
      </Head>
      <main className="bg-black flex flex-col items-center justify-start min-h-screen w-full text-accent font-orbitron py-10 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <img src="/logo.gif" alt="Logo" className="w-62 drop-shadow-[0_0_15px_#00a6FF]" />
          <h1 className="text-4xl font-bold text-center">
            <sup>🇹​​🇭​​🇪</sup>DOORMAN
          </h1>
          <SloganRotator />
        </div>
        <RoomList />
      </main>
    </>
  );
}