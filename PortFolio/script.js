// COMPLETE PORTFOLIO JAVASCRIPT - FULLY RESPONSIVE FIXED

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
      "https://raw.githubusercontent.com/Madhan-03/portfolio/main/PortFolio/Madhan_Resume.pdf",
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
  const roles = ["Software Developer", "Problem Solver"];
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

  // ========== MOBILE MENU - DROPDOWN STYLE (Opens Below Hamburger) ==========
  function initMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (!menuToggle) {
      console.log("Menu toggle button not found!");
      return;
    }

    if (!navLinks) {
      console.log("Nav links not found!");
      return;
    }

    console.log("Mobile menu initialized - Dropdown style");

    // Function to open menu
    function openMenu() {
      if (window.innerWidth > 768) return;
      navLinks.classList.add("active");
      console.log("Menu opened - dropdown visible");
    }

    // Function to close menu
    function closeMenu() {
      navLinks.classList.remove("active");
      console.log("Menu closed");
    }

    // Toggle menu on hamburger click
    menuToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (navLinks.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu when clicking on any nav link
    const navAnchors = navLinks.querySelectorAll(".nav-link");
    navAnchors.forEach(function (anchor) {
      anchor.addEventListener("click", function () {
        if (window.innerWidth <= 768) {
          closeMenu();
        }
      });
    });

    // Close menu when clicking outside (optional)
    document.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
          closeMenu();
        }
      }
    });

    // Handle window resize
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        // Desktop view - ensure menu is closed
        closeMenu();
        // Reset any inline styles
        navLinks.style.cssText = "";
      } else {
        // Mobile view - ensure menu starts closed
        if (navLinks.classList.contains("active")) {
          closeMenu();
        }
      }
    });

    // Initial check - menu starts closed on mobile
    if (window.innerWidth <= 768) {
      closeMenu();
    }

    console.log("Mobile menu ready - click hamburger to open dropdown");
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

  // ========== UNIVERSAL CV DOWNLOAD (Works on Same Server & Any Device) ==========
  function initDownloadResume() {
    const downloadBtn = document.getElementById("downloadResumeBtn");
    if (!downloadBtn) return;

    // Remove existing listeners to avoid duplicates
    const newBtn = downloadBtn.cloneNode(true);
    downloadBtn.parentNode.replaceChild(newBtn, downloadBtn);
    const finalBtn = newBtn;

    finalBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      // Show loading state
      const originalText = finalBtn.innerHTML;
      finalBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Preparing CV...';
      finalBtn.style.opacity = "0.7";
      finalBtn.style.cursor = "wait";

      try {
        let downloadSuccess = false;

        // STRATEGY 1: Try local file first (Same Server)
        downloadSuccess = await tryLocalFileDownload();

        // STRATEGY 2: Try Google Drive backup (if configured)
        if (
          !downloadSuccess &&
          CONFIG.googleDriveFileId &&
          CONFIG.googleDriveFileId !== "null"
        ) {
          downloadSuccess = await tryGoogleDriveDownload();
        }

        // STRATEGY 3: Try GitHub raw URL backup (if configured)
        if (
          !downloadSuccess &&
          CONFIG.githubRawUrl &&
          CONFIG.githubRawUrl !== "null"
        ) {
          downloadSuccess = await tryGitHubDownload();
        }

        // STRATEGY 4: Generate dynamic CV as last resort
        if (!downloadSuccess) {
          generateDynamicCV();
          showMessage(
            "✓ CV generated! Please save it. For best experience, upload CV file to server.",
            "#60a5fa",
          );
        }
      } catch (error) {
        console.error("Download error:", error);
        showMessage(
          "❌ Download failed. Please email me at madhankumar8874@gmail.com",
          "#f87171",
        );
        generateDynamicCV();
      } finally {
        // Reset button
        finalBtn.innerHTML = originalText;
        finalBtn.style.opacity = "1";
        finalBtn.style.cursor = "pointer";
      }

      // Helper: Try local file download (Same Server)
      async function tryLocalFileDownload() {
        const cvFiles = [
          CONFIG.cvFileName,
          "Madhan_Kumar_Resume.pdf",
          "resume.pdf",
          "cv.pdf",
          "Madhan_Resume.pdf",
          "MadhanKumar.pdf",
          "Madhan_CV.pdf",
          "docs/cv.pdf",
          "assets/cv.pdf",
          "files/cv.pdf",
        ];

        for (const file of cvFiles) {
          try {
            const response = await fetch(file, {
              method: "HEAD",
              cache: "no-cache",
            });
            if (response.ok) {
              // Create a temporary anchor element
              const link = document.createElement("a");
              link.href = file;
              link.download = "Madhan_Resume.pdf";
              link.target = "_blank";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              showMessage("✓ CV download started from server!", "#4ade80");
              return true;
            }
          } catch (err) {
            continue;
          }
        }
        return false;
      }

      // Helper: Try Google Drive download
      async function tryGoogleDriveDownload() {
        try {
          const downloadUrl = `https://drive.google.com/uc?export=download&id=${CONFIG.googleDriveFileId}`;
          // Create a temporary anchor element
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = "Madhan_Resume.pdf";
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showMessage("✓ Downloading from Google Drive...", "#4ade80");
          return true;
        } catch (error) {
          return false;
        }
      }

      // Helper: Try GitHub download
      async function tryGitHubDownload() {
        try {
          // Create a temporary anchor element
          const link = document.createElement("a");
          link.href = CONFIG.githubRawUrl;
          link.download = "Madhan_Resume.pdf";
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showMessage("✓ Downloading from GitHub...", "#4ade80");
          return true;
        } catch (error) {
          return false;
        }
      }

      // Helper: Generate dynamic CV
      function generateDynamicCV() {
        const cvContent = CONFIG.cvFallbackText;
        const blob = new Blob([cvContent], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Madhan_Resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      // Helper: Show message
      function showMessage(msg, color) {
        // Remove any existing message
        const existingMsg =
          finalBtn.parentNode.querySelector(".download-message");
        if (existingMsg) existingMsg.remove();

        const messageDiv = document.createElement("div");
        messageDiv.className = "download-message";
        messageDiv.innerText = msg;
        messageDiv.style.color = color;
        messageDiv.style.marginTop = "0.6rem";
        messageDiv.style.fontSize = "0.9rem";
        messageDiv.style.textAlign = "center";
        messageDiv.style.padding = "8px";
        messageDiv.style.borderRadius = "8px";
        messageDiv.style.background = "rgba(0,0,0,0.5)";
        finalBtn.parentNode.appendChild(messageDiv);
        setTimeout(() => messageDiv.remove(), 5000);
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
                background: rgba(10, 20, 40, 0.9);
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
            background: rgba(10, 20, 40, 0.9);
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
        `;
      document.body.appendChild(counterElement);
    }

    // 🔄 RESET COUNTER TO ZERO - REMOVE THIS BLOCK AFTER FIRST DEPLOYMENT IF YOU WANT NORMAL COUNTING
    // This forces reset to 0 every time page loads
    localStorage.setItem("totalVisitors", "0");
    localStorage.removeItem("lastVisitDate");

    let visitorCount = 0;
    const lastVisit = localStorage.getItem("lastVisitDate");
    const today = new Date().toDateString();

    if (lastVisit !== today) {
      visitorCount = parseInt(visitorCount) + 1;
      localStorage.setItem("totalVisitors", visitorCount);
      localStorage.setItem("lastVisitDate", today);
    }

    counterElement.innerHTML = `👥 Total Visitors: ${visitorCount}`;
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
            background: linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6);
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
            background: rgba(10, 20, 40, 0.9);
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
  // ⭐⭐⭐ YOUR EMAILJS CREDENTIALS (Already Added) ⭐⭐⭐
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
    checkVisibility();
    updateActiveNav();

    console.log(
      "%c🚀 Portfolio Deployed Successfully!",
      "color: #60a5fa; font-size: 16px; font-weight: bold;",
    );
    console.log(
      "%c📱 Fully Responsive on Laptop & Mobile",
      "color: #4ade80; font-size: 12px;",
    );
    console.log(
      "%c💾 CV Download: Multi-strategy enabled (Server + Cloud)",
      "color: #fbbf24; font-size: 12px;",
    );
  });

  window.addEventListener("scroll", () => {
    checkVisibility();
    updateActiveNav();
  });

  window.addEventListener("load", checkVisibility);
})();
