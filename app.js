/**
 * HAPPY DIWALI - PREMIUM INTERACTIVE GREETING CARD
 * Complete React Application with 3D Card, Web Audio Synthesizer,
 * Canvas Fireworks, Interactive Diyas, Sparkler Mode, Personalization & Sharing.
 */

const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ==========================================
// 1. WEB AUDIO SYNTHESIZER (Zero External Audio Dependencies)
// ==========================================
class FestiveAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMusicPlaying = false;
    this.musicTimer = null;
    this.musicStep = 0;
    // Raag Bhupali / Yaman celebratory scale frequencies (Sa, Re, Ga, Pa, Dha)
    this.scale = [220, 247.5, 277.18, 329.63, 369.99, 440, 495, 554.37, 659.25];
    this.tanpuraDroneNodes = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Sacred Temple Bell / Aarti Ghanti Sound
  playBell() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const freqs = [880, 1760, 2640, 3520];
    const gains = [0.25, 0.15, 0.08, 0.04];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq + (Math.random() * 4 - 2), now);

      gain.gain.setValueAtTime(gains[idx], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.6);
    });
  }

  // Diya Ignition Chime + Warm Match strike
  playDiyaLight() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Harmonic celestial chime
    const chord = [523.25, 659.25, 783.99, 1046.5]; // C Major festive
    chord.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);

      gain.gain.setValueAtTime(0.12, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + i * 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + 1.3 + i * 0.05);
    });
  }

  // Fireworks Launch & Burst Sound
  playFirework() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Sub-bass thump
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);

    // Crackle noise burst
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now + 0.05);
    filter.Q.setValueAtTime(3, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now + 0.05);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now + 0.05);
  }

  // Sparkler crackle pop
  playSparklerPop() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(2000 + Math.random() * 3000, now);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Surprise Unbox Celestial Arpeggio
  playSurprise() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);

      gain.gain.setValueAtTime(0.15, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + i * 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + 1.3 + i * 0.07);
    });
  }

  // Sitar / Tanpura Ambient Indian Melody Synthesizer
  toggleMusic(onUpdate) {
    this.init();
    if (!this.ctx) return false;

    if (this.isMusicPlaying) {
      this.stopMusic();
      if (onUpdate) onUpdate(false);
      return false;
    } else {
      this.startMusic();
      if (onUpdate) onUpdate(true);
      return true;
    }
  }

  startMusic() {
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    // Start soothing Tanpura drone
    const droneFreqs = [110, 164.81, 220]; // A2, E3, A3
    const droneNodes = [];
    droneFreqs.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      droneNodes.push({ osc, gain });
    });
    this.tanpuraDroneNodes = droneNodes;

    // Sitar melodic sequence player
    const melodyPattern = [
      0, 1, 2, 4, 5, 4, 2, 1,
      0, 2, 4, 7, 5, 4, 2, 0,
      1, 2, 4, 5, 7, 8, 7, 5,
      4, 2, 1, 2, 4, 2, 1, 0
    ];

    const playNextNote = () => {
      if (!this.isMusicPlaying || !this.ctx) return;
      const noteIdx = melodyPattern[this.musicStep % melodyPattern.length];
      const freq = this.scale[noteIdx % this.scale.length];
      
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Sitar-like timbre: sawtooth with resonant lowpass filter envelope
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.6);
      filter.Q.setValueAtTime(6, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);

      this.musicStep++;
      // Natural human rhythm variations (festive taal)
      const tempo = 380 + (Math.sin(this.musicStep * 0.4) * 40);
      this.musicTimer = setTimeout(playNextNote, tempo);
    };

    playNextNote();
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.tanpuraDroneNodes) {
      this.tanpuraDroneNodes.forEach(({ osc, gain }) => {
        try {
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
          setTimeout(() => osc.stop(), 550);
        } catch(e) {}
      });
      this.tanpuraDroneNodes = null;
    }
  }
}

const audio = new FestiveAudioEngine();


// ==========================================
// 2. CANVAS FIREWORKS & SKY LANTERNS ENGINE
// ==========================================
function FireworksCanvas({ triggerBurstRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle arrays
    const rockets = [];
    const particles = [];
    const stars = [];
    const lanterns = [];

    // Colors matching luxury festive palette
    const colors = [
      '#f59e0b', // Amber Gold
      '#fbbf24', // Bright Gold
      '#ffd700', // Metallic Gold
      '#f43f5e', // Rose Pink
      '#ec4899', // Pink Highlight
      '#ff7828', // Flame Orange
      '#38bdf8', // Sky Blue
      '#c084fc', // Royal Lavender
      '#ffffff'  // Sparkling Diamond
    ];

    // Initialize Twinkling Stars
    const starCount = Math.min(80, Math.floor(width / 18));
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.8),
        size: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Initialize Floating Sky Lanterns
    const lanternCount = Math.min(12, Math.floor(width / 100));
    for (let i = 0; i < lanternCount; i++) {
      lanterns.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speedY: Math.random() * 0.4 + 0.25,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayRange: Math.random() * 25 + 10,
        swayPhase: Math.random() * Math.PI * 2,
        size: Math.random() * 12 + 16,
        alpha: Math.random() * 0.4 + 0.55
      });
    }

    // Launch Firework Rocket
    const launchRocket = (startX, startY, targetX, targetY, customColor) => {
      const angle = Math.atan2(targetY - startY, targetX - startX);
      const distance = Math.hypot(targetX - startX, targetY - startY);
      const speed = Math.min(12, distance / 28);

      rockets.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        targetX,
        targetY,
        color: customColor || colors[Math.floor(Math.random() * colors.length)],
        trail: []
      });
    };

    // Burst Firework Explosion
    const burst = (x, y, color) => {
      audio.playFirework();
      const count = 75 + Math.floor(Math.random() * 45);
      const isWillow = Math.random() > 0.6; // Weeping golden willow sparks

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.2 - 0.1);
        const speed = Math.random() * 5 + 1.8;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: isWillow ? '#ffd700' : (Math.random() > 0.2 ? color : '#ffffff'),
          alpha: 1,
          decay: isWillow ? Math.random() * 0.012 + 0.008 : Math.random() * 0.022 + 0.012,
          size: Math.random() * 2.6 + 1.2,
          gravity: isWillow ? 0.07 : 0.05,
          flicker: Math.random() > 0.3
        });
      }
    };

    // Public grand burst trigger
    if (triggerBurstRef) {
      triggerBurstRef.current = (num = 5) => {
        for (let i = 0; i < num; i++) {
          setTimeout(() => {
            const sx = width * (0.2 + Math.random() * 0.6);
            const sy = height;
            const tx = width * (0.15 + Math.random() * 0.7);
            const ty = height * (0.15 + Math.random() * 0.4);
            launchRocket(sx, sy, tx, ty);
          }, i * 260);
        }
      };
    }

    // Occasional subtle background rocket
    let lastAutoRocket = Date.now();

    // Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Stars
      stars.forEach(star => {
        star.phase += star.speed;
        const currentAlpha = star.alpha * (0.6 + 0.4 * Math.sin(star.phase));
        ctx.fillStyle = `rgba(254, 240, 138, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Floating Sky Lanterns
      lanterns.forEach(lantern => {
        lantern.y -= lantern.speedY;
        lantern.swayPhase += lantern.swaySpeed;
        const drawX = lantern.x + Math.sin(lantern.swayPhase) * lantern.swayRange;

        if (lantern.y < -50) {
          lantern.y = height + 50;
          lantern.x = Math.random() * width;
        }

        // Lantern glowing aura
        const gradient = ctx.createRadialGradient(
          drawX, lantern.y, 1,
          drawX, lantern.y, lantern.size * 2
        );
        gradient.addColorStop(0, `rgba(255, 180, 50, ${lantern.alpha * 0.9})`);
        gradient.addColorStop(0.5, `rgba(234, 88, 12, ${lantern.alpha * 0.4})`);
        gradient.addColorStop(1, 'rgba(234, 88, 12, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(drawX, lantern.y, lantern.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Lantern paper body
        ctx.fillStyle = `rgba(255, 215, 120, ${lantern.alpha})`;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(drawX - lantern.size * 0.5, lantern.y - lantern.size * 0.7, lantern.size, lantern.size * 1.3, 4);
        } else {
          ctx.rect(drawX - lantern.size * 0.5, lantern.y - lantern.size * 0.7, lantern.size, lantern.size * 1.3);
        }
        ctx.fill();

        // Warm light core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(drawX, lantern.y + lantern.size * 0.2, lantern.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Update & Draw Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;

        // Add trail
        r.trail.push({ x: r.x, y: r.y, alpha: 1 });
        if (r.trail.length > 8) r.trail.shift();

        // Draw trail sparks
        r.trail.forEach(t => {
          ctx.fillStyle = `rgba(251, 191, 36, ${t.alpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
          ctx.fill();
          t.alpha -= 0.1;
        });

        // Rocket head
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Check if reached destination
        const dist = Math.hypot(r.targetX - r.x, r.targetY - r.y);
        if (dist < 15 || r.y <= r.targetY) {
          burst(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // 4. Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= 0.98;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const renderAlpha = p.flicker ? p.alpha * (Math.random() * 0.4 + 0.6) : p.alpha;
        ctx.save();
        ctx.globalAlpha = Math.max(0, renderAlpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Subtle ambient firework every 7-10s
      if (Date.now() - lastAutoRocket > 8500 && Math.random() < 0.25) {
        lastAutoRocket = Date.now();
        launchRocket(
          width * (0.3 + Math.random() * 0.4),
          height,
          width * (0.2 + Math.random() * 0.6),
          height * (0.18 + Math.random() * 0.35)
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Click on canvas to launch firework at click coordinates
    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      launchRocket(width * (0.3 + Math.random() * 0.4), height, clickX, clickY);
    };
    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [triggerBurstRef]);

  return <canvas id="fireworks-canvas" ref={canvasRef} />;
}


// ==========================================
// 3. INTERACTIVE SPARKLER (PHULJHADI) CANVAS
// ==========================================
function SparklerCanvas({ active, onDeactivate }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const sparks = [];
    let isMouseDown = false;
    let pointerX = width / 2;
    let pointerY = height / 2;
    let lastSound = 0;

    const createSparksAt = (x, y, count = 14) => {
      if (Date.now() - lastSound > 60) {
        audio.playSparklerPop();
        lastSound = Date.now();
      }

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 9 + 3;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: Math.random() * 0.04 + 0.02,
          length: Math.random() * 12 + 6,
          color: Math.random() > 0.3 ? '#fef08a' : (Math.random() > 0.5 ? '#ffae19' : '#ffffff')
        });
      }
    };

    const handlePointerMove = (e) => {
      pointerX = e.clientX || (e.touches && e.touches[0].clientX);
      pointerY = e.clientY || (e.touches && e.touches[0].clientY);
      createSparksAt(pointerX, pointerY, 8);
    };

    const handlePointerDown = (e) => {
      isMouseDown = true;
      handlePointerMove(e);
    };

    const handlePointerUp = () => {
      isMouseDown = false;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Continuously emit sparks while active
      createSparksAt(pointerX, pointerY, 3);

      // Glowing phuljhadi tip
      const tipGlow = ctx.createRadialGradient(pointerX, pointerY, 2, pointerX, pointerY, 24);
      tipGlow.addColorStop(0, '#ffffff');
      tipGlow.addColorStop(0.3, '#ffae19');
      tipGlow.addColorStop(1, 'rgba(234, 88, 12, 0)');
      ctx.fillStyle = tipGlow;
      ctx.beginPath();
      ctx.arc(pointerX, pointerY, 24, 0, Math.PI * 2);
      ctx.fill();

      // Render all flying sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.15; // gravity
        s.life -= s.decay;

        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.life * 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 1.5, s.y - s.vy * 1.5);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto cursor-crosshair">
      <canvas id="sparkler-canvas" ref={canvasRef} className="w-full h-full" />
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 glass-panel px-6 py-2.5 rounded-full flex items-center gap-3 border border-yellow-400 shadow-2xl pointer-events-auto">
        <span className="text-xl animate-bounce">🎇</span>
        <span className="text-yellow-200 font-medium text-sm sm:text-base">
          Move your finger or mouse to wave the magical sparkler!
        </span>
        <button
          onClick={onDeactivate}
          className="ml-2 bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full transition-all"
        >
          Done ✕
        </button>
      </div>
    </div>
  );
}


// ==========================================
// 4. REALISTIC ORNATE CLAY DIYA COMPONENT
// ==========================================
function ClayDiya({ isLit = true, onToggle, size = 'large', label = null }) {
  const isSmall = size === 'small';
  const width = isSmall ? 64 : 110;
  const height = isSmall ? 56 : 95;

  return (
    <div
      onClick={onToggle}
      className={`relative inline-flex flex-col items-center select-none cursor-pointer group transition-all duration-300 ${!isLit ? 'opacity-65 filter grayscale hover:grayscale-0 hover:opacity-100' : ''}`}
      style={{ width: `${width}px` }}
      title={isLit ? "Click to toggle diya" : "Click to ignite diya flame!"}
    >
      {/* Dynamic Warm Flame Glow Halo */}
      {isLit && (
        <div
          className="absolute -top-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full pointer-events-none transition-all duration-500"
          style={{
            background: 'radial-gradient(circle, rgba(255, 174, 25, 0.55) 0%, rgba(234, 88, 12, 0.25) 50%, transparent 75%)',
            transform: 'scale(1.2)'
          }}
        />
      )}

      {/* Flame Container */}
      <div className="h-10 sm:h-14 flex items-end justify-center relative z-10">
        {isLit ? (
          <div className="diya-flame-wrapper">
            <svg
              width={isSmall ? "24" : "34"}
              height={isSmall ? "36" : "50"}
              viewBox="0 0 40 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-lg"
            >
              {/* Outer Amber Flare */}
              <path
                d="M20 2C20 2 36 24 36 40C36 51 28.8 58 20 58C11.2 58 4 51 4 40C4 24 20 2 20 2Z"
                fill="url(#outerFlameGrad)"
              />
              {/* Middle Golden Flame */}
              <path
                d="M20 14C20 14 31 30 31 42C31 49.7 26 55 20 55C14 55 9 49.7 9 42C9 30 20 14 20 14Z"
                fill="url(#midFlameGrad)"
                className="diya-core-flame"
              />
              {/* Inner Bright Yellow / White Core */}
              <path
                d="M20 26C20 26 26 36 26 44C26 48.4 23.3 52 20 52C16.7 52 14 48.4 14 44C14 36 20 26 20 26Z"
                fill="url(#innerFlameGrad)"
              />
              {/* Blue Core Base */}
              <ellipse cx="20" cy="51" rx="4" ry="2.5" fill="#38bdf8" opacity="0.8" />

              <defs>
                <radialGradient id="outerFlameGrad" cx="50%" cy="65%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="60%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.85" />
                </radialGradient>
                <radialGradient id="midFlameGrad" cx="50%" cy="60%" r="50%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="60%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f97316" />
                </radialGradient>
                <radialGradient id="innerFlameGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="70%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        ) : (
          <div className="w-1 h-3 bg-amber-900 rounded-t-sm mb-1 opacity-70" title="Unlit wick" />
        )}
      </div>

      {/* Terracotta / Brass Diya Body */}
      <svg
        width={width}
        height={height * 0.55}
        viewBox="0 0 120 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-0 filter drop-shadow-md transition-transform group-hover:scale-105"
      >
        <defs>
          <linearGradient id="clayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="40%" stopColor="#9a3412" />
            <stop offset="85%" stopColor="#7c2d12" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="rimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="oilGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ca8a04" />
            <stop offset="50%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>

        {/* Diya Base Pedestal */}
        <ellipse cx="60" cy="54" rx="28" ry="5" fill="#451a03" opacity="0.6" />

        {/* Outer Clay Bowl */}
        <path
          d="M10 18 C15 48 40 56 60 56 C80 56 105 48 110 18 C95 24 75 26 60 26 C45 26 25 24 10 18 Z"
          fill="url(#clayGrad)"
        />

        {/* Diya Rim with Gold Carving */}
        <ellipse cx="60" cy="18" rx="50" ry="10" fill="url(#clayGrad)" stroke="url(#rimGrad)" strokeWidth="2" />

        {/* Fragrant Mustard Oil Surface */}
        <ellipse cx="60" cy="19" rx="42" ry="7" fill="url(#oilGrad)" opacity={isLit ? "0.9" : "0.5"} />

        {/* Cotton Wick Spout */}
        <path d="M56 19 Q60 12 64 19 Z" fill="#451a03" />

        {/* Traditional Ornamental dots */}
        <circle cx="35" cy="34" r="2" fill="#fbbf24" opacity="0.8" />
        <circle cx="48" cy="40" r="2" fill="#fbbf24" opacity="0.8" />
        <circle cx="60" cy="42" r="2.5" fill="#fbbf24" opacity="0.9" />
        <circle cx="72" cy="40" r="2" fill="#fbbf24" opacity="0.8" />
        <circle cx="85" cy="34" r="2" fill="#fbbf24" opacity="0.8" />
      </svg>

      {/* Label (if provided) */}
      {label && (
        <span className={`mt-1.5 text-xs font-medium tracking-wide text-center transition-colors ${isLit ? 'text-yellow-300 font-semibold drop-shadow' : 'text-purple-300/60'}`}>
          {label}
        </span>
      )}
    </div>
  );
}


// ==========================================
// 5. SACRED 7 DIYAS ALTAR COMPONENT
// ==========================================
function DiyasAltar({ onAllLit }) {
  const diyaDefinitions = useMemo(() => [
    { id: 1, name: 'Arogya', blessing: 'Health & Vitality', defaultLit: true },
    { id: 2, name: 'Lakshmi', blessing: 'Wealth & Abundance', defaultLit: true },
    { id: 3, name: 'Saraswati', blessing: 'Wisdom & Knowledge', defaultLit: true },
    { id: 4, name: 'Shanti', blessing: 'Peace & Serenity', defaultLit: false },
    { id: 5, name: 'Ananda', blessing: 'Joy & Laughter', defaultLit: false },
    { id: 6, name: 'Vijaya', blessing: 'Victory & Success', defaultLit: false },
    { id: 7, name: 'Prema', blessing: 'Love & Family', defaultLit: false },
  ], []);

  const [litSet, setLitSet] = useState(new Set([1, 2, 3]));
  const [hasTriggeredAll, setHasTriggeredAll] = useState(false);

  const toggleDiya = (id) => {
    setLitSet(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        audio.playDiyaLight();
      }
      return next;
    });
  };

  const lightAll = () => {
    audio.playDiyaLight();
    setLitSet(new Set(diyaDefinitions.map(d => d.id)));
  };

  useEffect(() => {
    if (litSet.size === diyaDefinitions.length && !hasTriggeredAll) {
      setHasTriggeredAll(true);
      if (onAllLit) onAllLit();
    }
  }, [litSet, diyaDefinitions.length, hasTriggeredAll, onAllLit]);

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-amber-400/30 relative overflow-hidden">
        {/* Subtle Rangoli watermark */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 opacity-10 pointer-events-none rotating-rangoli">
          <svg viewBox="0 0 100 100" fill="currentColor" className="text-yellow-400 w-full h-full">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
            <polygon points="50,10 62,38 92,38 68,56 77,85 50,68 23,85 32,56 8,38 38,38" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5 border-b border-purple-500/30 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🪔</span>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-yellow-300 tracking-wider">
                Light the 7 Sacred Diyas of Prosperity
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-purple-200/80 mt-1">
              Touch any diya to ignite its sacred flame and receive its unique blessing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="festive-pill text-xs font-semibold">
              ✨ Lit: {litSet.size} / 7
            </span>
            {litSet.size < 7 && (
              <button
                onClick={lightAll}
                className="text-xs btn-festive-secondary px-3 py-1.5 rounded-full flex items-center gap-1.5"
              >
                <span>Light All</span>
                <span>🔥</span>
              </button>
            )}
          </div>
        </div>

        {/* Diyas Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-2 justify-items-center">
          {diyaDefinitions.map(diya => (
            <div
              key={diya.id}
              className={`p-2.5 rounded-2xl transition-all duration-300 w-full flex flex-col items-center justify-center ${
                litSet.has(diya.id)
                  ? 'bg-amber-500/10 border border-amber-400/40 shadow-lg shadow-amber-900/20'
                  : 'bg-purple-900/20 border border-purple-800/40 hover:border-amber-400/30'
              }`}
            >
              <ClayDiya
                isLit={litSet.has(diya.id)}
                onToggle={() => toggleDiya(diya.id)}
                size="small"
              />
              <span className={`text-xs font-heading font-semibold mt-1 tracking-wider ${
                litSet.has(diya.id) ? 'text-yellow-300' : 'text-purple-300/60'
              }`}>
                {diya.name}
              </span>
              <span className="text-[10px] text-center text-purple-200/70 leading-tight mt-0.5">
                {diya.blessing}
              </span>
            </div>
          ))}
        </div>

        {/* All Lit Achievement Banner */}
        {litSet.size === 7 && (
          <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-amber-500/20 border border-yellow-400/50 text-center animate-pulse">
            <span className="text-yellow-200 text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
              <span>🌟</span>
              <span>All 7 Diyas are glowing! May all divine blessings fill your home this Diwali!</span>
              <span>🌟</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}


// ==========================================
// 6. "ONE MORE SURPRISE 🎁" MODAL
// ==========================================
function SurpriseModal({ isOpen, onClose }) {
  const wishes = useMemo(() => [
    {
      title: "Radiance & Vitality 🌿",
      wish: "May your life shine brighter than a thousand diyas, filling every single day with energy, good health, and joyful vigor.",
      blessing: "Arogya Lakshmi",
      emoji: "🪔"
    },
    {
      title: "Infinite Prosperity 💰",
      wish: "May Goddess Lakshmi open the gates of golden opportunities and shower your household with limitless abundance.",
      blessing: "Dhana Lakshmi",
      emoji: "🪙"
    },
    {
      title: "Harmony & Warmth 💖",
      wish: "May your home always echo with happy laughter, warmth, forgiveness, and unconditional love that never fades.",
      blessing: "Sukha & Shanti",
      emoji: "🌸"
    },
    {
      title: "Sweet Moments & Celebrations 🍯",
      wish: "May your year be as delightfully sweet as warm Gulab Jamuns, as rich as Kaju Katli, and as colorful as a grand Rangoli!",
      blessing: "Madhur Ananda",
      emoji: "✨"
    },
    {
      title: "Victory & Unstoppable Dreams 🚀",
      wish: "Like a rocket soaring into the Diwali night sky, may all your aspirations break through any ceiling and shine high!",
      blessing: "Vijaya Bhavah",
      emoji: "🎆"
    },
    {
      title: "Peace in Your Soul 🕊️",
      wish: "May every flame you gaze upon dissolve away stress, worry, and doubt, gifting you tranquil inner peace.",
      blessing: "Shanti Prapti",
      emoji: "🪷"
    },
    {
      title: "Auspicious New Beginnings 🌅",
      wish: "Lord Ganesha blesses you today with clear wisdom and removes every obstacle standing between you and your triumphs.",
      blessing: "Vighnaharta",
      emoji: "🐘"
    },
    {
      title: "Cherished Friendships & Bonds 🤝",
      wish: "May this festival reconnect you with treasured friends and weave bonds of loyalty and warmth that last a lifetime.",
      blessing: "Maitri Bandhan",
      emoji: "❤️"
    }
  ], []);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      audio.playSurprise();
      setCurrentIdx(Math.floor(Math.random() * wishes.length));
      setCopied(false);
      if (window.confetti) {
        window.confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffd700', '#f59e0b', '#ec4899', '#f43f5e']
        });
      }
    }
  }, [isOpen, wishes.length]);

  if (!isOpen) return null;

  const current = wishes[currentIdx];

  const handleNextWish = () => {
    audio.playSurprise();
    setCurrentIdx(prev => (prev + 1) % wishes.length);
    setCopied(false);
    if (window.confetti) {
      window.confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#ffd700', '#fbbf24', '#f43f5e']
      });
    }
  };

  const handleCopy = () => {
    const text = `✨ ${current.title} ✨\n\n"${current.wish}"\n\nWishing you a Happy Diwali! 🪔❤️`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWishWhatsApp = () => {
    const text = `✨ *${current.title}* ✨\n\n"${current.wish}"\n\n🪔 Happy Diwali! Wishing you and your family abundant blessings ❤️\n${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box text-center" onClick={e => e.stopPropagation()}>
        {/* Ornate Gold Corners */}
        <div className="gold-filigree-border" />
        <div className="gold-corner gold-corner-tl" />
        <div className="gold-corner gold-corner-tr" />
        <div className="gold-corner gold-corner-bl" />
        <div className="gold-corner gold-corner-br" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-300 hover:text-yellow-300 text-lg w-8 h-8 rounded-full flex items-center justify-center bg-purple-900/40 border border-purple-500/30 transition-all z-20"
        >
          ✕
        </button>

        <div className="inline-block p-4 rounded-full bg-gradient-to-tr from-amber-500/30 to-pink-500/30 border border-yellow-400/60 mb-4 shadow-lg shadow-amber-500/20">
          <span className="text-4xl animate-bounce inline-block">{current.emoji}</span>
        </div>

        <span className="festive-pill mb-2 text-xs">
          A Special Diwali Surprise for You
        </span>

        <h3 className="font-heading text-xl sm:text-2xl font-bold text-yellow-300 mt-2 mb-4 tracking-wider">
          {current.title}
        </h3>

        <div className="bg-purple-950/60 rounded-2xl p-5 border border-amber-400/30 mb-6 relative">
          <p className="font-serif italic text-base sm:text-lg text-purple-100 leading-relaxed">
            "{current.wish}"
          </p>
          <div className="mt-3 text-xs text-amber-400/90 font-heading tracking-widest uppercase">
            — Blessing of {current.blessing} —
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleNextWish}
            className="btn-festive-primary px-5 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2"
          >
            <span>Another Wish</span>
            <span>🎁</span>
          </button>

          <button
            onClick={handleShareWishWhatsApp}
            className="btn-festive-secondary px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 bg-emerald-950/60 border-emerald-400/50 hover:bg-emerald-900/80 text-emerald-200"
          >
            <span>WhatsApp Wish</span>
            <span>💬</span>
          </button>

          <button
            onClick={handleCopy}
            className="btn-festive-secondary px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2"
          >
            <span>{copied ? "Copied! ✓" : "Copy Wish"}</span>
            <span>📋</span>
          </button>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 7. PERSONALIZATION & SHARING MODALS
// ==========================================
function PersonalizeModal({ isOpen, onClose, sender, recipient, message, onSave }) {
  const [senderName, setSenderName] = useState(sender);
  const [recipientName, setRecipientName] = useState(recipient);
  const [customMsg, setCustomMsg] = useState(message);

  useEffect(() => {
    if (isOpen) {
      setSenderName(sender);
      setRecipientName(recipient);
      setCustomMsg(message);
    }
  }, [isOpen, sender, recipient, message]);

  const presetMessages = [
    "May your life shine brighter than a thousand diyas, your heart be filled with happiness, and your home overflow with love, laughter and prosperity.",
    "Wishing you and your family a festival full of sweet moments, endless smiles, dazzling fireworks, and blissful peace.",
    "May Goddess Lakshmi bless your steps with boundless fortune and Lord Ganesha gift you triumph in all you do.",
    "Sending you warm hugs, boxfuls of sweets, glowing diyas, and wishes for a glorious Happy Diwali!"
  ];

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      sender: senderName.trim() || "Your Well-Wisher",
      recipient: recipientName.trim() || "Dearest Friend",
      message: customMsg.trim() || presetMessages[0]
    });
    audio.playBell();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box text-left" onClick={e => e.stopPropagation()}>
        <div className="gold-filigree-border" />
        <div className="gold-corner gold-corner-tl" />
        <div className="gold-corner gold-corner-tr" />
        <div className="gold-corner gold-corner-bl" />
        <div className="gold-corner gold-corner-br" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-300 hover:text-yellow-300 text-lg w-8 h-8 rounded-full flex items-center justify-center bg-purple-900/40 border border-purple-500/30 transition-all z-20"
        >
          ✕
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-2xl">✨</span>
          <h3 className="font-heading text-xl font-bold text-yellow-300">
            Personalize Your Greeting Card
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-purple-200/80 mb-5">
          Customise this card with your names and message before sharing it with friends & family!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-heading font-semibold text-amber-300 mb-1.5 uppercase tracking-wider">
              From (Your Name):
            </label>
            <input
              type="text"
              value={senderName}
              onChange={e => setSenderName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
              maxLength={40}
              className="w-full bg-purple-950/70 border border-amber-400/40 rounded-xl px-4 py-2.5 text-white placeholder-purple-400/50 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold text-amber-300 mb-1.5 uppercase tracking-wider">
              To (Recipient's Name or Family):
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={e => setRecipientName(e.target.value)}
              placeholder="e.g. Priya & Family"
              maxLength={40}
              className="w-full bg-purple-950/70 border border-amber-400/40 rounded-xl px-4 py-2.5 text-white placeholder-purple-400/50 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold text-amber-300 mb-1.5 uppercase tracking-wider">
              Choose or Write Diwali Message:
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
              {presetMessages.map((msg, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setCustomMsg(msg)}
                  className="text-[11px] whitespace-nowrap bg-purple-900/60 hover:bg-purple-800 text-yellow-200 px-2.5 py-1 rounded-lg border border-purple-600/50 flex-shrink-0"
                >
                  Template {i + 1}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={customMsg}
              onChange={e => setCustomMsg(e.target.value)}
              maxLength={260}
              className="w-full bg-purple-950/70 border border-amber-400/40 rounded-xl px-4 py-2.5 text-white placeholder-purple-400/50 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-sm"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-festive-secondary px-4 py-2 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-festive-primary px-6 py-2.5 text-xs font-semibold"
            >
              Update Greeting Card 🪔
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ShareModal({ isOpen, onClose, sender, recipient, message, onShowToast }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'card');
      if (sender) url.searchParams.set('from', sender);
      if (recipient) url.searchParams.set('to', recipient);
      if (message) url.searchParams.set('msg', message);
      return url.toString();
    } catch (e) {
      const base = window.location.origin + window.location.pathname;
      return `${base}?view=card&from=${encodeURIComponent(sender || '')}&to=${encodeURIComponent(recipient || '')}&msg=${encodeURIComponent(message || '')}`;
    }
  }, [sender, recipient, message]);

  if (!isOpen) return null;

  const shareText = `🪔 *Happy Diwali!* ✨\n\nDear ${recipient},\n${sender} has sent you a special interactive Diwali Greeting Card with 3D surprises and fireworks!\n\nOpen your surprise here:\n${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    audio.playBell();
    if (onShowToast) onShowToast("Link copied to clipboard! 📋");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Happy Diwali Greeting from ${sender}!`,
          text: `A special interactive Diwali Surprise for ${recipient} 🪔`,
          url: shareUrl
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box text-center" onClick={e => e.stopPropagation()}>
        <div className="gold-filigree-border" />
        <div className="gold-corner gold-corner-tl" />
        <div className="gold-corner gold-corner-tr" />
        <div className="gold-corner gold-corner-bl" />
        <div className="gold-corner gold-corner-br" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-300 hover:text-yellow-300 text-lg w-8 h-8 rounded-full flex items-center justify-center bg-purple-900/40 border border-purple-500/30 transition-all z-20"
        >
          ✕
        </button>

        <span className="text-4xl mb-3 inline-block">💌</span>
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-yellow-300 mb-1">
          Share the Happiness ❤️
        </h3>
        <p className="text-xs sm:text-sm text-purple-200/80 mb-5">
          Send this personalized magical Diwali card to your loved ones anywhere in the world!
        </p>

        {/* Preview Capsule */}
        <div className="bg-purple-950/70 rounded-2xl p-4 border border-amber-400/30 text-left mb-6">
          <div className="flex items-center justify-between text-xs text-amber-300 font-semibold mb-1">
            <span>TO: {recipient}</span>
            <span>FROM: {sender}</span>
          </div>
          <p className="text-xs text-purple-200 italic line-clamp-2">
            "{message}"
          </p>
        </div>

        {/* Share buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleWhatsApp}
            className="w-full py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-semibold text-sm flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/30 transition-all transform hover:-translate-y-0.5"
          >
            <span className="text-xl">💬</span>
            <span>Share via WhatsApp</span>
          </button>

          {navigator.share && (
            <button
              onClick={handleNativeShare}
              className="w-full btn-festive-primary py-3 px-5 text-sm flex items-center justify-center gap-2"
            >
              <span>Share to Any App 📱</span>
            </button>
          )}

          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-purple-950/90 border border-amber-400/40 rounded-xl px-3 py-2.5 text-xs text-purple-200 truncate focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="btn-festive-secondary px-4 py-2.5 text-xs font-semibold whitespace-nowrap"
            >
              {copied ? "Copied! ✓" : "Copy Link"}
            </button>
          </div>

          <div className="pt-3 mt-1 border-t border-purple-500/30 text-center">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenPersonalize) onOpenPersonalize();
              }}
              className="text-xs text-yellow-300 hover:text-yellow-200 underline font-medium flex items-center justify-center gap-1.5 mx-auto"
            >
              <span>✏️ Want to send this to someone else? Change Names</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 8. 3D INTERACTIVE GREETING CARD COMPONENT
// ==========================================
function GreetingCard3D({
  isCardOpened,
  onOpenCard,
  onCloseCard,
  sender,
  recipient,
  message,
  onOpenSurprise,
  onOpenShare,
  onOpenPersonalize,
  onTriggerFireworks,
  onToggleSparkler
}) {
  return (
    <div className="card-scene">
      <div className={`card-3d-wrapper relative transition-all duration-700`}>
        {/* ================= CARD COVER (Closed State) ================= */}
        <div
          className={`card-cover ${isCardOpened ? 'opened' : ''} cursor-pointer group`}
          onClick={onOpenCard}
        >
          {/* Filigree Borders */}
          <div className="gold-filigree-border" />
          <div className="gold-corner gold-corner-tl" />
          <div className="gold-corner gold-corner-tr" />
          <div className="gold-corner gold-corner-bl" />
          <div className="gold-corner gold-corner-br" />

          {/* Background Rotating Rangoli Motif */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <svg
              className="w-80 h-80 rotating-rangoli text-yellow-300"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="45" stroke="currentColor" strokeWidth="2" />
              {[...Array(12)].map((_, i) => (
                <path
                  key={i}
                  d="M100 20 Q115 55 100 90 Q85 55 100 20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="rgba(251, 191, 36, 0.08)"
                  transform={`rotate(${i * 30} 100 100)`}
                />
              ))}
            </svg>
          </div>

          {/* Top Label */}
          <div className="relative z-10 text-center">
            <span className="festive-pill text-xs tracking-widest uppercase">
              Shubh Deepavali • शुभ दीपावली
            </span>
            {recipient && recipient !== "Dearest Friend" && (
              <p className="font-heading text-sm text-yellow-200/90 mt-2">
                Specially for: <span className="text-yellow-400 font-bold">{recipient}</span>
              </p>
            )}
          </div>

          {/* Center Diya & Title */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto py-6">
            <ClayDiya isLit={true} size="large" />

            <h2 className="font-display text-3xl sm:text-4xl text-center gold-shimmer-text font-bold mt-4 tracking-wider">
              HAPPY DIWALI
            </h2>
            <p className="font-script text-2xl sm:text-3xl text-yellow-200/90 text-center mt-1">
              Festival of Lights & Prosperity
            </p>

            {sender && (
              <p className="text-xs sm:text-sm text-purple-200/80 mt-3 font-medium">
                A special Diwali wish from <span className="text-amber-300 font-semibold">{sender}</span> ✨
              </p>
            )}
          </div>

          {/* Bottom Tap to Open Hint */}
          <div className="relative z-10 text-center flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-semibold text-yellow-300 bg-amber-500/20 px-5 py-2.5 rounded-full border border-amber-400/40 group-hover:scale-105 transition-all shadow-md">
              <span>Touch to Open Your Greeting Card</span>
              <span className="text-lg">🪔</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenPersonalize();
              }}
              className="text-xs text-yellow-300/80 hover:text-yellow-200 underline font-medium pointer-events-auto"
            >
              ✏️ Want to change names first? Click here
            </button>
          </div>
        </div>

        {/* ================= CARD INSIDE (Open State) ================= */}
        <div className={`card-inside ${!isCardOpened ? 'opacity-80' : 'opacity-100'}`}>
          {/* Filigree Borders */}
          <div className="gold-filigree-border" />
          <div className="gold-corner gold-corner-tl" />
          <div className="gold-corner gold-corner-tr" />
          <div className="gold-corner gold-corner-bl" />
          <div className="gold-corner gold-corner-br" />

          {/* Background subtle mandala */}
          <div className="absolute -top-20 -right-20 w-64 h-64 opacity-15 pointer-events-none rotating-rangoli">
            <svg viewBox="0 0 100 100" fill="currentColor" className="text-yellow-300 w-full h-full">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" fill="none" />
              {[...Array(8)].map((_, i) => (
                <ellipse key={i} cx="50" cy="50" rx="40" ry="15" stroke="currentColor" strokeWidth="1" fill="none" transform={`rotate(${i * 45} 50 50)`} />
              ))}
            </svg>
          </div>

          {/* Top Fold Bar / Personalization Indicator */}
          <div className="relative z-10 flex items-center justify-between text-xs text-purple-300 border-b border-yellow-400/20 pb-3 gap-2">
            <button
              onClick={onCloseCard}
              className="text-purple-300/80 hover:text-yellow-300 transition-colors flex items-center gap-1 font-medium whitespace-nowrap"
            >
              <span>← Fold</span>
            </button>
            <button
              onClick={onOpenPersonalize}
              className="font-heading font-semibold text-yellow-300 hover:text-yellow-200 tracking-wider flex items-center gap-1.5 bg-yellow-500/15 hover:bg-yellow-500/25 px-3 py-1 rounded-full border border-yellow-400/30 transition-all cursor-pointer truncate"
              title="Click to edit recipient name"
            >
              <span className="truncate">{recipient ? `To: ${recipient}` : "To: Dearest Friend"}</span>
              <span className="text-xs">✏️</span>
            </button>
            <button
              onClick={onOpenPersonalize}
              className="btn-festive-secondary px-3 py-1 text-xs font-semibold text-yellow-300 hover:text-yellow-200 flex items-center gap-1 whitespace-nowrap"
            >
              <span>Edit Names ✏️</span>
            </button>
          </div>

          {/* Main Content inside the Card */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center py-4 sm:py-6 px-2 sm:px-6">
            {/* Header Text Effect */}
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-yellow-400 animate-pulse text-lg">✨</span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold gold-shimmer-text tracking-wider">
                HAPPY DIWALI!
              </h1>
              <span className="text-yellow-400 animate-pulse text-lg">✨</span>
            </div>

            {/* Glowing Clay Diya Icon */}
            <div className="my-2">
              <ClayDiya isLit={true} size="small" />
            </div>

            {/* Main Greeting Wishes */}
            <div className="max-w-xl mx-auto space-y-3.5 my-2">
              <p className="font-serif text-base sm:text-lg md:text-xl text-yellow-100 font-medium leading-relaxed">
                {message}
              </p>

              <p className="font-heading text-sm sm:text-base text-yellow-300 font-semibold tracking-wide">
                Wishing you and your family a beautiful, joyful and blessed Diwali!
              </p>

              <p className="font-script text-2xl sm:text-3xl text-rose-300 pt-1">
                🪔 With lots of love ❤️
              </p>
            </div>

            {/* Sender Sign-off */}
            {sender && (
              <button
                type="button"
                onClick={onOpenPersonalize}
                className="mt-3 pt-3 border-t border-purple-500/20 inline-flex flex-col items-center hover:scale-105 transition-transform cursor-pointer group"
                title="Click to change your sender name"
              >
                <p className="font-heading text-xs uppercase tracking-widest text-purple-300 flex items-center justify-center gap-1">
                  <span>A special Diwali wish from</span>
                  <span className="opacity-70 group-hover:opacity-100">✏️</span>
                </p>
                <p className="font-script text-2xl text-yellow-300 font-bold mt-0.5 group-hover:text-yellow-200">
                  {sender}
                </p>
              </button>
            )}
          </div>

          {/* Bottom Card Interactive Toolbar */}
          <div className="relative z-10 pt-4 border-t border-yellow-400/20 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              onClick={onOpenPersonalize}
              className="btn-festive-secondary px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm flex items-center gap-1.5 bg-amber-500/20 border-amber-400/40 text-yellow-200 hover:text-white"
            >
              <span>Change Names</span>
              <span>✏️</span>
            </button>

            <button
              onClick={onOpenSurprise}
              className="btn-festive-primary px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-1.5"
            >
              <span>One More Surprise</span>
              <span>🎁</span>
            </button>

            <button
              onClick={onTriggerFireworks}
              className="btn-festive-secondary px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm flex items-center gap-1.5"
            >
              <span>Burst Fireworks</span>
              <span>🎆</span>
            </button>

            <button
              onClick={onToggleSparkler}
              className="btn-festive-secondary px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm flex items-center gap-1.5 bg-yellow-500/20 border-yellow-400/40 text-yellow-300"
            >
              <span>Sparkler Mode</span>
              <span>🎇</span>
            </button>

            <button
              onClick={onOpenShare}
              className="btn-festive-secondary px-4 py-2 sm:py-2.5 text-xs sm:text-sm flex items-center gap-1.5 bg-rose-900/40 border-rose-400/40 text-rose-200 hover:text-white"
            >
              <span>Share Card</span>
              <span>❤️</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 9. OPENING SCREEN COMPONENT
// ==========================================
function OpeningScreen({ onOpenSurprise, onOpenPersonalize, sender, recipient }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between py-6 sm:py-10 px-4 z-10 text-center">
      {/* Top Auspicious Banner */}
      <div className="flex flex-col items-center gap-1.5 animate-fadeIn">
        <span className="festive-pill text-xs font-semibold tracking-widest uppercase">
          ✦ Shubh Deepavali ✦ शुभ दीपावली ✦
        </span>

        {sender && (
          <div className="mt-1 glass-panel px-4 py-1.5 rounded-full border border-yellow-400/40 text-xs sm:text-sm text-yellow-200 flex items-center gap-2">
            <span>✨ <span className="font-bold text-yellow-300">{sender}</span> has sent you a festive blessing!</span>
            <button
              type="button"
              onClick={onOpenPersonalize}
              className="text-amber-300 hover:text-yellow-100 underline text-xs font-semibold ml-1 cursor-pointer"
            >
              Change Names ✏️
            </button>
          </div>
        )}
      </div>

      {/* Hero Center Section */}
      <div className="flex flex-col items-center justify-center my-auto max-w-2xl px-2 py-2">
        {/* Ornate Glowing Clay Diya Altar */}
        <div className="relative my-3 sm:my-5">
          {/* Rotating Rangoli Base Plate */}
          <div className="absolute -inset-10 flex items-center justify-center pointer-events-none opacity-30">
            <svg
              className="w-48 h-48 sm:w-56 sm:h-56 rotating-rangoli text-yellow-400"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <polygon points="50,6 63,35 94,35 70,55 79,84 50,66 21,84 30,55 6,35 37,35" stroke="currentColor" strokeWidth="1" fill="none" />
              {[...Array(8)].map((_, i) => (
                <circle key={i} cx="50" cy="12" r="3" fill="currentColor" transform={`rotate(${i * 45} 50 50)`} />
              ))}
            </svg>
          </div>

          <ClayDiya isLit={true} size="large" />
        </div>

        {/* Display Title from Requirements */}
        <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-yellow-200 mt-1 mb-2 tracking-wide">
          A Little Spark of Happiness for You ✨
        </h1>

        <p className="font-serif italic text-sm sm:text-lg md:text-xl text-purple-200/90 max-w-lg mb-5 sm:mb-7 leading-relaxed">
          The festival of lights has arrived to brighten your soul with joy, prosperity and boundless love.
        </p>

        {/* Big Glow CTA Button from Requirements */}
        <button
          onClick={onOpenSurprise}
          className="btn-festive-primary pulse-gold px-7 sm:px-11 py-3.5 sm:py-4.5 text-base sm:text-xl font-bold flex items-center gap-3 text-purple-950 tracking-wider transition-all"
        >
          <span>Open Your Diwali Surprise</span>
          <span className="text-2xl animate-bounce">🪔</span>
        </button>
      </div>

      {/* Bottom Hint */}
      <div className="text-xs text-purple-300/70 font-medium">
        Touch anywhere in the sky to launch fireworks • Designed with joy for Diwali ✨
      </div>
    </div>
  );
}


// ==========================================
// 10. MAIN APP CONTROLLER
// ==========================================
function DiwaliApp() {
  // Parse URL search params for personal sharing
  const initialParams = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      sender: params.get('from') || 'Your Well-Wisher',
      recipient: params.get('to') || 'Dearest Friend',
      message: params.get('msg') || 'May your life shine brighter than a thousand diyas, your heart be filled with happiness, and your home overflow with love, laughter and prosperity.',
      view: params.get('view') || 'opening'
    };
  }, []);

  const [view, setView] = useState(initialParams.view === 'card' ? 'card' : 'opening');
  const [isCardOpened, setIsCardOpened] = useState(initialParams.view === 'card');
  const [sender, setSender] = useState(initialParams.sender);
  const [recipient, setRecipient] = useState(initialParams.recipient);
  const [message, setMessage] = useState(initialParams.message);

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isSparklerActive, setIsSparklerActive] = useState(false);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);
  const [showPersonalizeModal, setShowPersonalizeModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fireworksTriggerRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Handle Opening Surprise from Opening Screen
  const handleOpenFromStart = () => {
    audio.playBell();
    setView('card');
    setIsCardOpened(true);

    // Grand opening fireworks burst
    if (fireworksTriggerRef.current) {
      fireworksTriggerRef.current(6);
    }

    // Trigger sweet festive confetti
    if (window.confetti) {
      window.confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#f43f5e', '#ffffff', '#ffd700']
      });
    }

    showToast("✨ Happy Diwali! Wishing you and your family bliss & light! 🪔");
  };

  const handleCardOpenToggle = () => {
    if (!isCardOpened) {
      audio.playBell();
      setIsCardOpened(true);
      if (fireworksTriggerRef.current) {
        fireworksTriggerRef.current(4);
      }
    } else {
      setIsCardOpened(false);
    }
  };

  const handleToggleMusic = () => {
    audio.toggleMusic((playing) => {
      setIsMusicPlaying(playing);
      showToast(playing ? "Festive Music: Playing 🎶" : "Festive Music: Muted 🔇");
    });
  };

  const handleBurstFireworks = () => {
    if (fireworksTriggerRef.current) {
      fireworksTriggerRef.current(5);
    }
    showToast("🎆 Sparkling fireworks brightening your sky!");
  };

  const handleAllDiyasLit = useCallback(() => {
    if (fireworksTriggerRef.current) {
      fireworksTriggerRef.current(7);
    }
    if (window.confetti) {
      window.confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#ffd700', '#f59e0b', '#ec4899', '#38bdf8']
      });
    }
    showToast("🌟 All 7 Sacred Diyas are lit! May your year overflow with prosperity! 🪔");
  }, [showToast]);

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="festive-bg" />

      {/* Canvas Fireworks Engine */}
      <FireworksCanvas triggerBurstRef={fireworksTriggerRef} />

      {/* Interactive Sparkler Tool */}
      <SparklerCanvas
        active={isSparklerActive}
        onDeactivate={() => setIsSparklerActive(false)}
      />

      {/* Top Floating Music Toggle */}
      <button
        onClick={handleToggleMusic}
        className={`audio-toggle-btn ${isMusicPlaying ? 'playing' : ''}`}
        title={isMusicPlaying ? "Mute Festive Music" : "Play Festive Indian Music"}
        aria-label="Toggle Music"
      >
        <span>{isMusicPlaying ? "🎶" : "🔇"}</span>
      </button>

      {/* Main Screen Router */}
      {view === 'opening' ? (
        <OpeningScreen
          onOpenSurprise={handleOpenFromStart}
          onOpenPersonalize={() => setShowPersonalizeModal(true)}
          sender={sender}
          recipient={recipient}
        />
      ) : (
        <main className="relative z-10 min-h-screen flex flex-col justify-between py-8 px-4">
          {/* Header Bar */}
          <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-4">
            <button
              onClick={() => setView('opening')}
              className="text-xs sm:text-sm font-heading font-medium text-purple-300 hover:text-yellow-300 flex items-center gap-1.5 transition-colors"
            >
              <span>← Festive Welcome</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPersonalizeModal(true)}
                className="festive-pill hover:border-yellow-400 text-xs font-semibold transition-all"
              >
                <span>Personalize Card</span>
                <span>✏️</span>
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="btn-festive-secondary px-3 py-1 text-xs font-semibold flex items-center gap-1"
              >
                <span>Share</span>
                <span>❤️</span>
              </button>
            </div>
          </header>

          {/* 3D Greeting Card */}
          <section className="flex-1 flex items-center justify-center py-4">
            <GreetingCard3D
              isCardOpened={isCardOpened}
              onOpenCard={handleCardOpenToggle}
              onCloseCard={() => setIsCardOpened(false)}
              sender={sender}
              recipient={recipient}
              message={message}
              onOpenSurprise={() => setShowSurpriseModal(true)}
              onOpenShare={() => setShowShareModal(true)}
              onOpenPersonalize={() => setShowPersonalizeModal(true)}
              onTriggerFireworks={handleBurstFireworks}
              onToggleSparkler={() => {
                setIsSparklerActive(true);
                showToast("🎇 Sparkler active! Wave your pointer!");
              }}
            />
          </section>

          {/* Sacred 7 Diyas Altar */}
          <section>
            <DiyasAltar onAllLit={handleAllDiyasLit} />
          </section>

          {/* Footer note */}
          <footer className="text-center text-xs text-purple-300/60 py-4">
            Wishing you and your loved ones a blessed Deepavali • Crafted with love & light 🪔
          </footer>
        </main>
      )}

      {/* Modals */}
      <SurpriseModal
        isOpen={showSurpriseModal}
        onClose={() => setShowSurpriseModal(false)}
      />

      <PersonalizeModal
        isOpen={showPersonalizeModal}
        onClose={() => setShowPersonalizeModal(false)}
        sender={sender}
        recipient={recipient}
        message={message}
        onSave={(data) => {
          setSender(data.sender);
          setRecipient(data.recipient);
          setMessage(data.message);
          try {
            const url = new URL(window.location.href);
            url.searchParams.set('view', 'card');
            if (data.sender) url.searchParams.set('from', data.sender);
            if (data.recipient) url.searchParams.set('to', data.recipient);
            if (data.message) url.searchParams.set('msg', data.message);
            window.history.replaceState({}, '', url.toString());
          } catch (e) {
            const params = new URLSearchParams(window.location.search);
            params.set('view', 'card');
            if (data.sender) params.set('from', data.sender);
            if (data.recipient) params.set('to', data.recipient);
            if (data.message) params.set('msg', data.message);
            window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
          }
          showToast(`Card updated for ${data.recipient}! ✨`);
          setTimeout(() => {
            setShowShareModal(true);
          }, 350);
        }}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        sender={sender}
        recipient={recipient}
        message={message}
        onShowToast={showToast}
        onOpenPersonalize={() => setShowPersonalizeModal(true)}
      />

      {/* Toast Notification */}
      <div className={`festive-toast ${toastMessage ? 'show' : ''}`}>
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}

// Render React App
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<DiwaliApp />);
}
