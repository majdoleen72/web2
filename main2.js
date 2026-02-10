(() => {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  if (saved) root.setAttribute("data-theme", saved);

  btn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
})()
// Header scroll effect
document.addEventListener('DOMContentLoaded', function() {
  const header = document.getElementById('header');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  
  // Check for saved theme or default to dark
  const savedTheme = localStorage.getItem('nutrinest-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeIcon.className = 'fas fa-sun';
  }
  
  themeToggle.addEventListener('click', function() {
    const isLightTheme = document.body.classList.toggle('light-theme');
    
    if (isLightTheme) {
      themeIcon.className = 'fas fa-sun';
      localStorage.setItem('nutrinest-theme', 'light');
    } else {
      themeIcon.className = 'fas fa-moon';
      localStorage.setItem('nutrinest-theme', 'dark');
    }
  });

  // Interactive floating elements
  document.addEventListener('mousemove', (e) => {
    const elements = document.querySelectorAll('.floating-element');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    elements.forEach((el, index) => {
      const speed = 0.5 + index * 0.2;
      const xMove = x * 50 * speed;
      const yMove = y * 50 * speed;
      
      el.style.transform = `translate(${xMove}px, ${yMove}px)`;
    });
  });

  // Animate stats on scroll
  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach((stat) => {
          const originalText = stat.textContent;
          const target = parseInt(originalText);
          
          // Only animate if it's a number
          if (!isNaN(target)) {
            let current = 0;
            const increment = target / 30;
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              stat.textContent = Math.floor(current) + (originalText.includes('+') ? '+' : '');
            }, 50);
          }
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const statsSection = document.querySelector('.hero-left');
  if (statsSection) {
    observer.observe(statsSection);
  }
  
  // Add smooth scroll to anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});