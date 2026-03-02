import { useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MoodInputProps {
  onSubmit: (mood: string) => void;
}

const MoodInput = ({ onSubmit }: MoodInputProps) => {
  const [mood, setMood] = useState("");

  const handleSubmit = () => {
    if (mood.trim()) onSubmit(mood.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center w-full max-w-xl mx-auto px-6"
    >
      <motion.h1
        className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground text-center leading-tight mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        How are you feeling today?
      </motion.h1>

      <motion.p
        className="text-muted-foreground text-center text-lg mb-10 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        Share your heart, and we'll find you a flower from a masterpiece that speaks to your soul.
      </motion.p>

      <motion.div
        className="w-full space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <Textarea
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="I feel..."
          className="min-h-[120px] bg-card/80 backdrop-blur-sm border-border/60 text-foreground text-lg font-sans resize-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50 rounded-xl"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!mood.trim()}
            className="rounded-full px-8 py-6 text-base font-sans font-medium gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 disabled:opacity-40"
          >
            Find my flower
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      <motion.p
        className="text-muted-foreground/60 text-sm mt-12 text-center font-serif italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        "Every flower is a soul blossoming in nature." — Gérard de Nerval
      </motion.p>
    </motion.div>
  );
};

export default MoodInput;
