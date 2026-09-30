export const motionTokens = {
  duration: { fast: 0.2, normal: 0.42, slow: 0.68 },
  ease: {
    standard: [0.22, 1, 0.36, 1],
    enter: [0.16, 1, 0.3, 1],
    exit: [0.4, 0, 1, 1],
  },
  stagger: { small: 0.055, medium: 0.1 },
};

export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

export const revealVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};
