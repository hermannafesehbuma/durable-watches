'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useAnimation } from 'framer-motion';

export default function Aboutus() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start('visible');
    }
  }, [isInView, mainControls]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <section className="min-h-screen relative flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* Image Background */}
        <Image
          src="/hero3.jpg"
          alt="Rolex Watch"
          fill
          className="object-cover"
        />

        {/* Dark Transparent Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10" />
      </div>

      {/* Animated Text Content */}
      <motion.div
        ref={ref}
        className="relative z-10 p-8 text-white xsm:w-[80%] md:w-[60%] lg:w-[40%]"
        variants={containerVariants}
        initial="hidden"
        animate={mainControls}
      >
        <motion.h3
          variants={fadeInUp}
          className="font-dm text-4xl font-light uppercase"
        >
          The Iconic Rolex
        </motion.h3>

        <motion.h3
          variants={fadeInUp}
          className="text-4xl uppercase font-light font-lora italic"
        >
          Now reimagined in ceramic
        </motion.h3>

        <motion.p variants={fadeInUp} className="font-light">
          Drawing its elegance from decades of craftsmanship, the classic Rolex
          embodies enduring sophistication and peerless precision. With each
          polished link and signature dial, it stands not just as a timekeeper —
          but as a timeless symbol of legacy, confidence, and excellence in
          motion.
        </motion.p>
      </motion.div>
    </section>
  );
}
