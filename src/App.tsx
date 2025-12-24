import { useState, useEffect } from 'react';
import { MESSAGES, FRIENDS } from './messages';
import type { FriendName, Message } from './messages';

function App() {
  const [gameQueue, setGameQueue] = useState<Message[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<FriendName | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const shuffled = [...MESSAGES].sort(() => 0.5 - Math.random());
    setGameQueue(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setHasAnswered(false);
    setSelectedFriend(null);
    setIsGameOver(false);
  };

  const handleGuess = (friend: FriendName) => {
    if (hasAnswered) return;
    setSelectedFriend(friend);
    setHasAnswered(true);
    if (friend === gameQueue[currentIndex].sender) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex >= gameQueue.length - 1) {
      setIsGameOver(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setHasAnswered(false);
      setSelectedFriend(null);
    }
  };

  if (gameQueue.length === 0) return <div className="p-20 text-center font-bold">Loading...</div>;

  const currentMsg = gameQueue[currentIndex];

  // --- GAME OVER SCREEN ---
  if (isGameOver) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 text-center max-w-md w-full shadow-2xl">
           <h1 className="text-4xl font-black mb-2 italic">THAT'S A WRAP!</h1>
           <p className="text-blue-200 mb-6 font-medium tracking-wide">FINAL SCORE</p>
           
           <div className="text-8xl font-black text-white mb-8 drop-shadow-lg">
             {score}
           </div>
           
           <div className="text-lg mb-10 text-gray-200 font-medium">
             {score === MESSAGES.length ? "You are the ultimate lurker. 👁️" : 
              score > MESSAGES.length / 2 ? "You're definitely in the group chat." : 
              "Do you even read the messages? 💀"}
           </div>
           
           <button 
             onClick={startNewGame}
             className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
           >
             PLAY AGAIN
           </button>
        </div>
      </div>
    );
  }

  // --- GAME PLAY SCREEN ---
  return (
    <div className="min-h-screen relative flex flex-col items-center py-10 px-4 font-sans overflow-hidden">
      
      {/* --- Dynamic Background Elements --- */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>

      {/* --- Main Content --- */}
      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center">
        
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3 text-blue-200 border border-white/10">
            Round {currentIndex + 1} / {MESSAGES.length} • Score: {score}
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm italic">
            WHO SENT THIS?
          </h1>
        </header>

        {/* The Message Bubble (Personality Core) */}
        {/* Changed from fixed box to w-fit/max-w to hug content */}
        <div className="w-full flex justify-center mb-12 animate-float">
          <div className="relative max-w-2xl w-fit mx-auto group">
            
            {/* The Bubble */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-[2rem] rounded-bl-none p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300">
               <blockquote className="text-2xl md:text-4xl text-left font-bold leading-tight text-white drop-shadow-md">
                "{currentMsg.text}"
              </blockquote>
            </div>

            {/* Little triangular tail for the speech bubble */}
            <div className="absolute -bottom-4 left-0 w-8 h-8 bg-white/10 backdrop-blur-xl border-l border-b border-white/30 [clip-path:polygon(0_0,100%_0,0_100%)]"></div>
          </div>
        </div>

        {/* Choices Grid */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
          {FRIENDS.map((friend) => {
            let btnClass = "bg-white/5 border-white/10 text-white hover:bg-white/20 hover:border-white/30";
            let scaleClass = "";

            if (hasAnswered) {
              if (friend === currentMsg.sender) {
                // Correct: Solid Blue Gradient
                btnClass = "bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-400 text-white shadow-lg shadow-blue-500/50";
                scaleClass = "scale-105 z-10";
              } else if (friend === selectedFriend) {
                // Wrong: Red Tint
                btnClass = "bg-red-500/20 border-red-400/50 text-red-200";
              } else {
                // Others: Fade out
                btnClass = "opacity-20 bg-black/20 border-transparent";
              }
            }

            return (
              <button
                key={friend}
                onClick={() => handleGuess(friend)}
                disabled={hasAnswered}
                className={`
                  relative py-4 px-2 rounded-2xl font-bold text-lg tracking-wide transition-all duration-300
                  border backdrop-blur-sm shadow-sm
                  active:scale-95 group overflow-hidden
                  ${btnClass}
                  ${scaleClass}
                `}
              >
                {/* Hover Glow Effect */}
                {!hasAnswered && (
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                )}
                <span className="relative z-10">{friend}</span>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <div className="h-20 w-full flex justify-center">
          {hasAnswered && (
            <button
              onClick={nextQuestion}
              className="bg-white text-blue-900 font-black py-4 px-12 rounded-full shadow-xl shadow-white/10 transition-all transform hover:scale-105 hover:shadow-2xl active:scale-95"
            >
              {currentIndex === MESSAGES.length - 1 ? "FINISH GAME" : "NEXT MSG ➜"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;