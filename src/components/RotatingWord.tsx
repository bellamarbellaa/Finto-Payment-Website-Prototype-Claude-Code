import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Cycles through `words` on an interval, sliding the outgoing word up and
 * out while the incoming one slides up into place — only transform/opacity
 * animate, so this stays smooth even on modest hardware.
 */
export function RotatingWord({ words, intervalMs = 2200 }: { words: string[]; intervalMs?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % words.length), intervalMs);
    return () => clearInterval(timer);
  }, [words.length, intervalMs]);

  return (
    <span className="rotating-word" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'inline-block' }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
