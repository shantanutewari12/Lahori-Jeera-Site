import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useLocation } from 'wouter';

// ─── Knowledge Base ───────────────────────────────────────────────────────────
const FAQ: { keywords: string[]; answer: string }[] = [
  { keywords: ['flavor','flavour','taste','swad','kaisa'], answer: '🍋 Ek dum unique! Roasted zeera, kala namak, zesty lemon aur crispy soda ka kamaal mix. Cola ko bhool jao!' },
  { keywords: ['ingredient','ingredients','kya hai','cheez','material'], answer: '✅ Natural ingredients:\n• Roasted Zeera\n• Kala Namak\n• Nimbu\n• Fizzy Soda\n\nKoi artificial cheez nahi!' },
  { keywords: ['price','cost','kitna','rate','qeemat','rupees','rs'], answer: '💰 Bahut affordable!\n• 250ml → Rs. 40\n• 500ml → Rs. 70\nBulk orders pe discount bhi!' },
  { keywords: ['available','kahan','where','milta','buy','order','city','lahore','karachi','islamabad'], answer: '📍 In cities mein available:\n• Lahore\n• Karachi\n• Islamabad\n• Faisalabad\nOnline order ke liye Contact page visit karein!' },
  { keywords: ['sugar','calories','healthy','sehat','diet','natural'], answer: '🌿 Natural ingredients, kam sugar. Zeera khud ek digestive herb hai — cola se kaafi better choice!' },
  { keywords: ['size','bottle','ml','pack','quantity'], answer: '🍾 Sizes:\n• 250ml\n• 500ml\n• 1 Litre family pack\n• 6-pack & 24-pack cases' },
  { keywords: ['contact','whatsapp','email','phone'], answer: '📞 Contact:\n• WhatsApp: +92 300 1234567\n• Email: hello@lahorijeera.pk\n9am–6pm available!' },
  { keywords: ['history','story','kahani','brand'], answer: '📖 Lahore ki galiyon ke roadside thelas se inspire hokar humne ye authentic flavor bottle mein band kiya!' },
  { keywords: ['hello','hi','hey','salam','salaam','assalam'], answer: '👋 Assalam o Alaikum! Main Zeera Bot hoon 🍋\nKuch bhi poochein — flavor, price, availability!' },
  { keywords: ['thanks','thank','shukriya'], answer: '😊 Bahut shukriya! Ek baar try karein, doosri baar khud aayenge! 🍋✨' },
  { keywords: ['cold','thanda','ice','kaise piyein'], answer: '🧊 Best experience:\n1. Fridge mein 2-3 ghante\n2. Glass mein ice\n3. Pour karein\n4. Lemon slice se garnish\nEnjoy! 🍋' },
];

const FALLBACK = '🤔 Is sawaal ka jawab nahi pata! Contact page visit karein ya poochein: flavor, price, availability, ingredients.';

function getAnswer(input: string): string {
  const lower = input.toLowerCase();
  for (const faq of FAQ) {
    if (faq.keywords.some(kw => lower.includes(kw))) return faq.answer;
  }
  return FALLBACK;
}

const SUGGESTIONS = ['Flavor kaisa hai?', 'Price kya hai?', 'Kahan milta hai?', 'Healthy hai?'];

interface Message { id: number; from: 'bot' | 'user'; text: string; }

const BOTTLE_IMG = '/lahori-zeera-hero.png';

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Chatbot() {
  const [location] = useLocation();
  const isContactPage = location === '/contact';

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: 'bot', text: '👋 Main Zeera Bot hoon!\nKuch bhi poochein 🍋' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const msgId = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Walking state ──
  const [pos, setPos] = useState({ x: window.innerWidth - 120, y: window.innerHeight - 160 });
  const [targetPos, setTargetPos] = useState({ x: window.innerWidth - 120, y: window.innerHeight - 160 });
  const [facingLeft, setFacingLeft] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const posRef = useRef(pos);
  const openRef = useRef(open);
  const controls = useAnimation();

  // ── Sitting jump (contact page only) ──
  const [sittingJump, setSittingJump] = useState(false);

  posRef.current = pos;
  openRef.current = open;

  const CHAR_W = 90;
  const CHAR_H = 120;

  // Fixed sitting position: right side, vertically centered
  const SITTING_X = window.innerWidth - 150;
  const SITTING_Y = window.innerHeight / 2 - 80;

  const randomSayings = [
    '🍋 Pee lo Lahori Zeera!', 'Garmi ka ilaaj yahan hai!', '100% Natural! 😎',
    'Ek try zaroor karo!', 'Kuch poochna hai? 👆', 'Desi refresher #1! 🏆', 'Zeera power! 💪',
  ];

  const pickNewTarget = useCallback(() => {
    const margin = 80;
    const nx = margin + Math.random() * (window.innerWidth - CHAR_W - margin * 2);
    const ny = margin + Math.random() * (window.innerHeight - CHAR_H - margin * 2);
    setTargetPos({ x: nx, y: ny });
    setFacingLeft(nx < posRef.current.x);
  }, []);

  // Walk loop — paused on contact page
  useEffect(() => {
    if (open || isContactPage) return;
    let raf: number;
    const speed = 1.8;
    const step = () => {
      setPos(prev => {
        const dx = targetPos.x - prev.x;
        const dy = targetPos.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 4) return prev;
        return { x: prev.x + (dx / dist) * speed, y: prev.y + (dy / dist) * speed };
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [targetPos, open, isContactPage]);

  // Sitting jump interval — only on contact page
  useEffect(() => {
    if (!isContactPage || open) return;
    const t = setInterval(() => {
      setSittingJump(true);
      const saying = randomSayings[Math.floor(Math.random() * randomSayings.length)];
      setSpeechBubble(saying);
      setTimeout(() => { setSittingJump(false); setSpeechBubble(null); }, 700);
    }, 2800);
    return () => clearInterval(t);
  }, [isContactPage, open]);

  // Pick new target when near old one — skip on contact page
  useEffect(() => {
    if (open || isContactPage) return;
    const dx = targetPos.x - pos.x;
    const dy = targetPos.y - pos.y;
    if (Math.sqrt(dx * dx + dy * dy) < 8) {
      const action = Math.random();
      if (action < 0.3) {
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 600);
      } else if (action < 0.5) {
        setIsBouncing(true);
        const saying = randomSayings[Math.floor(Math.random() * randomSayings.length)];
        setSpeechBubble(saying);
        setTimeout(() => { setIsBouncing(false); setSpeechBubble(null); }, 2000);
      }
      setTimeout(pickNewTarget, 400);
    }
  }, [pos, targetPos, open, isContactPage, pickNewTarget]);

  // Random speech bubbles while walking (not on contact page — contact has its own)
  useEffect(() => {
    if (open || isContactPage) return;
    const t = setInterval(() => {
      if (Math.random() < 0.25) {
        const saying = randomSayings[Math.floor(Math.random() * randomSayings.length)];
        setSpeechBubble(saying);
        setTimeout(() => setSpeechBubble(null), 2200);
      }
    }, 4000);
    return () => clearInterval(t);
  }, [open, isContactPage]);

  // Initial random walk
  useEffect(() => { setTimeout(pickNewTarget, 1000); }, [pickNewTarget]);

  // Scroll to bottom
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 300); }, [open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: msgId.current++, from: 'user', text: text.trim() }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: msgId.current++, from: 'bot', text: getAnswer(text) }]);
      setIsTyping(false);
    }, 700 + Math.random() * 500);
  };

  const walkAnim = {
    y: isJumping ? [0, -60, 0] : isBouncing ? [0, -15, 0, -8, 0] : [0, -8, 0],
    rotate: isJumping ? [0, -15, 15, 0] : [facingLeft ? -3 : 3, facingLeft ? 3 : -3, facingLeft ? -3 : 3],
    scaleX: facingLeft ? -1 : 1,
  };

  // Sitting animation (contact page)
  const sittingAnim = {
    y: sittingJump ? [0, -55, 0] : [0, -6, 0],
    rotate: sittingJump ? [-10, 10, -5, 0] : [0, 0, 0],
    scaleX: -1, // face left toward the form
  };

  return (
    <>
      {/* ── Walking / Sitting Bottle Character ── */}
      <AnimatePresence>
        {!open && (
          <motion.div
            style={{
              position: 'fixed',
              left: isContactPage ? SITTING_X : pos.x,
              top: isContactPage ? SITTING_Y : pos.y,
              zIndex: 9999, cursor: 'pointer', userSelect: 'none',
              transition: isContactPage ? 'left 0.8s cubic-bezier(.4,0,.2,1), top 0.8s cubic-bezier(.4,0,.2,1)' : 'none',
            }}
            animate={isContactPage ? sittingAnim : walkAnim}
            transition={
              isContactPage
                ? sittingJump
                  ? { duration: 0.55, ease: [0.4, 0, 0.2, 1] }
                  : { y: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } }
                : isJumping
                  ? { duration: 0.5, ease: 'easeOut' }
                  : isBouncing
                  ? { duration: 0.4, repeat: 1, ease: 'easeInOut' }
                  : { y: { duration: 0.35, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 0.35, repeat: Infinity, ease: 'easeInOut' }, scaleX: { duration: 0.1 } }
            }
            onClick={() => setOpen(true)}
            whileHover={{ scale: 1.18 }}
            whileTap={{ scale: 0.88, rotate: 20 }}
          >
            {/* Speech Bubble */}
            <AnimatePresence>
              {speechBubble && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.6, y: 10 }}
                  style={{
                    position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, hsl(75 94% 57%), hsl(75 80% 45%))',
                    color: 'hsl(142 71% 10%)', borderRadius: '16px', padding: '8px 14px',
                    fontSize: '12px', fontWeight: 800, whiteSpace: 'nowrap',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)', pointerEvents: 'none',
                  }}
                >
                  {speechBubble}
                  <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '8px solid hsl(75 80% 45%)' }} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Character wrapper */}
            <div style={{ position: 'relative', width: 110, height: 150 }}>

              {/* Outer pulsing ring – orange */}
              <motion.div
                animate={{ scale: [1, 1.55, 1], opacity: [0.9, 0, 0.9] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                style={{ position: 'absolute', inset: -18, borderRadius: '50%', border: '3px solid #ff6b00', boxShadow: '0 0 24px 6px #ff6b00aa' }}
              />
              {/* Mid ring – yellow */}
              <motion.div
                animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
                style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: '2px solid #ffe100', boxShadow: '0 0 16px 4px #ffe100aa' }}
              />

              {/* Bright platform bubble behind bottle */}
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '50% 50% 40% 40%',
                background: 'radial-gradient(circle at 40% 35%, #ffffff22, #ff6b0033 60%, transparent 85%)',
                border: '2px solid #ff6b00cc',
                boxShadow: '0 0 30px 8px #ff6b0066, inset 0 0 20px #ffffff11',
              }} />

              {/* Bottle image */}
              <motion.img
                src={BOTTLE_IMG}
                alt="Lahori Zeera Bot"
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 2 }}
                animate={{ filter: [
                  'drop-shadow(0 0 10px #ff6b00) drop-shadow(0 0 3px #fff)',
                  'drop-shadow(0 0 28px #ff6b00) drop-shadow(0 0 10px #ffe100)',
                  'drop-shadow(0 0 10px #ff6b00) drop-shadow(0 0 3px #fff)',
                ]}}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* ZEERA BOT badge */}
              <motion.div
                animate={{ y: [0, -4, 0], scale: [1, 1.06, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', top: -36, left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(90deg, #ff6b00, #ffe100)',
                  color: '#1a0a00', borderRadius: 20, padding: '5px 13px',
                  fontSize: 11, fontWeight: 900, whiteSpace: 'nowrap', letterSpacing: 1,
                  boxShadow: '0 4px 18px #ff6b0088, 0 0 0 2px #fff3',
                  zIndex: 5,
                }}
              >
                🍋 ZEERA BOT
              </motion.div>

              {/* Shadow on ground */}
              <motion.div
                animate={{ scaleX: [1, 0.75, 1], opacity: [0.6, 0.25, 0.6] }}
                transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)', width: 70, height: 14, borderRadius: '50%', background: 'rgba(255,107,0,0.35)', filter: 'blur(6px)', zIndex: 1 }}
              />

              {/* Legs */}
              <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 12, zIndex: 3 }}>
                {[0, 1].map(i => (
                  <motion.div
                    key={i}
                    animate={{ rotate: [22, -22, 22], y: [0, -5, 0] }}
                    transition={{ duration: 0.32, repeat: Infinity, ease: 'easeInOut', delay: i * 0.16 }}
                    style={{ width: 13, height: 28, background: 'linear-gradient(180deg, #ff6b00, #b84500)', borderRadius: '0 0 10px 10px', transformOrigin: 'top center', boxShadow: '0 3px 10px #ff6b0077' }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat Window (opens when tapped) ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="chatbot-window"
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 40 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            style={{
              position: 'fixed', bottom: 24, right: 24, zIndex: 9998,
              width: 360, maxWidth: 'calc(100vw - 24px)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              borderRadius: 28, border: '1.5px solid hsl(75 94% 57% / 0.4)',
              background: 'linear-gradient(160deg, hsl(142 71% 13%), hsl(142 71% 9%))',
              boxShadow: '0 8px 60px rgba(0,0,0,0.6), 0 0 40px hsl(75 94% 57% / 0.15)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid hsl(142 70% 22%)', background: 'hsl(142 71% 11%)' }}>
              <motion.div
                animate={{ rotate: [-8, 8, -8] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: '2px solid hsl(75 94% 57%)', flexShrink: 0 }}
              >
                <img src={BOTTLE_IMG} alt="bot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 900, fontSize: 14, color: 'hsl(60 100% 95%)' }}>Zeera Bot 🍋</p>
                <p style={{ margin: 0, fontSize: 11, color: 'hsl(75 94% 57%)', fontWeight: 700 }}>Lahori Zeera • Online ✅</p>
              </div>
              <motion.button
                onClick={() => { setOpen(false); setTimeout(pickNewTarget, 300); }}
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.85 }}
                style={{ background: 'hsl(142 71% 20%)', border: '1px solid hsl(142 70% 30%)', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(60 100% 95%)', fontSize: 16, fontWeight: 900 }}
              >×</motion.button>
            </div>

            {/* Messages */}
            <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320 }}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}
                >
                  <div style={{
                    maxWidth: '82%', padding: '10px 14px', borderRadius: msg.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    fontSize: 13, fontWeight: 600, whiteSpace: 'pre-wrap', lineHeight: 1.5,
                    background: msg.from === 'user' ? 'linear-gradient(135deg, hsl(75 94% 57%), hsl(75 80% 46%))' : 'hsl(142 71% 19%)',
                    color: msg.from === 'user' ? 'hsl(142 71% 10%)' : 'hsl(60 100% 95%)',
                    border: msg.from === 'bot' ? '1px solid hsl(142 70% 26%)' : 'none',
                  }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex' }}>
                  <div style={{ padding: '10px 16px', borderRadius: '18px 18px 18px 4px', background: 'hsl(142 71% 19%)', border: '1px solid hsl(142 70% 26%)' }}>
                    <div style={{ display: 'flex', gap: 5, alignItems: 'center', height: 16 }}>
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                          style={{ width: 7, height: 7, borderRadius: '50%', background: 'hsl(75 94% 57%)' }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            <div className="hide-scrollbar" style={{ padding: '8px 16px', display: 'flex', gap: 8, overflowX: 'auto', borderTop: '1px solid hsl(142 70% 22%)' }}>
              {SUGGESTIONS.map(s => (
                <motion.button key={s} onClick={() => sendMessage(s)} whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.92 }}
                  style={{ flexShrink: 0, padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, cursor: 'pointer', background: 'hsl(142 71% 20%)', border: '1px solid hsl(75 94% 57% / 0.4)', color: 'hsl(75 94% 70%)' }}>
                  {s}
                </motion.button>
              ))}
            </div>

            {/* Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderTop: '1px solid hsl(142 70% 22%)' }}>
              <input
                ref={inputRef} id="chatbot-input" type="text" value={input}
                onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                placeholder="Kuch poochein... 🍋"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, fontWeight: 600, color: 'hsl(60 100% 95%)', fontFamily: 'inherit' }}
              />
              <motion.button
                id="chatbot-send" onClick={() => sendMessage(input)} disabled={!input.trim()}
                whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
                style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', opacity: input.trim() ? 1 : 0.4, background: 'linear-gradient(135deg, hsl(75 94% 57%), hsl(142 71% 35%))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="hsl(142 71% 10%)" stroke="none"><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
