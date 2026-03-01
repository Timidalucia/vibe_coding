import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MoodInput from "@/components/MoodInput";
import BouquetResult from "@/components/BouquetResult";
import { findFlowersForMood, ArtFlower } from "@/data/artFlowers";

const Index = () => {
  const [flowers, setFlowers] = useState<ArtFlower[] | null>(null);
  const [userMood, setUserMood] = useState("");

  const handleMoodSubmit = (mood: string) => {
    setUserMood(mood);
    const matched = findFlowersForMood(mood, 3);
    setFlowers(matched);
  };

  const handleReset = () => {
    setFlowers(null);
    setUserMood("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="py-4 px-6 text-center shrink-0">
        <motion.p
          className="font-serif text-sm tracking-[0.3em] uppercase text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          S(C)ENT FOR YOU
        </motion.p>
      </header>

      <main className={`flex items-start justify-center ${!flowers ? 'flex-1 items-center' : 'pt-2 pb-6'}`}>
        <AnimatePresence mode="wait">
          {!flowers ? (
            <motion.div
              key="input"
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <MoodInput onSubmit={handleMoodSubmit} />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <BouquetResult
                flowers={flowers}
                userMood={userMood}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-4 text-center shrink-0">
        <p className="text-muted-foreground/40 text-xs font-sans">
          Flowers from masterpieces, chosen for your heart
        </p>
      </footer>
    </div>
  );
};

export default Index;
