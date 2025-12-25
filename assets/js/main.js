/*
 * assets/js/main.js
 * - Inicializa animaciones (GSAP), smooth scroll (Lenis) y mejoras de accesibilidad.
 * - Mantener funciones init separadas para claridad y mantenimiento.
 */

(() => {
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Si no hay GSAP (por orden o fallo CDN), quitamos el "is-loading" para que no se quede oculto.
	if (typeof gsap === "undefined") {
		console.warn("GSAP no cargó. Revisa el orden de scripts.");
		document.body.classList.remove("is-loading");
		return;
	}

	gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

	// 1) ✅ Preparar estado inicial ANTES de mostrar (evita “se ve bien y luego desaparece”)
	// AutoAlpha controla opacity + visibility.
	gsap.set(".gsap-reveal", { autoAlpha: 0, y: 22 });

	// Mostrar página cuando ya está seteado
	document.body.classList.remove("is-loading");

	// 2) ✅ Smooth scroll REAL (Lenis) — si reduced motion, lo saltamos
	let lenis = null;

	if (!prefersReducedMotion && typeof Lenis !== "undefined") {
		lenis = new Lenis({
			lerp: 0.085,          // cuanto más bajo, más “mantequilla”
			wheelMultiplier: 0.9, // sensibilidad rueda
			smoothTouch: false,
		});

		lenis.on("scroll", ScrollTrigger.update);

		// Lenis RAF con GSAP ticker (sincronizado)
		gsap.ticker.add((time) => {
			lenis.raf(time * 1000);
		});
		gsap.ticker.lagSmoothing(0);
	}

	function initHeroAnimations() {
		if (prefersReducedMotion) {
			gsap.set(".gsap-reveal", { autoAlpha: 1, y: 0 });
			return;
		}

		const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

		heroTl
			.to(".hero-title", { autoAlpha: 1, y: 0, duration: 1.0 })
			.to(".hero-author", { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.65")
			.to(".kicker", { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.45")
			.to(".hero-subtitle", { autoAlpha: 1, y: 0, duration: 0.65 }, "-=0.45")
			.to(".hero-cta", { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.45")
			.to(".micro", { autoAlpha: 1, y: 0, duration: 0.55 }, "-=0.35")
			.to(".scroll-indicator", { autoAlpha: 1, duration: 0.45 }, "-=0.2");

		gsap.to(".shape-1", { x: 40, y: -25, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut" });
		gsap.to(".shape-2", { x: -35, y: 35, duration: 11, repeat: -1, yoyo: true, ease: "sine.inOut" });
		gsap.to(".shape-3", { x: 28, y: 18, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });

		gsap.to(".hero-bg", {
			yPercent: 18,
			ease: "none",
			scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
		});

		gsap.to(".floating-shapes", {
			yPercent: 12,
			ease: "none",
			scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
		});
	}

	function initScrollReveals() {
		if (prefersReducedMotion) return;

		gsap.utils.toArray(".gsap-reveal").forEach((el) => {
			// OJO: hero ya se anima en su timeline; evitamos “doble reveal”
			if (el.closest("#hero")) return;

			gsap.to(el, {
				autoAlpha: 1,
				y: 0,
				duration: 0.85,
				ease: "power2.out",
				scrollTrigger: {
					trigger: el,
					start: "top 88%",
					toggleActions: "play none none none",
				},
			});
		});
	}

	function initSkillBars() {
		const skillBars = document.querySelectorAll(".skill-bar");

		skillBars.forEach((bar) => {
			const targetWidth = bar.dataset.width + "%";

			if (prefersReducedMotion) {
				bar.style.width = targetWidth;
				return;
			}

			gsap.to(bar, {
				width: targetWidth,
				duration: 1.2,
				ease: "power2.out",
				scrollTrigger: { trigger: bar, start: "top 92%", toggleActions: "play none none none" },
			});
		});
	}

	function initProjectCards() {
		if (prefersReducedMotion) return;

		ScrollTrigger.batch('.project-card', {
			onEnter: (batch) =>
				gsap.to(batch, {
					autoAlpha: 1,
					y: 0,
					duration: 0.85,
					stagger: 0.12,
					ease: 'power2.out',
				}),
			start: 'top 92%',
			once: true,
		});
	}

	/**
	 * Soporte de teclado para tarjetas de proyecto: abrir con Enter/Espacio.
	 * Se centraliza en este fichero para separar comportamiento del marcado HTML.
	 */
	function initProjectCardKeyboardSupport() {
		const cards = document.querySelectorAll('.project-card[role="button"]');
		cards.forEach((card) => {
			card.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					card.click();
				}
			});
		});
	}

	function initNavbarScroll() {
		const navbar = document.querySelector(".navbar");

		ScrollTrigger.create({
			start: "top -80",
			onUpdate: (self) => {
				if (self.scroll() > 80) navbar.classList.add("scrolled");
				else navbar.classList.remove("scrolled");
			},
		});
	}

	function initSmoothScrollAnchors() {
		document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
			anchor.addEventListener("click", (e) => {
				const targetId = anchor.getAttribute("href");
				if (targetId === "#") return;

				const target = document.querySelector(targetId);
				if (!target) return;

				e.preventDefault();

				const navbarCollapse = document.querySelector(".navbar-collapse");
				if (navbarCollapse && navbarCollapse.classList.contains("show")) {
					bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
				}

				const navHeight = document.querySelector(".navbar")?.offsetHeight ?? 0;

				// ✅ si Lenis está activo, scrollea con Lenis (más suave aún)
				if (lenis) {
					lenis.scrollTo(target, { offset: -(navHeight + 14) });
					return;
				}

				// fallback GSAP
				gsap.to(window, {
					duration: 0.9,
					scrollTo: { y: target, offsetY: navHeight + 14 },
					ease: "power2.inOut",
				});
			});
		});
	}

	document.addEventListener("DOMContentLoaded", () => {
		initHeroAnimations();
		initScrollReveals();
		initSkillBars();
		initProjectCards();
		initProjectCardKeyboardSupport();
		initNavbarScroll();
		initSmoothScrollAnchors();

		window.addEventListener("load", () => {
			ScrollTrigger.refresh();
		});
	});
})();
