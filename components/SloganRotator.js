import { useEffect, useState } from 'react';

const slogans = [
  "Hey Stud. Looking? Here’s who’s hosting:",
  "Hard Up? These Hosts Are Too.",
  "Ding Dong. Your Late-Night Daddy Just Opened His Doors.",
  "Booty Call Incoming: Here’s Who’s Barely Dressed & Ready.",
  "Unlocked & Loaded. These Parties Are Going All Night.",
  "Looking to Slide In? Here’s Where the Lube’s Already Flowing.",
  "That Thump You Hear? It’s Not Just the Bass. Click to Join.",
  "Things Are Getting Wet & Wild—And You’re Missing It.",
  "Thirst Trap Alert: Your Favorite Host Just Dropped his Pants.",
  "Your Invite to the Naughtiest Rooms On Zoom.",
  "Feeling Submissive or Dominant? Either Way, There’s a Room for You.",
  "Your Type Just Logged On... Wanna Play or Watch?",
  "No Judgement. Just Lube, Lights, and Loaded Rooms.",
  "You’ve Got the Look. They’ve Got the Room. Time to Click.",
  "Kink Unlocked: Here’s Where the Fetish Freaks Are Freakin’.",
  "Boys, Toys & No Noise Complaints — These Hosts Play Hard.",
  "Fisting, Fog, or Full-On Fantasy? Your Scene is LIVE.",
  "Everyone’s Already There. Are You Gonna Be ‘Late’ Again?",
  "Your Tribe Just Checked In. You Coming or Just Watching?",
  "Room’s Filling Fast. Don’t Be the Last Load to Arrive.",
];

export default function SloganRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % slogans.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-xl text-accent text-center space-y-2 transition-opacity duration-1000 ease-in-out">
      <div key={index} className="animate-fade-in-slow">
        {slogans[index]}
      </div>
      <div className="text-sm italic">
        Click the links below to instantly be connected to your favourite PNP party destination
      </div>
    </div>
  );
}