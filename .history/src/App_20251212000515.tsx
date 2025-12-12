import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import leftButtonImg from 'figma:asset/a2fc793a6b79da0bfb50fd96eacc2bcddc32ef22.png';
import rightButtonImg from 'figma:asset/ef202eebc3f66863be69a8aa1209a4ee8794844d.png';

// Sample slide data - replace with your own images and text
const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjU0NTUyODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Majestic Mountains",
    description: "Explore the breathtaking peaks and valleys of nature's grandest landscapes."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1514747975201-4715db583da9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmVzfGVufDF8fHx8MTc2NTQ2NTEyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Ocean Waves",
    description: "Dive into the endless beauty of crashing waves and coastal serenity."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBuYXR1cmV8ZW58MXx8fHwxNzY1NTI2MTkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Forest Haven",
    description: "Wander through lush green forests where tranquility meets adventure."
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1614935981447-893ce3858657?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBzdW5zZXR8ZW58MXx8fHwxNzY1NDI1ODkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Desert Sunset",
    description: "Witness the magical transformation of golden sands under painted skies."
  }
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const textVariants = {
    enter: {
      y: 20,
      opacity: 0
    },
    center: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.3
      }
    },
    exit: {
      y: -20,
      opacity: 0
    }
  };

  return (
    <div className="size-full relative overflow-hidden bg-black">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 400, damping: 35 },
            opacity: { duration: 0.15 }
          }}
          className="absolute inset-0"
        >
          {/* Image */}
          <div className="size-full relative">
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="size-full object-cover"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 md:pb-32">
              <motion.div
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="text-center text-white px-6 max-w-3xl"
              >
                <h1 className="mb-4">{slides[currentSlide].title}</h1>
                <p className="text-white/90">
                  {slides[currentSlide].description}
                </p>
              </motion.div>
              
              {/* Navigation buttons below text */}
              <div className="flex items-center gap-8 mt-8">
                <button
                  onClick={prevSlide}
                  className="hover:opacity-80 transition-opacity"
                  aria-label="Previous slide"
                >
                  <img src={leftButtonImg} alt="Previous" className="h-12 md:h-16" />
                </button>
                
                <button
                  onClick={nextSlide}
                  className="hover:opacity-80 transition-opacity"
                  aria-label="Next slide"
                >
                  <img src={rightButtonImg} alt="Next" className="h-12 md:h-16" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}