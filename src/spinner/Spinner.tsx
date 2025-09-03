import { AnimatePresence, motion } from "motion/react";
import { classNames } from "@/util/classnames.util.ts";

export type SpinnerProps = {
  speed?: number;
  className?: string;
};

const clipKeyframes = [
  "polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)",
  "polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)",
  "polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)",
  "polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 100%)",
  "polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 0)",
];

export const Spinner = (props: SpinnerProps) => {
  const {
    speed = 1,
    className
  } = props;

  const rotateDuration = 1 / speed;
  const clipDuration = 2 / speed;

  return (
    <AnimatePresence>
      <motion.div
        role={ 'status' }
        className={ classNames('relative rounded-full', className) }
        animate={ { rotate: 360 } }
        transition={ { repeat: Infinity, ease: 'linear', duration: rotateDuration } }
      >
        <motion.div
          className={ 'absolute inset-0 rounded-full' }
          style={ {
            boxSizing: 'border-box',
            borderStyle: 'solid',
            borderWidth: 2,
          } }
          animate={ { clipPath: clipKeyframes } }
          transition={ {
            repeat: Infinity,
            ease: 'linear',
            duration: clipDuration,
            times: [ 0, 0.25, 0.5, 0.75, 1 ],
          } }
        />
      </motion.div>
    </AnimatePresence>
  );
}