import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';

const BOTTLE_IMG = `${import.meta.env.BASE_URL}lahori-zeera-bottle.jpg`;
const LEMON_IMG = `${import.meta.env.BASE_URL}lemon-slice.png`;
const MINT_IMG = `${import.meta.env.BASE_URL}mint-leaf.png`;
const SPLASH_IMG = `${import.meta.env.BASE_URL}water-splash.png`;
const ICE_IMG = `${import.meta.env.BASE_URL}ice-cube.png`;

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001
  });

  // Bottle transformations - complex path across 8 sections
  // Sections: Hero(0), Story(1), Ingredients(2), Culture(3), Refresh(4), Cta(5)
  // We have roughly 600vh total scroll space.
  
  const bottleY = useTransform(smoothProgress, 
    [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1], 
    ["5vh", "20vh", "30vh", "40vh", "50vh", "70vh", "90vh"]
  );
  
  // Scale the bottle differently in different sections
  const bottleScale = useTransform(smoothProgress, 
    [0, 0.15, 0.35, 0.55, 0.75, 1], 
    [1.2, 0.8, 1.4, 0.9, 1.1, 1.5]
  );
  
  // Rotate the bottle playfully
  const bottleRotate = useTransform(smoothProgress, 
    [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1], 
    [-5, 15, -10, 20, -15, 5, 0]
  );
  
  // Move bottle horizontally
  const bottleX = useTransform(smoothProgress, 
    [0, 0.15, 0.35, 0.55, 0.75, 1], 
    ["0%", "-25%", "25%", "-20%", "20%", "0%"]
  );

  return (
    <div ref={containerRef} className="relative w-full bg-background overflow-hidden selection:bg-primary selection:text-primary-foreground font-sans">
      
      {/* Sticky Bottle Container */}
      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center h-screen">
        <motion.div
          style={{
            y: bottleY,
            scale: bottleScale,
            rotate: bottleRotate,
            x: bottleX,
          }}
          className="relative w-48 md:w-64 lg:w-80 h-auto flex items-center justify-center filter drop-shadow-[0_20px_50px_rgba(163,230,53,0.4)]"
        >
          <img 
            src={BOTTLE_IMG} 
            alt="Lahori Zeera Bottle" 
            className="w-full h-auto object-contain rounded-[40px] mix-blend-normal"
            style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 1%, black 4%)' }}
          />
          {/* Subtle glow behind bottle */}
          <div className="absolute inset-0 bg-primary/30 blur-3xl -z-10 rounded-full scale-125 mix-blend-screen" />
        </motion.div>
      </div>

      {/* Floating Elements layer */}
      <FloatingElements progress={smoothProgress} />

      {/* Sections Container - 600vh total height */}
      <div className="relative z-20 flex flex-col">
        <HeroSection />
        <StorySection />
        <IngredientsSection />
        <CultureSection />
        <RefreshSection />
        <CtaSection />
      </div>
      
    </div>
  );
}

function FloatingElements({ progress }: { progress: any }) {
  const y1 = useTransform(progress, [0, 1], ["0vh", "-400vh"]);
  const y2 = useTransform(progress, [0, 1], ["0vh", "-600vh"]);
  const y3 = useTransform(progress, [0, 1], ["0vh", "-300vh"]);
  const y4 = useTransform(progress, [0, 1], ["0vh", "-500vh"]);
  const y5 = useTransform(progress, [0, 1], ["0vh", "-700vh"]);
  
  const rotate1 = useTransform(progress, [0, 1], [0, 720]);
  const rotate2 = useTransform(progress, [0, 1], [0, -540]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-visible h-screen">
      {/* Cluster 1 */}
      <motion.img style={{ top: '20%', left: '10%', y: y1, rotate: rotate1 }} src={LEMON_IMG} className="absolute w-24 md:w-32 opacity-80 blur-[2px]" />
      <motion.img style={{ top: '40%', right: '15%', y: y2, rotate: rotate2 }} src={MINT_IMG} className="absolute w-16 md:w-24 opacity-90" />
      <motion.img style={{ top: '70%', left: '20%', y: y3, rotate: rotate1 }} src={ICE_IMG} className="absolute w-32 md:w-40 opacity-70 blur-[4px]" />
      <motion.img style={{ top: '50%', right: '5%', y: y4, rotate: rotate2 }} src={SPLASH_IMG} className="absolute w-48 md:w-64 opacity-50 mix-blend-screen" />
      
      {/* Cluster 2 */}
      <motion.img style={{ top: '120%', left: '30%', y: y2, rotate: rotate1 }} src={MINT_IMG} className="absolute w-12 md:w-16 opacity-60 blur-[1px]" />
      <motion.img style={{ top: '150%', right: '25%', y: y1, rotate: rotate2 }} src={LEMON_IMG} className="absolute w-32 md:w-40 opacity-90" />
      <motion.img style={{ top: '180%', left: '10%', y: y5, rotate: rotate1 }} src={ICE_IMG} className="absolute w-20 md:w-28 opacity-80" />
      <motion.img style={{ top: '220%', right: '30%', y: y3, rotate: rotate2 }} src={SPLASH_IMG} className="absolute w-64 md:w-72 opacity-40 mix-blend-screen" />

      {/* Cluster 3 */}
      <motion.img style={{ top: '280%', left: '15%', y: y4, rotate: rotate1 }} src={LEMON_IMG} className="absolute w-28 md:w-36 opacity-85 blur-[1px]" />
      <motion.img style={{ top: '320%', right: '10%', y: y2, rotate: rotate2 }} src={MINT_IMG} className="absolute w-20 md:w-24 opacity-95" />
      <motion.img style={{ top: '360%', left: '25%', y: y1, rotate: rotate1 }} src={ICE_IMG} className="absolute w-24 md:w-32 opacity-75 blur-[2px]" />
      <motion.img style={{ top: '400%', right: '20%', y: y5, rotate: rotate2 }} src={SPLASH_IMG} className="absolute w-56 md:w-64 opacity-45 mix-blend-screen" />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="h-screen w-full flex flex-col items-center justify-start pt-24 md:pt-32 relative px-6 shrink-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      <div className="z-20 text-center flex flex-col items-center max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm md:text-base font-bold uppercase tracking-widest mb-6">
            The Original Desi Refresher
          </span>
        </motion.div>
        
        <motion.h1 
          className="text-[12vw] md:text-[10rem] font-black leading-[0.8] text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary to-green-600 drop-shadow-2xl uppercase tracking-tighter"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.1, type: "spring", bounce: 0.4 }}
        >
          Lahori
          <br />
          <span className="text-foreground tracking-tight">Zeera</span>
        </motion.h1>
      </div>
    </section>
  );
}

function StorySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.4 });

  return (
    <section ref={ref} className="h-screen w-full flex items-center relative px-6 lg:px-24 shrink-0">
      <div className="max-w-2xl ml-auto md:mr-12 xl:mr-24 text-right">
        <motion.h2 
          className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.9] uppercase"
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          Zeera Ka <br/><span className="text-primary">Tadka.</span>
        </motion.h2>
        <motion.p 
          className="mt-8 text-xl md:text-2xl text-muted-foreground font-medium"
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Forget boring colas. This is the real deal. Real cumin, rock salt, and that tangy kick that takes you straight back to the roadside thelas of summer afternoons.
        </motion.p>
      </div>
    </section>
  );
}

function IngredientsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const ingredients = [
    { title: "Roasted Zeera", desc: "Earthy, smoky cumin seeds." },
    { title: "Kala Namak", desc: "Black salt for that authentic zing." },
    { title: "Nimbu", desc: "Zesty lemon for ultimate refreshment." },
    { title: "Fizzy Soda", desc: "Crisp bubbles to hit the spot." }
  ];

  return (
    <section ref={ref} className="min-h-screen w-full flex flex-col justify-center relative px-6 lg:px-24 py-24 shrink-0 bg-secondary/20">
      <motion.div 
        className="mb-16 md:mb-24"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9]">Street <br/><span className="text-primary">Science.</span></h2>
        <p className="mt-4 text-xl text-muted-foreground font-medium max-w-md">No artificial nonsense. Just the good stuff blended to perfection.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
        {ingredients.map((item, i) => (
          <motion.div 
            key={i}
            className="p-8 md:p-10 rounded-[2rem] bg-background/40 border border-primary/20 backdrop-blur-md hover:bg-background/60 hover:border-primary/50 transition-colors group"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <div className="w-4 h-4 rounded-full bg-primary" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3">{item.title}</h3>
            <p className="text-muted-foreground font-medium text-lg leading-snug">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CultureSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.4 });

  return (
    <section ref={ref} className="h-screen w-full flex items-center relative px-6 lg:px-24 shrink-0">
      <div className="max-w-2xl md:ml-12 xl:ml-24">
        <motion.h2 
          className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.9] uppercase"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          Garmi Ka <br/><span className="text-primary">Ilaaj.</span>
        </motion.h2>
        <motion.p 
          className="mt-8 text-xl md:text-2xl text-muted-foreground font-medium"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Served ice cold. It's not just a drink, it's an emotion. The perfect balance of sweet, salty, tangy, and fizzy that cuts through the heat like a boss.
        </motion.p>
      </div>
    </section>
  );
}

function RefreshSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.4 });

  return (
    <section ref={ref} className="h-screen w-full flex flex-col items-center justify-center relative px-6 shrink-0 bg-primary text-primary-foreground overflow-hidden">
      {/* Massive scrolling text background */}
      <motion.div 
        className="absolute whitespace-nowrap opacity-10 pointer-events-none flex"
        initial={{ x: "0%" }}
        animate={{ x: "-50%" }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      >
        <h2 className="text-[20rem] font-black uppercase leading-none">REFRESH REFRESH REFRESH REFRESH </h2>
        <h2 className="text-[20rem] font-black uppercase leading-none">REFRESH REFRESH REFRESH REFRESH </h2>
      </motion.div>

      <div className="z-10 text-center max-w-3xl">
        <motion.h2 
          className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          100% Bold.<br/>0% Boring.
        </motion.h2>
        <motion.p 
          className="mt-8 text-2xl font-bold opacity-90"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Pop the cap. Hear the fizz. Feel the spark.
        </motion.p>
      </div>
    </section>
  );
}

function CtaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <section ref={ref} className="h-screen w-full flex flex-col items-center justify-end pb-32 relative px-6 shrink-0 bg-gradient-to-t from-background via-background to-transparent">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      
      <div className="z-20 text-center max-w-5xl mx-auto w-full">
        <motion.h2 
          className="text-[10vw] md:text-[8rem] font-black uppercase leading-[0.85] tracking-tighter"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <span className="text-stroke">Apna Desi</span><br/>
          <span className="text-primary drop-shadow-[0_0_30px_rgba(163,230,53,0.5)]">Thanda</span>
        </motion.h2>
        
        <motion.div 
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button size="lg" className="rounded-full text-xl h-20 px-12 bg-primary text-primary-foreground font-black uppercase tracking-wider hover:bg-primary/90 hover:scale-105 transition-all shadow-[0_0_40px_rgba(163,230,53,0.6)]">
            Grab a Bottle Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
