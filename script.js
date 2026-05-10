// ========== WEB CONNECTING EFFECT (Network of dots & lines) ==========
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

    // Draw lines
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.35;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Draw dots
    for (let i = 0; i < points.length; i++) {
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, points[i].radius + 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, 0.12)`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, points[i].radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, 0.55)`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, points[i].radius / 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(96, 165, 250, 0.85)`;
      ctx.fill();
    }

    updatePoints();
    requestAnimationFrame(draw);
  }

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }
  function onMouseLeave() {
    mouseX = null;
    mouseY = null;
  }
  function onTouchMove(e) {
    if (e.touches[0]) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
    }
  }
  function onTouchEnd() {
    mouseX = null;
    mouseY = null;
  }

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseleave", onMouseLeave);
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd);

  resizeCanvas();
  draw();

  console.log("🌐 Web connecting effect initialized!");
})();

// ========== REST OF YOUR ORIGINAL CODE CONTINUES BELOW ==========
(function () {
  "use strict";

  // ========== CONFIGURATION ==========
  const CONFIG = {
    cvFileName: "Madhan_Resume.pdf",
    cvFallbackText: `Madhan Kumar - Computer Science Engineer

📧 Contact: madhankumar8874@gmail.com
📱 Phone: +91 9344290363
📍 Location: Tirunelveli, Tamil Nadu, India

🎓 EDUCATION:
• Bachelor of Engineering - Computer Science (2023 - Present)
  Einstein College of Engineering, Tirunelveli
• Higher Secondary (HSC) - 2021-2023
  Schaffter Higher Secondary School, Tirunelveli

💼 INTERNSHIP:
• IBM Cognos Analytics Intern (2026)
  - Reporting, Dashboard Creation, Story Making, Data Visualization

🛠️ TECHNICAL SKILLS:
• Languages: Java, Python, C, JavaScript, HTML, CSS
• Databases: MySQL, MongoDB
• Tools: Git, IBM Cognos Analytics

🚀 PROJECTS:
• Portfolio Website - Modern Responsive Portfolio
• Retail FreshMart - Retail Management System
• Blog Site with Comments - Blogging Platform
• Control LED's - IoT Arduino Project

🔗 GitHub: https://github.com/Madhan-03
🔗 LinkedIn: https://www.linkedin.com/in/madhan-kumar-128644362/`,

    googleDriveFileId: "16iXyz1tS1SQ5pK-QwsnLQsDvRzFuGrXI",
    githubRawUrl:
      "https://raw.githubusercontent.com/Madhan-03/portfolio/main/Madhan_Resume.pdf",
    enableAnalytics: false,
    analyticsEndpoint: "https://your-api.com/api/track",
    features: {
      liveDateTime: true,
      visitorCounter: true,
      scrollProgress: true,
      networkStatus: true,
    },
  };

  // ========== TYPING ANIMATION ==========
  const typedTextSpan = document.querySelector(".typed-text");
  const roles = ["Software Developer", "Problem Solver", "Quick Learner"];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;
  let erasingDelay = 60;
  let newRoleDelay = 2000;

  function typeEffect() {
    if (!typedTextSpan) return;
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeEffect, 500);
        return;
      }
      setTimeout(typeEffect, erasingDelay);
    } else {
      typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeEffect, newRoleDelay);
        return;
      }
      setTimeout(typeEffect, typingDelay);
    }
  }

  // ========== SCROLL ANIMATION ==========
  const sections = document.querySelectorAll("section");

  function checkVisibility() {
    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (sectionTop < windowHeight - 100) {
        section.classList.add("visible");
      }
    });
  }

  // ========== MOBILE MENU - DROPDOWN STYLE ==========
  function initMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (!menuToggle || !navLinks) {
      console.log("Menu elements not found!");
      return;
    }

    function closeMenu() {
      navLinks.classList.remove("active");
    }

    function openMenu() {
      if (window.innerWidth <= 768) {
        navLinks.classList.add("active");
      }
    }

    menuToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (navLinks.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    const navAnchors = navLinks.querySelectorAll(".nav-link");
    navAnchors.forEach(function (anchor) {
      anchor.addEventListener("click", function () {
        closeMenu();
      });
    });

    document.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
          closeMenu();
        }
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }

  // ========== ACTIVE NAVIGATION ==========
  function updateActiveNav() {
    let current = "";
    const scrollPos = window.scrollY + 150;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.clientHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute("id");
      }
    });
    const navLinkItems = document.querySelectorAll(".nav-link");
    navLinkItems.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
    });
  }

  // ========== CV DOWNLOAD ==========
  function initDownloadResume() {
    const downloadBtn = document.getElementById("downloadResumeBtn");
    if (!downloadBtn) return;

    downloadBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const originalText = downloadBtn.innerHTML;
      downloadBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Preparing CV...';
      downloadBtn.style.opacity = "0.7";

      try {
        const link = document.createElement("a");
        link.href = CONFIG.githubRawUrl;
        link.download = "Madhan_Resume.pdf";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showMessage("✓ CV download started!", "#4ade80");
      } catch (error) {
        showMessage("❌ Download failed. Please email me.", "#f87171");
      } finally {
        downloadBtn.innerHTML = originalText;
        downloadBtn.style.opacity = "1";
      }

      function showMessage(msg, color) {
        const msgDiv = document.createElement("div");
        msgDiv.innerText = msg;
        msgDiv.style.color = color;
        msgDiv.style.marginTop = "0.6rem";
        msgDiv.style.fontSize = "0.9rem";
        msgDiv.style.textAlign = "center";
        downloadBtn.parentNode.appendChild(msgDiv);
        setTimeout(() => msgDiv.remove(), 3000);
      }
    });
  }

  // ========== LIVE DATE & TIME ==========
  function initLiveDateTime() {
    if (!CONFIG.features.liveDateTime) return;

    let timeWidget = document.querySelector(".live-time-widget");
    if (!timeWidget) {
      timeWidget = document.createElement("div");
      timeWidget.className = "live-time-widget";
      timeWidget.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(2, 6, 23, 0.9);
      backdrop-filter: blur(10px);
      padding: 8px 15px;
      border-radius: 50px;
      border: 1px solid #3b82f6;
      color: #60a5fa;
      font-size: 0.85rem;
      font-weight: 500;
      z-index: 999;
      font-family: monospace;
      cursor: pointer;
      transition: all 0.3s ease;
    `;
      document.body.appendChild(timeWidget);
    }

    function updateTime() {
      const now = new Date();
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      const time = now.toLocaleString("en-IN", options);
      timeWidget.innerHTML = `🕐 ${time} IST`;
    }

    updateTime();
    setInterval(updateTime, 1000);
  }

  // ========== VISITOR COUNTER ==========
  function initVisitorCounter() {
    if (!CONFIG.features.visitorCounter) return;

    let counterElement = document.querySelector(".visitor-counter");
    if (!counterElement) {
      counterElement = document.createElement("div");
      counterElement.className = "visitor-counter";
      counterElement.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(2, 6, 23, 0.9);
      backdrop-filter: blur(10px);
      padding: 8px 15px;
      border-radius: 50px;
      border: 1px solid #3b82f6;
      color: #60a5fa;
      font-size: 0.85rem;
      font-weight: 500;
      z-index: 999;
      font-family: monospace;
      cursor: pointer;
      transition: all 0.3s ease;
    `;
      document.body.appendChild(counterElement);
    }

    let visitorCount = localStorage.getItem("totalVisitors") || 0;
    const lastVisit = localStorage.getItem("lastVisitDate");
    const today = new Date().toDateString();

    if (lastVisit !== today) {
      visitorCount = parseInt(visitorCount) + 1;
      localStorage.setItem("totalVisitors", visitorCount);
      localStorage.setItem("lastVisitDate", today);
    }

    counterElement.innerHTML = `👥 Total Visitors: ${visitorCount}`;

    counterElement.onmouseenter = () => {
      counterElement.style.transform = "scale(1.05)";
      counterElement.style.borderColor = "#60a5fa";
      counterElement.style.boxShadow = "0 0 15px rgba(59, 130, 246, 0.5)";
    };
    counterElement.onmouseleave = () => {
      counterElement.style.transform = "scale(1)";
      counterElement.style.borderColor = "#3b82f6";
      counterElement.style.boxShadow = "none";
    };
  }

  // ========== SCROLL PROGRESS ==========
  function initScrollProgress() {
    if (!CONFIG.features.scrollProgress) return;

    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6, #3b82f6, #3b82f6);
      z-index: 10000;
      transition: width 0.1s;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener("scroll", () => {
      const windowHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      progressBar.style.width = scrolled + "%";
    });
  }

  // ========== NETWORK STATUS ==========
  function initNetworkStatus() {
    if (!CONFIG.features.networkStatus) return;

    const statusIndicator = document.createElement("div");
    statusIndicator.className = "network-status";
    statusIndicator.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: rgba(26, 10, 46, 0.9);
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      z-index: 999;
      border: 1px solid #3b82f6;
      font-family: monospace;
    `;
    document.body.appendChild(statusIndicator);

    function updateStatus() {
      if (navigator.onLine) {
        statusIndicator.innerHTML = "🟢 Online";
        statusIndicator.style.color = "#4ade80";
        statusIndicator.style.borderColor = "#4ade80";
      } else {
        statusIndicator.innerHTML = "🔴 Offline Mode";
        statusIndicator.style.color = "#f87171";
        statusIndicator.style.borderColor = "#f87171";
      }
    }

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    updateStatus();
  }

  // ========== CONTACT FORM WITH EMAILJS ==========
  const EMAILJS_PUBLIC_KEY = "Lcl5_FPpIUEWr6joN";
  const EMAILJS_SERVICE_ID = "service_1020nur";
  const EMAILJS_TEMPLATE_ID = "template_ffz5yvq";

  function initContactForm() {
    const contactForm = document.getElementById("contactForm");
    const feedbackDiv = document.getElementById("formFeedback");

    if (!contactForm) return;

    if (typeof emailjs !== "undefined") {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name")?.value.trim() || "";
      const email = document.getElementById("email")?.value.trim() || "";
      const message = document.getElementById("message")?.value.trim() || "";

      if (!name || !email || !message) {
        feedbackDiv.innerHTML =
          '<span style="color:#f87171;">⚠️ Please fill all fields.</span>';
        setTimeout(() => (feedbackDiv.innerHTML = ""), 3000);
        return;
      }

      if (!email.includes("@") || !email.includes(".")) {
        feedbackDiv.innerHTML =
          '<span style="color:#f87171;">📧 Enter valid email address.</span>';
        setTimeout(() => (feedbackDiv.innerHTML = ""), 3000);
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      try {
        const templateParams = {
          from_name: name,
          from_email: email,
          message: message,
          to_email: "madhankumar8874@gmail.com",
          reply_to: email,
          date: new Date().toLocaleString(),
        };

        const response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams,
        );

        if (response.status === 200) {
          feedbackDiv.innerHTML =
            '<span style="color:#4ade80;">✨ Message sent successfully! I\'ll reply within 24 hours.</span>';
          contactForm.reset();
        }
      } catch (error) {
        console.error("Email error:", error);
        feedbackDiv.innerHTML =
          '<span style="color:#f87171;">❌ Failed to send. Please email directly: madhankumar8874@gmail.com</span>';
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        setTimeout(() => (feedbackDiv.innerHTML = ""), 5000);
      }
    });
  }

  // ========== SMOOTH SCROLL ==========
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (targetId === "#" || targetId === "") return;
        const targetElem = document.querySelector(targetId);
        if (targetElem) {
          e.preventDefault();
          targetElem.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  // ========== BUTTON RIPPLE EFFECT ==========
  function initRippleEffect() {
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach((button) => {
      button.addEventListener("click", function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        this.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }

  // ========== INITIALIZE EVERYTHING ==========
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(typeEffect, 500);
    initMobileMenu();
    initDownloadResume();
    initContactForm();
    initSmoothScroll();
    initLiveDateTime();
    initVisitorCounter();
    initScrollProgress();
    initNetworkStatus();
    initRippleEffect();
    checkVisibility();
    updateActiveNav();

    console.log(
      "%c🚀 Portfolio Deployed Successfully!",
      "color: #3b82f6; font-size: 16px; font-weight: bold;",
    );
    console.log(
      "%c📱 Fully Responsive on Laptop & Mobile",
      "color: #3b82f6; font-size: 12px;",
    );
    console.log(
      "%c🌐 Web Connecting Effect Active!",
      "color: #60a5fa; font-size: 12px;",
    );
  });

  window.addEventListener("scroll", () => {
    checkVisibility();
    updateActiveNav();
  });

  window.addEventListener("load", checkVisibility);
})();
