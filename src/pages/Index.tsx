import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MoodInput from "@/components/MoodInput";
import FlowerResult from "@/components/FlowerResult";
import { findFlowerForMood, ArtFlower } from "@/data/artFlowers";

const Index = () => {
  const [flower, setFlower] = useState<ArtFlower | null>(null);
  const [userMood, setUserMood] = useState("");

  const handleMoodSubmit = (mood: string) => {
    setUserMood(mood);
    const matched = findFlowerForMood(mood);
    setFlower(matched);
  };

  const handleReset = () => {
    setFlower(null);
    setUserMood("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="py-6 px-6 text-center">
        <motion.p
          className="font-serif text-sm tracking-[0.3em] uppercase text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          S(C)ENT FOR YOU
        </motion.p>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center py-12">
        <AnimatePresence mode="wait">
          {!flower ? (
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
            >
              <FlowerResult
                flower={flower}
                userMood={userMood}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-muted-foreground/40 text-xs font-sans">
          Flowers from masterpieces, chosen for your heart
        </p>
      </footer>
    </div>
  );
};

export default Index;
