// ========== WEB CONNECTING EFFECT (OPTIMIZED FOR MOBILE) ==========
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
  let animationId;
  let numPoints = getPointCount();

  const connectionDistance = 160;
  const mouseRadius = 200;

  let mouseX = null;
  let mouseY = null;

  function getPointCount() {
    if (window.innerWidth <= 480) {
      return 34;
    }

    if (window.innerWidth <= 900) {
      return 44;
    }

    return 70;
  }

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2,
    );

    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0,
    );

    numPoints = getPointCount();

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

      if (
        points[i].x < 10 ||
        points[i].x > width - 10
      ) {
        points[i].vx *= -0.98;
      }

      if (
        points[i].y < 10 ||
        points[i].y > height - 10
      ) {
        points[i].vy *= -0.98;
      }

      points[i].x = Math.max(
        5,
        Math.min(width - 5, points[i].x),
      );

      points[i].y = Math.max(
        5,
        Math.min(height - 5, points[i].y),
      );

      if (mouseX !== null && mouseY !== null) {
        const dx = points[i].x - mouseX;
        const dy = points[i].y - mouseY;
        const distance = Math.sqrt(
          dx * dx + dy * dy,
        );

        if (distance < mouseRadius) {
          const angle = Math.atan2(dy, dx);

          const force =
            ((mouseRadius - distance) / mouseRadius) *
            1.2;

          points[i].x += Math.cos(angle) * force;
          points[i].y += Math.sin(angle) * force;
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const lineColor = "rgba(0, 229, 255, 0.4)";
    const dotOuter = "rgba(168, 85, 247, 0.15)";
    const dotMiddle = "rgba(0, 229, 255, 0.55)";
    const dotInner = "rgba(168, 85, 247, 0.85)";

    // Draw connecting lines
    for (let i = 0; i < points.length; i++) {
      for (
        let j = i + 1;
        j < points.length;
        j++
      ) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;

        const distance = Math.sqrt(
          dx * dx + dy * dy,
        );

        if (distance < connectionDistance) {
          const opacity =
            (1 - distance / connectionDistance) *
            0.4;

          ctx.beginPath();

          ctx.moveTo(
            points[i].x,
            points[i].y,
          );

          ctx.lineTo(
            points[j].x,
            points[j].y,
          );

          ctx.strokeStyle = lineColor.replace(
            "0.4",
            opacity,
          );

          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    }

    // Draw points
    for (let i = 0; i < points.length; i++) {
      ctx.beginPath();

      ctx.arc(
        points[i].x,
        points[i].y,
        points[i].radius + 2,
        0,
        Math.PI * 2,
      );

      ctx.fillStyle = dotOuter;
      ctx.fill();

      ctx.beginPath();

      ctx.arc(
        points[i].x,
        points[i].y,
        points[i].radius,
        0,
        Math.PI * 2,
      );

      ctx.fillStyle = dotMiddle;
      ctx.fill();

      ctx.beginPath();

      ctx.arc(
        points[i].x,
        points[i].y,
        points[i].radius / 1.5,
        0,
        Math.PI * 2,
      );

      ctx.fillStyle = dotInner;
      ctx.fill();
    }

    updatePoints();

    animationId = requestAnimationFrame(draw);
  }

  // Stop animation when browser tab is hidden
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animationId =
          requestAnimationFrame(draw);
      }
    },
  );

  window.addEventListener(
    "resize",
    resizeCanvas,
  );

  window.addEventListener(
    "mousemove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    },
  );

  window.addEventListener(
    "mouseleave",
    () => {
      mouseX = null;
      mouseY = null;
    },
  );

  window.addEventListener(
    "touchmove",
    (event) => {
      if (event.touches[0]) {
        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
      }
    },
    {
      passive: true,
    },
  );

  window.addEventListener(
    "touchend",
    () => {
      mouseX = null;
      mouseY = null;
    },
  );

  resizeCanvas();
  draw();
})();

// ========== MAIN SCRIPT ==========
(function () {
  "use strict";

  // ========== TYPING EFFECT ==========
  function initTyping() {
    const typed =
      document.querySelector(".typed-text");

    if (!typed) {
      return;
    }

    const roles = [
      "Software Developer",
      "Problem Solver",
      "Quick Learner",
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typed.textContent =
          currentRole.substring(
            0,
            charIndex - 1,
          );

        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;

          roleIndex =
            (roleIndex + 1) % roles.length;

          setTimeout(typeEffect, 500);
          return;
        }

        setTimeout(typeEffect, 60);
      } else {
        typed.textContent =
          currentRole.substring(
            0,
            charIndex + 1,
          );

        charIndex++;

        if (
          charIndex === currentRole.length
        ) {
          isDeleting = true;

          setTimeout(typeEffect, 2000);
          return;
        }

        setTimeout(typeEffect, 100);
      }
    }

    setTimeout(typeEffect, 500);
  }

  // ========== SLIDE ANIMATIONS ==========
  function initSlideAnimations() {
    const sectionObserver =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(
                "visible",
              );
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin:
            "0px 0px -50px 0px",
        },
      );

    document
      .querySelectorAll(".slide-section")
      .forEach((element) => {
        sectionObserver.observe(element);
      });

    const timelineObserver =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(
                "visible",
              );
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin:
            "0px 0px -30px 0px",
        },
      );

    document
      .querySelectorAll(
        ".timeline-item, .card-cert.animate-left, .achieve-item.animate-right",
      )
      .forEach((element) => {
        timelineObserver.observe(element);
      });

    function updateTimelineProgress() {
      document
        .querySelectorAll(
          ".timeline-wrapper",
        )
        .forEach((wrapper) => {
          const line =
            wrapper.querySelector(
              ".timeline-progress-line",
            );

          if (!line) {
            return;
          }

          const rectangle =
            wrapper.getBoundingClientRect();

          const total =
            rectangle.height +
            window.innerHeight;

          const scrolled = Math.max(
            0,
            window.innerHeight -
              rectangle.top,
          );

          const progress = Math.min(
            100,
            Math.max(
              0,
              (scrolled / total) * 100,
            ),
          );

          line.style.height =
            progress + "%";
        });
    }

    window.addEventListener(
      "scroll",
      updateTimelineProgress,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      updateTimelineProgress,
      {
        passive: true,
      },
    );

    setTimeout(
      updateTimelineProgress,
      100,
    );
  }

  // ========== ACTIVE NAVIGATION ==========
  function initActiveNav() {
    const sections =
      document.querySelectorAll("section");

    const desktopNavLinks =
      document.querySelectorAll(
        ".nav-link",
      );

    const bottomNavItems =
      document.querySelectorAll(
        ".bottom-nav-item",
      );

    function setActiveState(
      currentSection,
    ) {
      desktopNavLinks.forEach((link) => {
        const sectionName = link
          .getAttribute("href")
          .substring(1);

        link.classList.toggle(
          "active",
          sectionName === currentSection,
        );
      });

      bottomNavItems.forEach((item) => {
        const sectionName =
          item.getAttribute(
            "data-section",
          );

        const isActive =
          sectionName === currentSection;

        item.classList.toggle(
          "active",
          isActive,
        );

        if (isActive) {
          item.setAttribute(
            "aria-current",
            "page",
          );
        } else {
          item.removeAttribute(
            "aria-current",
          );
        }
      });
    }

    bottomNavItems.forEach((item) => {
      item.addEventListener(
        "click",
        function () {
          const sectionName =
            this.getAttribute(
              "data-section",
            );

          setActiveState(sectionName);
        },
      );
    });

    function updateActive() {
      let currentSection = "";

      const scrollPosition =
        window.scrollY +
        Math.min(
          180,
          window.innerHeight * 0.28,
        );

      sections.forEach((section) => {
        const sectionTop =
          section.offsetTop;

        const sectionHeight =
          section.clientHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition <
            sectionTop + sectionHeight
        ) {
          currentSection =
            section.getAttribute("id");
        }
      });

      const isAtPageEnd =
        window.innerHeight +
          window.scrollY >=
        document.documentElement
          .scrollHeight -
          4;

      if (isAtPageEnd) {
        currentSection = "contact";
      }

      setActiveState(
        currentSection || "home",
      );
    }

    let activeNavTicking = false;

    function requestActiveUpdate() {
      if (activeNavTicking) {
        return;
      }

      activeNavTicking = true;

      requestAnimationFrame(() => {
        updateActive();
        activeNavTicking = false;
      });
    }

    window.addEventListener(
      "scroll",
      requestActiveUpdate,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      requestActiveUpdate,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "load",
      updateActive,
    );

    updateActive();
  }

  // ========== SMOOTH SCROLL ==========
  function initSmoothScroll() {
    document
      .querySelectorAll('a[href^="#"]')
      .forEach((anchor) => {
        anchor.addEventListener(
          "click",
          function (event) {
            const targetId =
              this.getAttribute("href");

            if (
              targetId === "#" ||
              targetId === ""
            ) {
              return;
            }

            const target =
              document.querySelector(
                targetId,
              );

            if (!target) {
              return;
            }

            event.preventDefault();

            const header =
              document.querySelector(
                "header",
              );

            const headerOffset = header
              ? header.offsetHeight
              : 0;

            const targetPosition =
              target
                .getBoundingClientRect()
                .top +
              window.pageYOffset -
              headerOffset -
              10;

            window.scrollTo({
              top: targetPosition,
              behavior: "smooth",
            });
          },
        );
      });
  }

  // ========== SCROLL PROGRESS ==========
  function initScrollProgress() {
    const progressBar =
      document.createElement("div");

    progressBar.className =
      "scroll-progress";

    document.body.appendChild(
      progressBar,
    );

    window.addEventListener(
      "scroll",
      () => {
        const scrollableHeight =
          document.documentElement
            .scrollHeight -
          window.innerHeight;

        const progress =
          scrollableHeight > 0
            ? (window.scrollY /
                scrollableHeight) *
              100
            : 0;

        progressBar.style.width =
          Math.min(
            100,
            Math.max(0, progress),
          ) + "%";
      },
      {
        passive: true,
      },
    );
  }

  // ========== CONTACT FORM ==========
  function initContactForm() {
    const form =
      document.getElementById(
        "contactForm",
      );

    const feedback =
      document.getElementById(
        "formFeedback",
      );

    if (!form) {
      return;
    }

    const publicKey =
      "Lcl5_FPpIUEWr6joN";

    const serviceId =
      "service_1020nur";

    const templateId =
      "template_ffz5yvq";

    if (
      typeof emailjs !== "undefined"
    ) {
      emailjs.init(publicKey);
    }

    form.addEventListener(
      "submit",
      async (event) => {
        event.preventDefault();

        const name =
          document
            .getElementById("name")
            ?.value.trim();

        const email =
          document
            .getElementById("email")
            ?.value.trim();

        const message =
          document
            .getElementById("message")
            ?.value.trim();

        if (
          !name ||
          !email ||
          !message
        ) {
          feedback.innerHTML =
            '<span style="color:#f87171;">⚠️ Please fill all fields.</span>';

          setTimeout(() => {
            feedback.innerHTML = "";
          }, 3000);

          return;
        }

        const button =
          form.querySelector(
            'button[type="submit"]',
          );

        const originalContent =
          button.innerHTML;

        button.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Sending...';

        button.disabled = true;

        try {
          const response =
            await emailjs.send(
              serviceId,
              templateId,
              {
                from_name: name,
                from_email: email,
                message: message,
                to_email:
                  "madhankumar8874@gmail.com",
                reply_to: email,
                date: new Date()
                  .toLocaleString(),
              },
            );

          if (
            response.status === 200
          ) {
            feedback.innerHTML =
              '<span style="color:#4ade80;">✨ Message sent successfully! I\'ll reply within 24 hours.</span>';

            form.reset();
          }
        } catch (error) {
          feedback.innerHTML =
            '<span style="color:#f87171;">❌ Failed to send. Please email directly: madhankumar8874@gmail.com</span>';
        } finally {
          button.innerHTML =
            originalContent;

          button.disabled = false;

          setTimeout(() => {
            feedback.innerHTML = "";
          }, 5000);
        }
      },
    );
  }

  // ========== LOADING SCREEN ==========
  function initLoader() {
    setTimeout(() => {
      const loader =
        document.getElementById(
          "loader",
        );

      if (loader) {
        loader.classList.add(
          "hidden",
        );

        setTimeout(() => {
          if (loader.parentNode) {
            loader.parentNode.removeChild(
              loader,
            );
          }
        }, 500);
      }
    }, 1200);
  }

  // ========== INITIALIZE EVERYTHING ==========
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      initLoader();
      initTyping();
      initActiveNav();
      initSmoothScroll();
      initSlideAnimations();
      initScrollProgress();
      initContactForm();
    },
  );
})();
