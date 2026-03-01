import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MoodInput from "@/components/MoodInput";
import FlowerResult from "@/components/FlowerResult";
import { findFlowerForMood, ArtFlower } from "@/data/artFlowers";

const Index = () => {
  const [flower, setFlower] = useState<ArtFlower | null>(null);
  const [userMood, setUserMood] = useState("");
  const [isFlowerHovered, setIsFlowerHovered] = useState(false);

  const handleMoodSubmit = (mood: string) => {
    setUserMood(mood);
    const matched = findFlowerForMood(mood);
    setFlower(matched);
  };

  const handleReset = () => {
    setFlower(null);
    setUserMood("");
    setIsFlowerHovered(false);
  };

  return (
    <div
      className={`bg-background flex flex-col transition-all duration-500 ${
        flower && !isFlowerHovered
          ? "h-screen overflow-hidden"
          : "min-h-screen"
      }`}
    >
      {/* Header */}
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

      {/* Main content */}
      <main className={`flex items-center justify-center ${!flower ? 'flex-1 py-6' : 'flex-1 py-0'}`}>
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
              className="w-full"
            >
              <FlowerResult
                flower={flower}
                userMood={userMood}
                onReset={handleReset}
                onHoverChange={setIsFlowerHovered}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center shrink-0">
        <p className="text-muted-foreground/40 text-xs font-sans">
          Flowers from masterpieces, chosen for your heart
        </p>
      </footer>
    </div>
  );
};

export default Index;
