import type { Variants } from "framer-motion";

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.3,
            duration: 0.6,
            ease: [0.42, 0, 0.58, 1],
        },
    }),
}

export const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.3,
            duration: 0.6,
            ease: [0.42, 0, 0.58, 1]
        }
    })
}

export const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i = 0) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.3,
            duration: 0.6,
            ease: [0.42, 0, 0.58, 1]
        }
    })
}

export const fadeInReft: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.3,
            duration: 0.6,
            ease: [0.42, 0, 0.58, 1]
        }
    })
}


export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: [0.42, 0, 0.58, 1],
    },
  }),
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};
