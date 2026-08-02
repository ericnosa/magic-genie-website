import { motion, useReducedMotion } from "framer-motion";

/**
 * Magic Genie logo mark.
 *
 * Props:
 *  - size: pixel size of the square logo (default 40)
 *  - animate: run the one-time entrance + gold-sweep on mount (Home hero only)
 *  - className: extra classes
 *  - testId: data-testid override
 *
 * Entrance (only when `animate` is true AND user has NOT set prefers-reduced-motion):
 *   1. Fade + scale from opacity 0 / scale 0.98 → 1 / 1 in 0.4s, smooth ease-out.
 *   2. Immediately after, a single soft gold arc sweeps once around the outer
 *      ring — no glow, no repeat.
 * Hover: subtle 2px lift + softly elevated drop shadow.
 */
export function LogoMark({ size = 40, animate = false, className = "", testId }) {
  const prefersReduced = useReducedMotion();
  const runEntrance = animate && !prefersReduced;

  const smoothOut = [0.16, 1, 0.3, 1]; // ease-out, no bounce

  return (
    <motion.span
      data-testid={testId}
      className={`relative inline-block ${className}`}
      style={{
        width: size,
        height: size,
        filter: "drop-shadow(0 2px 6px rgba(10,17,40,0.06))",
        transition: "filter 320ms ease",
      }}
      initial={runEntrance ? { opacity: 0, scale: 0.98 } : false}
      animate={runEntrance ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.4, ease: smoothOut }}
      whileHover={
        prefersReduced
          ? undefined
          : { y: -2, filter: "drop-shadow(0 10px 22px rgba(10,17,40,0.14))" }
      }
    >
      <img
        src="/logo.png"
        alt="Magic Genie Services logo"
        width={size}
        height={size}
        className="block w-full h-full select-none"
        draggable={false}
      />

      {runEntrance && (
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none"
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 270, opacity: [0, 1, 1, 0] }}
          transition={{
            rotate: { duration: 1.4, delay: 0.4, ease: [0.4, 0, 0.2, 1] },
            opacity: {
              duration: 1.4,
              delay: 0.4,
              times: [0, 0.18, 0.82, 1],
              ease: "linear",
            },
          }}
          aria-hidden="true"
        >
          {/* Short gold arc that rides the outer ring — light catching polished metal, not a glow. */}
          <circle
            cx="50"
            cy="50"
            r="47.5"
            fill="none"
            stroke="#F0D97A"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="10 290"
          />
        </motion.svg>
      )}
    </motion.span>
  );
}
