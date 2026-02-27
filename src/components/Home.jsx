import { useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Aurora from './Aurora';
import postsData from '../generated/posts-data.js';
import './Home.css';

/* ── Helpers ── */
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const band = (p, start, end) => clamp((p - start) / (end - start), 0, 1);

const BAR_COUNT = 60;
const RING_COUNT = 6;
const CONVERGE_COUNT = 40;

const quotes = [
  { text: "Organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations.", author: "Melvin Conway, \u201CHow Do Committees Invent?\u201D (1968)" },
  { text: "A Big Ball of Mud is a haphazardly structured, sprawling, sloppy, duct-tape-and-baling-wire, spaghetti-code jungle.", author: "Brian Foote & Joseph Yoder, \u201CBig Ball of Mud\u201D (1997)" },
  { text: "Software architecture is the set of design decisions which, if made incorrectly, may cause your project to be cancelled.", author: "Eoin Woods" },
  { text: "The best architectures, requirements, and designs emerge from self-organizing teams.", author: "Agile Manifesto (2001)" },
  { text: "An evolutionary architecture supports guided, incremental change across multiple dimensions.", author: "Neal Ford, Rebecca Parsons, Patrick Kua, \u201CBuilding Evolutionary Architectures\u201D (2017)" },
  { text: "To me, legacy code is simply code without tests.", author: "Michael Feathers, \u201CWorking Effectively with Legacy Code\u201D (2004)" },
  { text: "Shipping first time code is like going into debt. A little debt speeds development so long as it is paid back promptly with a rewrite.", author: "Ward Cunningham, OOPSLA Experience Report (1992)" },
  { text: "There are two ways to change a software system: add code or change existing code. Organizations that can\u2019t change their code effectively are in deep trouble.", author: "Michael Feathers, \u201CWorking Effectively with Legacy Code\u201D (2004)" },
  { text: "When a system goes into production, in a way, it becomes its own specification.", author: "Michael Feathers" },
  { text: "The Strangler Fig slowly grows over the original tree, eventually replacing it entirely.", author: "Martin Fowler, \u201CStrangler Fig Application\u201D (2004)" },
  { text: "The single worst strategic mistake that any software company can make is to decide to rewrite the code from scratch.", author: "Joel Spolsky (2000)" },
  { text: "The cost of change is not flat. And the agile practices, while they can significantly flatten the curve, cannot completely eliminate it.", author: "Scott Ambler" },
  { text: "An E-type system must be continually adapted or it becomes progressively less satisfactory.", author: "Meir Lehman, First Law of Software Evolution (1974)" },
  { text: "As an E-type system evolves, its complexity increases unless work is done to maintain or reduce it.", author: "Meir Lehman, Second Law of Software Evolution (1974)" },
  { text: "Adding manpower to a late software project makes it later.", author: "Frederick Brooks, \u201CThe Mythical Man-Month\u201D (1975)" },
  { text: "The bearing of a child takes nine months, no matter how many women are assigned.", author: "Frederick Brooks, \u201CThe Mythical Man-Month\u201D (1975)" },
  { text: "The general tendency in most projects when faced with the Second-System Effect is to over-engineer the second system, using all the ideas and frills that were cautiously sidelined in the first.", author: "Frederick Brooks, \u201CThe Mythical Man-Month\u201D (1975)" },
  { text: "Psychological safety is not about being nice. It\u2019s about giving candid feedback, openly admitting mistakes, and learning from each other.", author: "Amy Edmondson, \u201CThe Fearless Organization\u201D (2018)" },
  { text: "No one wakes up in the morning and thinks: Today I\u2019ll fail. Human error is a symptom of trouble deeper inside a system.", author: "Sidney Dekker, \u201CJust Culture\u201D (2016)" },
  { text: "Who is on a team matters less than how the team members interact, structure their work, and view their contributions.", author: "Google Project Aristotle (2015)" },
  { text: "The critical complexity of most software projects is in understanding the domain itself.", author: "Eric Evans, \u201CDomain-Driven Design\u201D (2003)" },
  { text: "When you have different vocabularies in different parts of the business, that\u2019s a sign of different bounded contexts.", author: "Eric Evans (DDD Europe, 2019)" },
  { text: "For most systems, CQRS adds risky complexity.", author: "Martin Fowler, \u201CCQRS\u201D (2011)" },
  { text: "Lean management, along with a set of other technical practices, do in fact impact software delivery performance in a statistically significant way.", author: "Nicole Forsgren, Jez Humble, Gene Kim, \u201CAccelerate\u201D (2018)" },
  { text: "Improving software delivery performance means building quality in, not inspecting quality after the fact.", author: "Nicole Forsgren, Jez Humble, Gene Kim, \u201CAccelerate\u201D (2018)" },
  { text: "There\u2019s no such thing as a five-minute job.", author: "Gene Kim, Kevin Behr, George Spafford, \u201CThe Phoenix Project\u201D (2013)" },
  { text: "Every feature factory has a long list of delivered features and almost no measurement of whether those features produced any value.", author: "John Cutler, \u201C12 Signs You\u2019re Working in a Feature Factory\u201D (2016)" },
  { text: "Dark Scrum takes Scrum\u2019s ideas and turns them into weapons against the very people Scrum was supposed to help.", author: "Ron Jeffries, \u201CDark Scrum\u201D (2016)" },
  { text: "Cognitive load is the total amount of mental effort being used in working memory.", author: "John Sweller, \u201CCognitive Load During Problem Solving\u201D (1988)" },
  { text: "Minimize the cognitive load that a team has to deal with. Limit the size of the software and its complexity.", author: "Matthew Skelton & Manuel Pais, \u201CTeam Topologies\u201D (2019)" },
];

/* ── Shapes data (static) ── */
const shapesData = [
  { type: 'dot', style: { top: '12%', left: '8%', '--fx': '-8px', '--fy': '14px' } },
  { type: 'dot', style: { top: '25%', left: '85%', '--fx': '12px', '--fy': '-8px' } },
  { type: 'dot', style: { top: '70%', left: '15%', '--fx': '-6px', '--fy': '10px' } },
  { type: 'dot', style: { top: '60%', left: '90%', '--fx': '10px', '--fy': '6px' } },
  { type: 'dot', style: { top: '40%', left: '50%', '--fx': '-4px', '--fy': '-14px' } },
  { type: 'dot', style: { top: '85%', left: '70%', '--fx': '8px', '--fy': '-10px' } },
  { type: 'ring', style: { top: '18%', left: '75%', '--fx': '15px', '--fy': '-10px' } },
  { type: 'ring', style: { top: '72%', left: '25%', '--fx': '-10px', '--fy': '15px' } },
  { type: 'ring-lg', style: { top: '35%', left: '10%', '--fx': '8px', '--fy': '-18px' } },
  { type: 'ring-lg', style: { top: '55%', left: '82%', '--fx': '-12px', '--fy': '8px' } },
  { type: 'aurora-band', style: { top: '30%', left: '65%', '--fx': '20px', '--fy': '5px', background: 'linear-gradient(90deg, transparent, rgba(0,255,130,0.25), transparent)' } },
  { type: 'aurora-band-lg', style: { top: '65%', left: '35%', '--fx': '-15px', '--fy': '12px', background: 'linear-gradient(90deg, transparent, rgba(100,60,255,0.20), transparent)' } },
  { type: 'aurora-band', style: { top: '80%', left: '55%', '--fx': '-15px', '--fy': '-8px', background: 'linear-gradient(90deg, transparent, rgba(0,230,255,0.22), transparent)' } },
  { type: 'aurora-wave', style: { top: '22%', left: '70%', '--fx': '14px', '--fy': '-6px', borderTopColor: 'rgba(0,255,130,0.10)' } },
  { type: 'aurora-wave', style: { top: '55%', left: '20%', '--fx': '-10px', '--fy': '8px', borderTopColor: 'rgba(140,60,255,0.10)' } },
  { type: 'bracket', style: { top: '20%', left: '22%', '--fx': '-12px', '--fy': '8px' }, content: '{' },
  { type: 'bracket', style: { top: '20%', left: '78%', '--fx': '12px', '--fy': '8px' }, content: '}' },
  { type: 'aurora-band', style: { top: '45%', left: '15%', '--fx': '8px', '--fy': '-14px', background: 'linear-gradient(90deg, transparent, rgba(255,80,180,0.18), transparent)' } },
  { type: 'aurora-band-lg', style: { top: '50%', left: '75%', '--fx': '-12px', '--fy': '10px', background: 'linear-gradient(90deg, transparent, rgba(50,255,170,0.20), transparent)' } },
  { type: 'square', style: { top: '78%', left: '60%', '--fx': '10px', '--fy': '-6px' } },
  { type: 'aurora-band', style: { top: '15%', left: '45%', '--fx': '-6px', '--fy': '10px', background: 'linear-gradient(90deg, transparent, rgba(0,200,255,0.20), transparent)' } },
];

/* Pre-computed shape positions (mirrors vanilla version's cached shapeData) */
const precomputedShapePositions = shapesData.map((s) => ({
  origTop: parseFloat(s.style.top),
  origLeft: parseFloat(s.style.left),
}));

export default function Home() {
  const tickingRef = useRef(false);
  const socialRevealedRef = useRef(false);
  const isLoopingRef = useRef(false);
  const autoPlayingRef = useRef(false);
  const autoPlayRafRef = useRef(null);
  const carouselActiveRef = useRef(false);
  const quoteCycleTimerRef = useRef(null);
  const shownQuoteIndicesRef = useRef(new Set());
  const cycleQueueRef = useRef([]);
  const blogExcerptIndexRef = useRef(0);
  const mixedShowExcerptRef = useRef(true);

  /* Refs for DOM elements */
  const playBtnRef = useRef(null);
  const loopFlashRef = useRef(null);
  const quoteTextRef = useRef(null);
  const quoteAuthorRef = useRef(null);
  const quotesCarouselRef = useRef(null);
  const socialGithubRef = useRef(null);
  const socialLinkedinRef = useRef(null);
  const gridRef = useRef(null);
  const waveRef = useRef(null);
  const orbitsRef = useRef(null);
  const convergeRef = useRef(null);
  const shapesRef = useRef(null);

  /* Cached DOM element arrays (set once in layout effect, like vanilla version) */
  const shapeElsRef = useRef([]);
  const gridCellsRef = useRef([]);
  const waveBarsRef = useRef([]);
  const orbitRingsRef = useRef([]);
  const convergeDotsRef = useRef([]);

  /* Pre-computed converge data */
  const convergeData = useMemo(() => {
    const angles = [];
    const radii = [];
    for (let i = 0; i < CONVERGE_COUNT; i++) {
      angles.push((i / CONVERGE_COUNT) * Math.PI * 2 + Math.random() * 0.4);
      radii.push(0.3 + Math.random() * 0.5);
    }
    return { angles, radii };
  }, []);

  /* Blog excerpts from pre-built data */
  const blogExcerpts = useMemo(() => {
    return postsData.posts.map((p) => ({
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      slug: p.slug,
    }));
  }, []);

  const useBlogExcerpts = blogExcerpts.length > 0;
  const mixedMode = useBlogExcerpts && blogExcerpts.length < 5;

  /* ── Carousel functions ── */
  const shuffleArray = useCallback((arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, []);

  const buildCycleQueue = useCallback(() => {
    const available = [];
    for (let i = 0; i < quotes.length; i++) {
      if (!shownQuoteIndicesRef.current.has(i)) available.push(i);
    }
    if (available.length === 0) {
      shownQuoteIndicesRef.current.clear();
      for (let i = 0; i < quotes.length; i++) available.push(i);
    }
    return shuffleArray(available);
  }, [shuffleArray]);

  const showBlogExcerpt = useCallback((idx) => {
    const el = quoteTextRef.current;
    const authorEl = quoteAuthorRef.current;
    if (!el || !authorEl) return;

    el.classList.remove('visible');
    setTimeout(() => {
      const post = blogExcerpts[idx];
      el.innerHTML = `<a class="blog-excerpt-link" href="/blog/${post.slug}">
        <div class="blog-excerpt-title">${post.title}</div>
        <div class="blog-excerpt-text">${post.excerpt}</div>
        <div class="blog-excerpt-meta">${post.date} &middot; Czytaj dalej &rarr;</div>
      </a>`;
      authorEl.textContent = '';
      el.classList.add('visible');
    }, 800);
  }, [blogExcerpts]);

  const showQuote = useCallback((index) => {
    shownQuoteIndicesRef.current.add(index);
    const el = quoteTextRef.current;
    const authorEl = quoteAuthorRef.current;
    if (!el || !authorEl) return;

    el.classList.remove('visible');
    setTimeout(() => {
      el.innerHTML = '';
      el.textContent = '\u201C' + quotes[index].text + '\u201D';
      authorEl.textContent = '\u2014 ' + quotes[index].author;
      el.classList.add('visible');
    }, 800);
  }, []);

  const cycleCarousel = useCallback(() => {
    if (mixedMode) {
      if (mixedShowExcerptRef.current) {
        showBlogExcerpt(blogExcerptIndexRef.current);
        blogExcerptIndexRef.current = (blogExcerptIndexRef.current + 1) % blogExcerpts.length;
      } else {
        if (cycleQueueRef.current.length === 0) {
          cycleQueueRef.current = buildCycleQueue();
        }
        showQuote(cycleQueueRef.current.shift());
      }
      mixedShowExcerptRef.current = !mixedShowExcerptRef.current;
    } else if (useBlogExcerpts) {
      showBlogExcerpt(blogExcerptIndexRef.current);
      blogExcerptIndexRef.current = (blogExcerptIndexRef.current + 1) % blogExcerpts.length;
    } else {
      if (cycleQueueRef.current.length === 0) {
        cycleQueueRef.current = buildCycleQueue();
      }
      showQuote(cycleQueueRef.current.shift());
    }
  }, [mixedMode, useBlogExcerpts, blogExcerpts.length, showBlogExcerpt, showQuote, buildCycleQueue]);

  const startQuoteCycle = useCallback(() => {
    if (carouselActiveRef.current) return;
    carouselActiveRef.current = true;

    if (mixedMode) {
      blogExcerptIndexRef.current = 0;
      showBlogExcerpt(0);
      blogExcerptIndexRef.current = 1 % blogExcerpts.length;
      mixedShowExcerptRef.current = false;
    } else if (useBlogExcerpts) {
      blogExcerptIndexRef.current = 0;
      showBlogExcerpt(0);
      blogExcerptIndexRef.current = 1 % blogExcerpts.length;
    } else {
      cycleQueueRef.current = buildCycleQueue();
      showQuote(cycleQueueRef.current.shift());
    }

    quoteCycleTimerRef.current = setInterval(cycleCarousel, 7000);
  }, [mixedMode, useBlogExcerpts, blogExcerpts.length, showBlogExcerpt, showQuote, buildCycleQueue, cycleCarousel]);

  const stopQuoteCycle = useCallback(() => {
    if (!carouselActiveRef.current) return;
    carouselActiveRef.current = false;
    if (quoteTextRef.current) quoteTextRef.current.classList.remove('visible');
    clearInterval(quoteCycleTimerRef.current);
    quoteCycleTimerRef.current = null;
  }, []);

  /* ── Main update function ── */
  const update = useCallback(() => {
    tickingRef.current = false;
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const p = clamp(scrollY / maxScroll, 0, 1);

    document.documentElement.style.setProperty('--p', p);

    /* Play button */
    if (playBtnRef.current) {
      if (p > 0.16) {
        playBtnRef.current.classList.add('hidden');
      } else {
        playBtnRef.current.classList.remove('hidden');
      }
    }

    /* Loop */
    if (p >= 0.995 && !isLoopingRef.current) {
      stopAutoPlay();
      triggerLoop();
      return;
    }

    /* Aurora blobs */
    const auroraBase = 0.18 + p * 0.35;
    const blobs = [
      document.getElementById('auroraBlob1'),
      document.getElementById('auroraBlob2'),
      document.getElementById('auroraBlob3'),
      document.getElementById('auroraBlob4'),
      document.getElementById('auroraBlob5'),
    ];
    if (blobs[0]) blobs[0].style.opacity = auroraBase + Math.sin(p * Math.PI * 3) * 0.10;
    if (blobs[1]) blobs[1].style.opacity = auroraBase * 0.85 + Math.sin(p * Math.PI * 2.5 + 1.2) * 0.12;
    if (blobs[2]) blobs[2].style.opacity = auroraBase * 0.9 + Math.sin(p * Math.PI * 2 + 2.4) * 0.08;
    if (blobs[3]) blobs[3].style.opacity = auroraBase * 0.65 + Math.sin(p * Math.PI * 4 + 0.8) * 0.10;
    if (blobs[4]) blobs[4].style.opacity = auroraBase * 0.8 + Math.cos(p * Math.PI * 3 + 1.8) * 0.09;

    /* Social links */
    if (p >= 0.75) socialRevealedRef.current = true;
    if (socialGithubRef.current) socialGithubRef.current.classList.toggle('visible', socialRevealedRef.current);
    if (socialLinkedinRef.current) socialLinkedinRef.current.classList.toggle('visible', socialRevealedRef.current);

    /* Shapes spread */
    const shapeArr = shapeElsRef.current;
    if (shapeArr.length) {
      const spread = ease(Math.min(p * 3, 1));
      for (let i = 0; i < shapeArr.length; i++) {
        const el = shapeArr[i];
        const { origTop, origLeft } = precomputedShapePositions[i];
        const dx = (origLeft - 50) * spread * 1.2;
        const dy = (origTop - 50) * spread * 1.2;
        const rot = spread * (origLeft > 50 ? 90 : -90);
        const sc = 1 + spread * 0.4;
        const op = 1 - spread * 0.5;
        el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${sc})`;
        el.style.opacity = op;
      }
    }

    /* Scene 1: Grid */
    const g = band(p, 0.15, 0.35);
    const gShow = g > 0 && g < 1;
    const sceneGrid = document.getElementById('sceneGrid');
    if (sceneGrid) {
      sceneGrid.style.opacity = gShow ? Math.min(g * 5, 1, (1 - g) * 5) : 0;
      if (gShow) {
        const gEased = ease(g);
        const cells = gridCellsRef.current;
        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i];
          const row = Math.floor(i / 8);
          const col = i % 8;
          const dist = Math.sqrt((row - 2.5) ** 2 + (col - 3.5) ** 2) / 4;
          const delay = dist * 0.3;
          const cellP = clamp((gEased - delay) / (1 - delay), 0, 1);
          const scale = 0.3 + cellP * 0.7;
          const rotation = (1 - cellP) * 45;
          cell.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
          cell.style.opacity = cellP;
          cell.style.borderColor = `rgba(255,255,255,${0.06 + cellP * 0.12})`;
        }
      }
    }

    /* Scene 2: Wave */
    const w = band(p, 0.30, 0.55);
    const wShow = w > 0 && w < 1;
    const sceneWave = document.getElementById('sceneWave');
    if (sceneWave) {
      sceneWave.style.opacity = wShow ? Math.min(w * 5, 1, (1 - w) * 5) : 0;
      if (wShow) {
        const bars = waveBarsRef.current;
        for (let i = 0; i < bars.length; i++) {
          const bar = bars[i];
          const phase = (i / BAR_COUNT) * Math.PI * 4 + w * Math.PI * 6;
          const h = 20 + Math.sin(phase) * 60 * ease(Math.min(w * 2, 1));
          bar.style.height = `${h}px`;
          bar.style.opacity = 0.15 + Math.abs(Math.sin(phase)) * 0.35;
        }
      }
    }

    /* Scene 3: Orbits */
    const o = band(p, 0.50, 0.75);
    const oShow = o > 0 && o < 1;
    const sceneOrbit = document.getElementById('sceneOrbit');
    if (sceneOrbit) {
      sceneOrbit.style.opacity = oShow ? Math.min(o * 5, 1, (1 - o) * 5) : 0;
      if (oShow) {
        const oEased = ease(o);
        const rings = orbitRingsRef.current;
        for (let i = 0; i < rings.length; i++) {
          const ring = rings[i];
          const baseSize = 60 + i * 50;
          const size = baseSize * (0.2 + oEased * 0.8);
          ring.style.width = `${size}px`;
          ring.style.height = `${size}px`;
          ring.style.borderColor = `rgba(255,255,255,${0.04 + oEased * 0.1})`;
          ring.style.opacity = oEased;
          const pipAngle = oEased * 360 * (1 + i * 0.5);
          ring.style.transform = `translate(-50%, -50%) rotate(${pipAngle}deg)`;
        }
      }
    }

    /* Scene 4: Converge */
    const c = band(p, 0.70, 0.90);
    const cShow = c > 0 && c < 1;
    const sceneConverge = document.getElementById('sceneConverge');
    if (sceneConverge) {
      sceneConverge.style.opacity = cShow ? Math.min(c * 5, 1, (1 - c) * 5) : 0;
      if (cShow) {
        const cEased = ease(c);
        const dots = convergeDotsRef.current;
        for (let i = 0; i < dots.length; i++) {
          const dot = dots[i];
          const angle = convergeData.angles[i] + cEased * Math.PI;
          const radius = convergeData.radii[i] * (1 - cEased * 0.85) * 50;
          const x = 50 + Math.cos(angle) * radius;
          const y = 50 + Math.sin(angle) * radius;
          dot.style.left = `${x}%`;
          dot.style.top = `${y}%`;
          dot.style.opacity = 0.3 + cEased * 0.7;
          dot.style.transform = `scale(${0.5 + cEased * 1.5})`;
        }
      }
    }

    /* Quotes carousel visibility */
    const qFadeIn = band(p, 0.06, 0.10);
    const qFadeOut = band(p, 0.82, 0.88);
    const qOpacity = p < 0.06 ? 0 : p > 0.88 ? 0 : Math.min(ease(qFadeIn), 1 - ease(qFadeOut));
    if (quotesCarouselRef.current) {
      quotesCarouselRef.current.style.opacity = qOpacity;
      quotesCarouselRef.current.classList.toggle('has-excerpts', useBlogExcerpts || mixedMode);
    }

    if (qOpacity > 0.05 && !carouselActiveRef.current) {
      startQuoteCycle();
    } else if (qOpacity <= 0.05 && carouselActiveRef.current) {
      stopQuoteCycle();
    }

    /* Final title */
    const f = band(p, 0.88, 1.0);
    const finalEl = document.getElementById('final');
    if (finalEl) finalEl.style.opacity = ease(f);
  }, [convergeData, useBlogExcerpts, mixedMode, startQuoteCycle, stopQuoteCycle]);

  /* ── Loop mechanism ── */
  const triggerLoop = useCallback(() => {
    if (isLoopingRef.current) return;
    isLoopingRef.current = true;

    if (loopFlashRef.current) loopFlashRef.current.classList.add('active');

    setTimeout(() => {
      window.scrollTo(0, 0);
      update();

      setTimeout(() => {
        if (loopFlashRef.current) loopFlashRef.current.classList.remove('active');
        setTimeout(() => { isLoopingRef.current = false; }, 600);
      }, 100);
    }, 600);
  }, [update]);

  /* ── Auto-play ── */
  const stopAutoPlay = useCallback(() => {
    autoPlayingRef.current = false;
    if (playBtnRef.current) playBtnRef.current.classList.remove('playing');
    if (autoPlayRafRef.current) {
      cancelAnimationFrame(autoPlayRafRef.current);
      autoPlayRafRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    if (autoPlayingRef.current) {
      stopAutoPlay();
      return;
    }
    autoPlayingRef.current = true;
    if (playBtnRef.current) playBtnRef.current.classList.add('playing');

    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const totalDuration = 28000;
    const startScroll = window.scrollY;
    const remaining = maxScroll - startScroll;
    const startTime = performance.now();

    function autoStep(now) {
      if (!autoPlayingRef.current) return;

      const elapsed = now - startTime;
      const rawT = Math.min(elapsed / totalDuration, 1);
      const t = rawT < 0.05 ? 2 * rawT * rawT / 0.05 : rawT;
      const targetScroll = startScroll + remaining * t;
      window.scrollTo(0, targetScroll);

      if (rawT < 1) {
        autoPlayRafRef.current = requestAnimationFrame(autoStep);
      } else {
        stopAutoPlay();
      }
    }

    autoPlayRafRef.current = requestAnimationFrame(autoStep);
  }, [stopAutoPlay]);

  /* ── Set up scroll handler and cleanup ── */
  useLayoutEffect(() => {
    document.body.style.minHeight = '600vh';

    /* Cache DOM element arrays once (mirrors vanilla version's top-level queries) */
    if (shapesRef.current) {
      shapeElsRef.current = Array.from(shapesRef.current.querySelectorAll('.shape'));
    }
    if (gridRef.current) {
      gridCellsRef.current = Array.from(gridRef.current.querySelectorAll('.grid-cell'));
    }
    if (waveRef.current) {
      waveBarsRef.current = Array.from(waveRef.current.querySelectorAll('.wave-bar'));
    }
    if (orbitsRef.current) {
      orbitRingsRef.current = Array.from(orbitsRef.current.querySelectorAll('.orbit-ring'));
    }
    if (convergeRef.current) {
      convergeDotsRef.current = Array.from(convergeRef.current.querySelectorAll('.converge-dot'));
    }

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(update);
    };

    const onWheel = () => { if (autoPlayingRef.current) stopAutoPlay(); };
    const onTouch = () => { if (autoPlayingRef.current) stopAutoPlay(); };
    const onKey = (e) => {
      if (autoPlayingRef.current && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ')) {
        stopAutoPlay();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('keydown', onKey);

    /* Initial update */
    update();

    return () => {
      document.body.style.minHeight = '';
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('keydown', onKey);
      stopAutoPlay();
      stopQuoteCycle();
    };
  }, [update, stopAutoPlay, stopQuoteCycle]);

  /* ── Build grid cells ── */
  const gridCells = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => <div key={i} className="grid-cell" />);
  }, []);

  /* ── Build wave bars ── */
  const waveBars = useMemo(() => {
    return Array.from({ length: BAR_COUNT }, (_, i) => <div key={i} className="wave-bar" />);
  }, []);

  /* ── Build orbit rings ── */
  const orbitRings = useMemo(() => {
    return Array.from({ length: RING_COUNT }, (_, i) => (
      <div key={i} className="orbit-ring">
        <div className="pip" />
      </div>
    ));
  }, []);

  /* ── Build converge dots ── */
  const convergeDots = useMemo(() => {
    return Array.from({ length: CONVERGE_COUNT }, (_, i) => <div key={i} className="converge-dot" />);
  }, []);

  return (
    <>
      <Aurora variant="full" />

      {/* Loop transition flash */}
      <div className="loop-flash" ref={loopFlashRef} />

      {/* Hero title */}
      <div className="hero">
        <h1 className="title">Między kodem, a kulturą</h1>
      </div>

      {/* Play button */}
      <button
        className="play-btn"
        ref={playBtnRef}
        aria-label="Odtwórz animację"
        onClick={startAutoPlay}
      >
        <svg className="play-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <polygon points="5,3 19,12 5,21" />
        </svg>
        <svg className="pause-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="3" width="4" height="18" />
          <rect x="15" y="3" width="4" height="18" />
        </svg>
      </button>

      {/* Scroll indicator */}
      <div className="scroll-hint">
        <span className="line" />
        <span className="dot" />
      </div>

      {/* Floating background shapes */}
      <div className="shapes" ref={shapesRef}>
        {shapesData.map((shape, i) => (
          shape.content ? (
            <div key={i} className={`shape shape--${shape.type}`} style={shape.style}>
              {shape.content}
            </div>
          ) : (
            <div key={i} className={`shape shape--${shape.type}`} style={shape.style} />
          )
        ))}
      </div>

      {/* Scene 1: Grid */}
      <div className="scene scene-grid" id="sceneGrid">
        <div className="grid-container" ref={gridRef}>{gridCells}</div>
      </div>

      {/* Scene 2: Wave */}
      <div className="scene scene-wave" id="sceneWave">
        <div className="wave-container" ref={waveRef}>{waveBars}</div>
      </div>

      {/* Scene 3: Orbits */}
      <div className="scene scene-orbit" id="sceneOrbit">
        <div className="orbit-container" ref={orbitsRef}>{orbitRings}</div>
      </div>

      {/* Scene 4: Converge */}
      <div className="scene scene-converge" id="sceneConverge">
        <div className="converge-container" ref={convergeRef}>{convergeDots}</div>
      </div>

      {/* Final title */}
      <div className="final" id="final">
        <span className="title-end">Między kodem, a kulturą</span>
      </div>

      {/* Quotes carousel */}
      <div className="quotes-carousel" ref={quotesCarouselRef}>
        <div className="quote-inner">
          <div className="quote-text" ref={quoteTextRef} />
          <div className="quote-author" ref={quoteAuthorRef} />
        </div>
      </div>

      {/* Blog navigation link */}
      <div className="blog-nav">
        <Link to="/blog">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
          Blog
        </Link>
      </div>

      {/* Social links */}
      <div className="social-links social-links--left" ref={socialGithubRef}>
        <a href="https://github.com/jakubciszak" target="_blank" rel="noopener noreferrer" className="social-link">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          <span>jakubciszak</span>
        </a>
      </div>
      <div className="social-links social-links--right" ref={socialLinkedinRef}>
        <a href="https://www.linkedin.com/in/jakub-ciszak" target="_blank" rel="noopener noreferrer" className="social-link">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <span>jakub-ciszak</span>
        </a>
      </div>
    </>
  );
}
