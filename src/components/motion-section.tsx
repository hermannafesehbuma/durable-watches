'use client';

import { motion } from './motion';

export default function MotionSection() {
  return (
    <motion.section className="h-screen flex flex-col flex-1 gap-10 overflow-x-hidden items-center justify-center">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className=" right-0 bottom-0 min-w-full min-h-full -z-10 object-cover"
      >
        <source src="/videos/header-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </motion.section>
  );
}
