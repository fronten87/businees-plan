/* Web-in Aja! — interaksi website */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeButton = document.querySelector(".theme-toggle");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const progress = document.querySelector(".scroll-progress");

  // Ikon Lucide
  if (window.lucide) window.lucide.createIcons();

  // Mode gelap/terang: pilihan disimpan selama tab/browser digunakan.
  const savedTheme = localStorage.getItem("webinaja-theme");
  if (savedTheme === "dark") root.dataset.theme = "dark";
  updateThemeIcon();

  function updateThemeIcon() {
    if (!themeButton) return;
    const dark = root.dataset.theme === "dark";
    themeButton.innerHTML = dark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
    themeButton.setAttribute("aria-label", dark ? "Aktifkan mode terang" : "Aktifkan mode gelap");
    themeButton.title = dark ? "Mode terang" : "Mode gelap";
    if (window.lucide) window.lucide.createIcons();
  }

  themeButton?.addEventListener("click", () => {
    const dark = root.dataset.theme !== "dark";
    if (dark) {
      root.dataset.theme = "dark";
      localStorage.setItem("webinaja-theme", "dark");
    } else {
      delete root.dataset.theme;
      localStorage.setItem("webinaja-theme", "light");
    }
    updateThemeIcon();
  });

  // Menu hamburger untuk perangkat seluler.
  menuButton?.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(opened));
    menuButton.innerHTML = opened ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    if (window.lucide) window.lucide.createIcons();
  });
  nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    if (menuButton) menuButton.innerHTML = '<i data-lucide="menu"></i>';
    if (window.lucide) window.lucide.createIcons();
  }));

  // Animasi masuk saat elemen mulai terlihat di layar.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add("visible"));

  // Progress bar dan nav aktif berdasarkan bagian yang sedang dibaca.
  const sections = [...document.querySelectorAll("main section[id]")];
  function onScroll() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
    let current = "beranda";
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 150) current = section.id;
    });
    document.querySelectorAll(".nav-link").forEach(link => {
      const target = link.getAttribute("href")?.slice(1);
      link.classList.toggle("active", target === current || (current === "marketing" && target === "pasar"));
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
