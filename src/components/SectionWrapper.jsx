import { motion } from 'framer-motion';

const SectionWrapper = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.5,
        ease: "easeOut"
      }}
      className={className}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default SectionWrapper;
