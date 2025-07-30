import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SnowflakeProps {
  // No props needed for now
}

const Snowflake = ({}: SnowflakeProps) => {
  const [position, setPosition] = useState({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.3,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  });

  // Reset position when animation completes
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * 100,
        y: -10,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        duration: Math.random() * 10 + 10,
        delay: 0,
      });
    }, position.duration * 1000);

    return () => clearInterval(interval);
  }, [position.duration]);

  return (
    <motion.div
      className="snowflake"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${position.size}px`,
        height: `${position.size}px`,
        opacity: position.opacity,
        position: 'absolute',
        backgroundColor: '#a8d8ea',
        borderRadius: '50%',
        zIndex: 0,
      }}
      animate={{
        y: '110vh',
        x: [
          `${position.x}%`,
          `${position.x + (Math.random() * 20 - 10)}%`,
          `${position.x}%`,
        ],
      }}
      transition={{
        duration: position.duration,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        delay: position.delay,
      }}
    />
  );
};

export default Snowflake;
