/**
 * ==========================================================================
 * GRADE 2: BOOTSTRAP + GSAP PORTFOLIO DEMO
 * Professional scroll animations with GSAP ScrollTrigger
 * ==========================================================================
 *
 * 🎓 LEARNING OBJECTIVES:
 * - Understand GSAP (GreenSock Animation Platform) fundamentals
 * - Master ScrollTrigger for scroll-based animations
 * - Learn timeline animations for complex sequences
 * - Implement batch animations for performance
 * - Build accessible animations with motion preferences
 *
 * 📚 WHAT IS GSAP?
 * GSAP is the industry-standard JavaScript animation library used by
 * companies like Google, Apple, and Netflix. It's:
 * - More powerful than CSS animations (complex sequences, fine control)
 * - More performant than jQuery animations (optimized for 60fps)
 * - Easier than vanilla JS animations (intuitive API)
 *
 * 💰 LICENSING NOTE:
 * GSAP core and ScrollTrigger are FREE for most use cases.
 * Only premium "Club GreenSock" plugins require payment.
 *
 * 🔗 GSAP DOCS: https://gsap.com/docs/v3/
 * 🔗 SCROLLTRIGGER: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
 */

// ==========================================================================
// 1. GSAP SETUP
// ==========================================================================

/**
 * REGISTER SCROLLTRIGGER PLUGIN
 *
 * GSAP uses a plugin architecture. ScrollTrigger is separate from core GSAP.
 * You MUST register plugins before using them.
 *
 * Think of it like:
 * - gsap = the engine
 * - ScrollTrigger = a turbocharger you're adding to the engine
 */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/**
 * ACCESSIBILITY: Check motion preferences BEFORE any animations
 *
 * This single check affects ALL animation functions below.
 * If user prefers reduced motion, we skip animations entirely.
 *
 * 📐 PATTERN: Check once, use everywhere
 * Rather than checking in every function, we check once at the top
 * and early-return from functions when this is true.
 */
const prefersReducedMotion = window.matchMedia(
	'(prefers-reduced-motion: reduce)'
).matches;

// ==========================================================================
// 2. HERO ANIMATIONS
// ==========================================================================

/**
 * Hero section animations: entrance sequence + floating elements + parallax
 *
 * 🎓 KEY GSAP CONCEPTS DEMONSTRATED:
 * - gsap.timeline() for sequenced animations
 * - gsap.to() and gsap.from() for tweening
 * - Position parameters for overlap control
 * - Infinite looping with repeat: -1
 * - ScrollTrigger with scrub for parallax
 */
function initHeroAnimations() {
	// Guard clause: Skip all hero animations if reduced motion is preferred
	if (prefersReducedMotion) return;

	/**
	 * GSAP TIMELINE: Sequenced Animation
	 *
	 * 📐 WHAT IS A TIMELINE?
	 * A timeline is a container for multiple animations that play in sequence.
	 * Without a timeline, all gsap.to() calls would start simultaneously.
	 * With a timeline, they play one after another (or with controlled overlap).
	 *
	 * 📐 THE defaults OPTION:
	 * Setting defaults: { ease: 'power3.out' } applies that easing to ALL
	 * animations in this timeline. DRY principle — Don't Repeat Yourself!
	 *
	 * 📐 EASING EXPLAINED:
	 * 'power3.out' means:
	 * - power3 = cubic curve (stronger than power1, power2)
	 * - out = starts fast, ends slow (deceleration)
	 * This creates a "gentle landing" feel perfect for entrance animations.
	 *
	 * Other common easings:
	 * - 'power1.out' — subtle
	 * - 'power2.out' — moderate (most common)
	 * - 'power3.out' — pronounced
	 * - 'power4.out' — dramatic
	 * - 'elastic.out' — bouncy overshoot
	 * - 'back.out' — slight overshoot and settle
	 */
	const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

	/**
	 * TIMELINE SEQUENCE WITH POSITION PARAMETERS
	 *
	 * The string parameter (like '-=0.6') controls WHEN the animation starts
	 * relative to the previous animation:
	 *
	 * - No parameter: Starts when previous animation ENDS
	 * - '-=0.6': Starts 0.6 seconds BEFORE previous ends (overlap)
	 * - '+=0.5': Starts 0.5 seconds AFTER previous ends (gap)
	 * - '<': Starts at same time as previous animation
	 * - '>': Starts when previous ends (same as no parameter)
	 *
	 * The overlaps ('-=0.6', '-=0.4', '-=0.2') create a cascading effect
	 * where elements appear to flow in rather than pop one by one.
	 */
	heroTl
		// First: Main title slides up and fades in
		.from('.hero-title', {
			y: 100,           // Start 100px below final position
			opacity: 0,       // Start invisible
			duration: 1,      // Take 1 second to animate
		})
		// Second: Subtitle follows (overlaps by 0.6s for smooth flow)
		.from(
			'.hero-subtitle',
			{
				y: 50,
				opacity: 0,
				duration: 0.8,
			},
			'-=0.6'  // Start 0.6s before title animation ends
		)
		// Third: CTA buttons (overlaps by 0.4s)
		.from(
			'.hero-cta',
			{
				y: 30,
				opacity: 0,
				duration: 0.6,
			},
			'-=0.4'
		)
		// Fourth: Scroll indicator (just fades in, overlaps by 0.2s)
		.from(
			'.scroll-indicator',
			{
				opacity: 0,
				duration: 0.5,
			},
			'-=0.2'
		);

	/**
	 * INFINITE FLOATING ANIMATIONS (Ambient Motion)
	 *
	 * 📐 THE PATTERN:
	 * - repeat: -1 — Loop forever (-1 means infinite)
	 * - yoyo: true — Reverse direction each loop (A→B→A→B instead of A→B→A→B)
	 * - ease: 'sine.inOut' — Smooth acceleration AND deceleration (feels organic)
	 *
	 * Different durations (8s, 10s, 7s) prevent shapes from syncing up,
	 * creating more natural, chaotic-looking movement.
	 *
	 * ⚠️ PERFORMANCE NOTE:
	 * Infinite animations run constantly. We're only animating transform
	 * properties (x, y) which are GPU-accelerated and won't cause jank.
	 * Never infinitely animate width, height, margin, etc.!
	 */
	gsap.to('.shape-1', {
		x: 50,          // Move 50px right
		y: -30,         // Move 30px up
		duration: 8,    // Over 8 seconds
		repeat: -1,     // Loop forever
		yoyo: true,     // Reverse each loop
		ease: 'sine.inOut',  // Smooth organic movement
	});

	gsap.to('.shape-2', {
		x: -40,
		y: 40,
		duration: 10,   // Different duration = doesn't sync with shape-1
		repeat: -1,
		yoyo: true,
		ease: 'sine.inOut',
	});

	gsap.to('.shape-3', {
		x: 30,
		y: 20,
		duration: 7,
		repeat: -1,
		yoyo: true,
		ease: 'sine.inOut',
	});

	/**
	 * SCROLLTRIGGER PARALLAX EFFECT
	 *
	 * 📐 WHAT IS PARALLAX?
	 * Parallax creates depth by moving background elements slower than
	 * foreground elements. As user scrolls, background "lags behind,"
	 * creating an illusion of 3D space.
	 *
	 * 📐 SCROLLTRIGGER CONFIG EXPLAINED:
	 *
	 * trigger: '.hero'
	 *   - The element that defines the scroll range
	 *
	 * start: 'top top'
	 *   - Format: "[trigger position] [scroller position]"
	 *   - "top top" = when hero's TOP hits viewport's TOP
	 *
	 * end: 'bottom top'
	 *   - "bottom top" = when hero's BOTTOM hits viewport's TOP
	 *   - This means animation runs while hero is visible
	 *
	 * scrub: true
	 *   - CRUCIAL! Links animation progress to scroll position
	 *   - Without scrub: animation plays once when triggered
	 *   - With scrub: animation progress = scroll progress
	 *   - scrub: 0.5 would add 0.5s smoothing/lag
	 *
	 * 📐 yPercent: 30 EXPLAINED:
	 * Moves element by 30% of its OWN height as you scroll.
	 * Using percentage (not pixels) makes it responsive.
	 */
	gsap.to('.hero-bg', {
		yPercent: 30,      // Move down 30% of its height
		ease: 'none',      // Linear movement — matches scroll exactly
		scrollTrigger: {
			trigger: '.hero',
			start: 'top top',
			end: 'bottom top',
			scrub: true,     // Link to scroll position
		},
	});

	// Floating shapes also have parallax (slower than background)
	gsap.to('.floating-shapes', {
		yPercent: 20,      // Moves less than background (less parallax)
		ease: 'none',
		scrollTrigger: {
			trigger: '.hero',
			start: 'top top',
			end: 'bottom top',
			scrub: true,
		},
	});
}

// ==========================================================================
// 3. SCROLL REVEAL ANIMATIONS
// ==========================================================================

/**
 * Generic scroll-triggered reveal for any element with .gsap-reveal class
 *
 * 🎓 gsap.utils.toArray() EXPLAINED:
 * GSAP provides utility functions. toArray() converts:
 * - NodeList (from querySelectorAll) → Array
 * - Single element → Array with one item
 * - Selector string → Array of matching elements
 *
 * This ensures we can always use array methods like forEach().
 *
 * 📐 gsap.from() vs gsap.to():
 * - gsap.to(el, { x: 100 }) — animate FROM current state TO x:100
 * - gsap.from(el, { x: 100 }) — animate FROM x:100 TO current state
 *
 * For reveals, we use .from() because we want elements to animate
 * FROM invisible/offset TO their natural CSS state.
 */
function initScrollReveals() {
	if (prefersReducedMotion) return;

	// Convert selector to array and loop through each element
	gsap.utils.toArray('.gsap-reveal').forEach((el) => {
		gsap.from(el, {
			y: 50,             // Start 50px below
			opacity: 0,        // Start invisible
			duration: 0.8,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: el,   // This element triggers its own animation
				start: 'top 85%',  // When element's top hits 85% of viewport

				/**
				 * toggleActions: 'play none none none'
				 *
				 * 📐 FORMAT: 'onEnter onLeave onEnterBack onLeaveBack'
				 *
				 * Options for each: play, pause, resume, reset, restart, complete, reverse, none
				 *
				 * 'play none none none' means:
				 * - onEnter: play the animation
				 * - onLeave: do nothing (animation stays at end)
				 * - onEnterBack: do nothing (don't replay when scrolling back up)
				 * - onLeaveBack: do nothing
				 *
				 * This creates a "one-time reveal" effect.
				 */
				toggleActions: 'play none none none',
			},
		});
	});
}

// ==========================================================================
// 4. SKILL BARS ANIMATION
// ==========================================================================

/**
 * Animated progress bars that fill when scrolled into view
 *
 * 🎓 DATA ATTRIBUTES FOR CONFIGURATION:
 * Using data-width="95" on HTML elements lets us:
 * - Keep animation config in HTML (content) not JS (behavior)
 * - Easily change values without touching JavaScript
 * - Support dynamic content from a CMS
 *
 * HTML: <div class="skill-bar" data-width="95"></div>
 * JS: bar.dataset.width → "95"
 */
function initSkillBars() {
	const skillBars = document.querySelectorAll('.skill-bar');

	skillBars.forEach((bar) => {
		// Read target width from data attribute
		const targetWidth = bar.dataset.width + '%';

		// Accessibility: Show final state immediately if motion is reduced
		if (prefersReducedMotion) {
			bar.style.width = targetWidth;
			return;  // Skip animation setup for this element
		}

		/**
		 * ANIMATE WIDTH (Exception to the rule!)
		 *
		 * ⚠️ We said "never animate width" for performance reasons.
		 * Skill bars are an exception because:
		 * 1. The bar is small (low rendering cost)
		 * 2. It's a one-time animation, not continuous
		 * 3. The visual effect (filling bar) requires width animation
		 *
		 * For large elements or continuous animations, use transform: scaleX() instead.
		 */
		gsap.to(bar, {
			width: targetWidth,
			duration: 1.2,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: bar,
				start: 'top 90%',
				toggleActions: 'play none none none',
			},
		});
	});
}

// ==========================================================================
// 5. PROJECT CARDS STAGGER ANIMATION
// ==========================================================================

/**
 * Batch animation for project cards with staggered reveal
 *
 * 🎓 ScrollTrigger.batch() EXPLAINED:
 * batch() is a PERFORMANCE OPTIMIZATION for animating many elements.
 *
 * Instead of creating individual ScrollTriggers for each card (expensive!),
 * batch() groups elements and fires callbacks with arrays of elements
 * that enter/leave together.
 *
 * 📐 WHY THIS MATTERS:
 * - 100 project cards with individual triggers = 100 ScrollTrigger instances
 * - 100 project cards with batch = 1 ScrollTrigger instance
 * - Much better memory usage and scroll performance!
 *
 * 📐 STAGGER EXPLAINED:
 * stagger: 0.15 means each element starts animating 0.15s after the previous.
 * If 4 cards enter at once:
 * - Card 1: starts at 0s
 * - Card 2: starts at 0.15s
 * - Card 3: starts at 0.3s
 * - Card 4: starts at 0.45s
 *
 * This creates the cascading "wave" effect.
 */
function initProjectCards() {
	if (prefersReducedMotion) return;

	ScrollTrigger.batch('.project-card', {
		/**
		 * onEnter receives an array of ALL elements that just entered the viewport
		 * (in this scroll frame). We animate them as a batch with stagger.
		 */
		onEnter: (batch) =>
			gsap.from(batch, {
				y: 60,           // Start 60px below
				opacity: 0,      // Start invisible
				duration: 0.8,
				stagger: 0.15,   // 0.15s delay between each card
				ease: 'power2.out',
			}),
		start: 'top 90%',   // Trigger when card top hits 90% of viewport
		once: true,          // Only animate once (no re-triggering on scroll back)
	});
}

// ==========================================================================
// 6. NAVBAR BACKGROUND ON SCROLL
// ==========================================================================

/**
 * Dynamic navbar styling based on scroll position
 *
 * 🎓 ScrollTrigger.create() EXPLAINED:
 * create() makes a standalone ScrollTrigger NOT attached to an animation.
 * Use this when you want scroll-based logic WITHOUT animating properties.
 *
 * Examples:
 * - Toggle classes (like we're doing here)
 * - Fire analytics events at certain scroll points
 * - Lazy-load content when user scrolls near it
 * - Show/hide elements based on scroll direction
 *
 * 📐 THE CALLBACK PATTERN:
 * Instead of animating, we use onUpdate callback to run custom code
 * whenever scroll position changes.
 */
function initNavbarScroll() {
	const navbar = document.querySelector('.navbar');

	ScrollTrigger.create({
		/**
		 * start: 'top -100' means this trigger activates when
		 * the page is scrolled 100px down from the top.
		 *
		 * Format: "[trigger position] [scroller position]"
		 * But when there's no trigger element, it's just the scroll position.
		 */
		start: 'top -100',

		/**
		 * onUpdate fires on EVERY scroll event while trigger is active.
		 *
		 * self.scroll() returns current scroll position in pixels.
		 * We use this to toggle a class that changes navbar appearance.
		 */
		onUpdate: (self) => {
			if (self.scroll() > 100) {
				navbar.classList.add('scrolled');    // Add solid background
			} else {
				navbar.classList.remove('scrolled'); // Remove (transparent)
			}
		},
	});
}

// ==========================================================================
// 7. Smooth Scroll for Anchor Links
// ==========================================================================

function initSmoothScroll() {
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener('click', (e) => {
			const targetId = anchor.getAttribute('href');
			if (targetId === '#') return;

			const target = document.querySelector(targetId);
			if (target) {
				e.preventDefault();

				// Close mobile menu if open
				const navbarCollapse = document.querySelector('.navbar-collapse');
				if (navbarCollapse.classList.contains('show')) {
					bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
				}

				const navHeight = document.querySelector('.navbar').offsetHeight;

				gsap.to(window, {
					duration: 0.8,
					scrollTo: { y: target, offsetY: navHeight },
					ease: 'power2.inOut',
				});
			}
		});
	});
}

// ==========================================================================
// 8. Initialize Everything
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
	initHeroAnimations();
	initScrollReveals();
	initSkillBars();
	initProjectCards();
	initNavbarScroll();
	initSmoothScroll();

	console.log('🚀 Grade 2 Demo: Bootstrap + GSAP animations initialized');

	// Refresh ScrollTrigger after all images load
	window.addEventListener('load', () => {
		ScrollTrigger.refresh();
	});
});

// ==========================================================================
// 9. Cleanup (for SPA environments)
// ==========================================================================

window.cleanupAnimations = () => {
	ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
	gsap.killTweensOf('*');
};