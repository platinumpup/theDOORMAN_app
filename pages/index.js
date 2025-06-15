import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>theDoorMan</title>
        <meta name="description" content="Check which Zoom rooms are live" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="bg-gif flex flex-col items-center justify-start min-h-screen w-full text-accent font-orbitron py-10 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <img src="/logo.gif" alt="Logo" className="w-62 drop-shadow-[0_0_15px_#00a6FF]" />
          <h1 className="text-4xl font-bold text-center">
            <sup>🇹​​🇭​​🇪</sup>DOORMAN
          </h1>
          <p className="text-lg text-center">
            Instantly check which Zoom rooms are live.<br />
            Tap a room to see its status!
          </p>
        </div>
        <div className="flex flex-col space-y-3 w-full max-w-md mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded shadow">
            TwackCity
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded shadow">
            BeatSync
          </button>
          <button className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded shadow">
            Official310
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded shadow">
            VIP
          </button>
        </div>
      </main>
    </>
  );
}