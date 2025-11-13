import { motion } from "framer-motion";

export default function FadeIn({ children, delay = 0, duration = 0.7 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] // “S-mooth” cubic-bezier curve
      }}
    >
      {children}
    </motion.div>
  );
}