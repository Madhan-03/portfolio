// ========== WEB CONNECTING EFFECT ==========
(function initWebConnectingEffect() {
  let canvas = document.getElementById("webCanvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "webCanvas";
    document.body.insertBefore(canvas, document.body.firstChild);
  }

  const ctx = canvas.getContext("2d");
  let width = window.innerWidth;
  let height = window.innerHeight;
  let points = [];
  const numPoints = 70;
  const connectionDistance = 160;
  const mouseRadius = 200;
  let mouseX = null;
  let mouseY = null;

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    generatePoints();
  }

  function generatePoints() {
    points = [];
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 2.5 + 1.5,
      });
    }
  }

  function updatePoints() {
    for (let i = 0; i < points.length; i++) {
      points[i].x += points[i].vx;
      points[i].y += points[i].vy;
      if (points[i].x < 10 || points[i].x > width - 10) points[i].vx *= -0.98;
      if (points[i].y < 10 || points[i].y > height - 10) points[i].vy *= -0.98;
      points[i].x = Math.max(5, Math.min(width - 5, points[i].x));
      points[i].y = Math.max(5, Math.min(height - 5, points[i].y));
      if (mouseX !== null && mouseY !== null) {
        const dx = points[i].x - mouseX;
        const dy = points[i].y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRadius) {
          const angle = Math.atan2(dy, dx);
          const force = ((mouseRadius - dist) / mouseRadius) * 1.2;
          points[i].x += Math.cos(angle) * force;
          points[i].y += Math.sin(angle) * force;
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Always dark theme colors
    const lineColor = "rgba(0, 229, 255, 0.4)";
    const dotOuter = "rgba(168, 85, 247, 0.15)";
    const dotMid = "rgba(0, 229, 255, 0.55)";
    const dotInner = "rgba(168, 85, 247, 0.85)";

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.4;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.strokeStyle = lineColor.replace("0.4", opacity);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    }

    for (let i = 0; i < points.length; i++) {
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, points[i].radius + 2, 0, Math.PI * 2);
      ctx.fillStyle = dotOuter;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, points[i].radius, 0, Math.PI * 2);
      ctx.fillStyle = dotMid;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, points[i].radius / 1.5, 0, Math.PI * 2);
      ctx.fillStyle = dotInner;
      ctx.fill();
    }

    updatePoints();
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouseX = null;
    mouseY = null;
  });
  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches[0]) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    },
    { passive: false },
  );
  window.addEventListener("touchend", () => {
    mouseX = null;
    mouseY = null;
  });

  resizeCanvas();
  draw();
})();

// ========== MAIN SCRIPT ==========
(function () {
  "use strict";

  // TYPING
  function initTyping() {
    const typed = document.querySelector(".typed-text");
    if (!typed) return;
    const roles = ["Software Developer", "Problem Solver", "Quick Learner"];
    let roleIndex = 0,
      charIndex = 0,
      isDeleting = false;
    function typeEffect() {
      const current = roles[roleIndex];
      if (isDeleting) {
        typed.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(typeEffect, 500);
          return;
        }
        setTimeout(typeEffect, 60);
      } else {
        typed.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(typeEffect, 2000);
          return;
        }
        setTimeout(typeEffect, 100);
      }
    }
    setTimeout(typeEffect, 500);
  }

  // SLIDE ANIMATIONS
  function initSlideAnimations() {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    );
    document
      .querySelectorAll(".slide-section")
      .forEach((el) => obs.observe(el));

    const tObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -30px 0px" },
    );
    document
      .querySelectorAll(
        ".timeline-item, .card-cert.animate-left, .achieve-item.animate-right",
      )
      .forEach((el) => tObs.observe(el));

    function updateTimelineProgress() {
      document.querySelectorAll(".timeline-wrapper").forEach((wrapper) => {
        const line = wrapper.querySelector(".timeline-progress-line");
        if (!line) return;
        const rect = wrapper.getBoundingClientRect();
        const total = rect.height + window.innerHeight;
        const scrolled = Math.max(0, window.innerHeight - rect.top);
        const progress = Math.min(100, Math.max(0, (scrolled / total) * 100));
        line.style.height = progress + "%";
      });
    }
    window.addEventListener("scroll", updateTimelineProgress);
    window.addEventListener("resize", updateTimelineProgress);
    setTimeout(updateTimelineProgress, 100);
  }

  // ACTIVE NAV (DESKTOP + MOBILE BOTTOM)
  function initActiveNav() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");
    const bottomNavItems = document.querySelectorAll(".bottom-nav-item");

    // 1. INSTANT CYAN COLOR WHEN CLICKING AN ICON
    bottomNavItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        // Remove active from all
        bottomNavItems.forEach((nav) => nav.classList.remove("active"));
        navLinks.forEach((nav) => nav.classList.remove("active"));

        // Add active to clicked
        this.classList.add("active");
      });
    });

    // 2. UPDATE COLOR WHILE SCROLLING (Fallback)
    function updateActive() {
      let current = "";
      const scrollPos = window.scrollY + 150;
      sections.forEach((s) => {
        const top = s.offsetTop;
        const h = s.clientHeight;
        if (scrollPos >= top && scrollPos < top + h)
          current = s.getAttribute("id");
      });

      // Desktop
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href").substring(1) === current,
        );
      });

      // Mobile Bottom Nav
      bottomNavItems.forEach((item) => {
        if (item.getAttribute("data-section") === current) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    }
    window.addEventListener("scroll", updateActive);
    window.addEventListener("load", updateActive);
  }

  // SMOOTH SCROLL
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (targetId === "#" || targetId === "") return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const header = document.querySelector("header");
        const offset = header ? header.offsetHeight : 0;
        window.scrollTo({
          top:
            target.getBoundingClientRect().top +
            window.pageYOffset -
            offset -
            10,
          behavior: "smooth",
        });
      });
    });
  }

  // SCROLL PROGRESS
  function initScrollProgress() {
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    window.addEventListener("scroll", () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (window.scrollY / h) * 100 + "%";
    });
  }

  // CONTACT FORM
  function initContactForm() {
    const form = document.getElementById("contactForm");
    const feedback = document.getElementById("formFeedback");
    if (!form) return;
    const publicKey = "Lcl5_FPpIUEWr6joN";
    const serviceId = "service_1020nur";
    const templateId = "template_ffz5yvq";
    if (typeof emailjs !== "undefined") emailjs.init(publicKey);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const message = document.getElementById("message")?.value.trim();
      if (!name || !email || !message) {
        feedback.innerHTML =
          '<span style="color:#f87171;">⚠️ Please fill all fields.</span>';
        setTimeout(() => (feedback.innerHTML = ""), 3000);
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;
      try {
        const res = await emailjs.send(serviceId, templateId, {
          from_name: name,
          from_email: email,
          message: message,
          to_email: "madhankumar8874@gmail.com",
          reply_to: email,
          date: new Date().toLocaleString(),
        });
        if (res.status === 200) {
          feedback.innerHTML =
            '<span style="color:#4ade80;">✨ Message sent successfully! I\'ll reply within 24 hours.</span>';
          form.reset();
        }
      } catch (err) {
        feedback.innerHTML =
          '<span style="color:#f87171;">❌ Failed to send. Please email directly: madhankumar8874@gmail.com</span>';
      } finally {
        btn.innerHTML = orig;
        btn.disabled = false;
        setTimeout(() => (feedback.innerHTML = ""), 5000);
      }
    });
  }

  // LOADER
  function initLoader() {
    setTimeout(() => {
      const loader = document.getElementById("loader");
      if (loader) {
        loader.classList.add("hidden");
        setTimeout(() => {
          if (loader.parentNode) loader.parentNode.removeChild(loader);
        }, 500);
      }
    }, 1200);
  }

  // INIT
  document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initTyping();
    initActiveNav(); // Includes the click listener
    initSmoothScroll();
    initSlideAnimations();
    initScrollProgress();
    initContactForm();
  });
})();
