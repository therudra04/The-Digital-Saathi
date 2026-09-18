(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('ds-theme');
  if (saved) root.setAttribute('data-theme', saved);
  const updateThemeIcon = () => {
    if (!toggle) return;
    const dark = root.getAttribute('data-theme') === 'dark';
    toggle.innerHTML = dark ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
    toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.setAttribute('title', dark ? 'Switch to light mode' : 'Switch to dark mode');
  };
  updateThemeIcon();
  toggle?.addEventListener('click', () => {
    const dark = root.getAttribute('data-theme') !== 'dark';
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('ds-theme', dark ? 'dark' : 'light');
    updateThemeIcon();
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const back = document.getElementById('backToTop');
  if (back) {
    window.addEventListener('scroll', () => back.classList.toggle('show', window.scrollY > 600), { passive: true });
    back.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  }

  document.querySelectorAll('#mainNav .nav-link, #mainNav .dropdown-item').forEach(link => link.addEventListener('click', () => {
    const nav = document.getElementById('mainNav');
    if (nav?.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(nav).hide();
  }));
})();

document.querySelectorAll(".dropdown-menu .dropdown-item").forEach((link) => {
    if (link.href === window.location.href) {
        link.classList.add("active");
    }
});