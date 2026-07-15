(function () {
  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-action="toggle-theme"]');
  const storedTheme = localStorage.getItem('fairlend-report-theme');
  const preferredTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.dataset.theme = storedTheme || preferredTheme;

  function syncThemeLabel() {
    if (!themeToggle) return;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    themeToggle.textContent = next === 'dark' ? 'Dark mode' : 'Light mode';
    themeToggle.setAttribute('aria-label', `Switch to ${next} theme`);
  }

  themeToggle?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('fairlend-report-theme', root.dataset.theme);
    syncThemeLabel();
  });
  syncThemeLabel();

  const toc = document.getElementById('report-toc');
  const tocLinks = Array.from(toc?.querySelectorAll('a[href^="#"]') || []);
  const observedSections = tocLinks
    .map((link) => {
      const id = link.getAttribute('href')?.slice(1);
      return id ? { link, element: document.getElementById(id) } : null;
    })
    .filter((item) => item?.element);

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      tocLinks.forEach((link) => link.classList.remove('active'));
      const match = observedSections.find((item) => item.element === visible.target);
      match?.link.classList.add('active');
      if (innerWidth <= 1120) {
        match?.link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    },
    { rootMargin: '-12% 0px -76% 0px' },
  );

  observedSections.forEach(({ element }) => sectionObserver.observe(element));

  tocLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href')?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      event.preventDefault();
      if (target.matches('details.segment-card')) target.open = true;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    });
  });

  const segmentCards = Array.from(document.querySelectorAll('details.segment-card'));
  const searchInput = document.getElementById('segment-search');
  const visibleCount = document.getElementById('segment-visible-count');
  const familyButtons = Array.from(document.querySelectorAll('[data-family-filter]'));
  let activeFamily = 'all';

  function applySegmentFilters() {
    const query = (searchInput?.value || '').trim().toLowerCase();
    let count = 0;

    segmentCards.forEach((card) => {
      const familyMatch = activeFamily === 'all' || card.dataset.family === activeFamily;
      const queryMatch = !query || card.textContent.toLowerCase().includes(query);
      const isVisible = familyMatch && queryMatch;
      card.hidden = !isVisible;
      if (isVisible) {
        count += 1;
        if (query) card.open = true;
      }
    });

    if (visibleCount) visibleCount.textContent = `${count}/18`;
  }

  searchInput?.addEventListener('input', applySegmentFilters);

  familyButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFamily = button.dataset.familyFilter || 'all';
      familyButtons.forEach((candidate) => {
        candidate.setAttribute('aria-pressed', String(candidate === button));
      });
      applySegmentFilters();
    });
  });

  document.querySelector('[data-action="open-segments"]')?.addEventListener('click', () => {
    segmentCards.filter((card) => !card.hidden).forEach((card) => { card.open = true; });
  });

  document.querySelector('[data-action="close-segments"]')?.addEventListener('click', () => {
    segmentCards.filter((card) => !card.hidden).forEach((card) => { card.open = false; });
  });

  document.querySelector('[data-action="print-report"]')?.addEventListener('click', () => {
    segmentCards.forEach((card) => { card.open = true; });
    requestAnimationFrame(() => print());
  });

  const initialHash = decodeURIComponent(location.hash.slice(1));
  if (initialHash) {
    const target = document.getElementById(initialHash);
    if (target?.matches('details.segment-card')) target.open = true;
  }

  document.querySelectorAll('.segment-body h3').forEach((heading) => {
    const match = heading.textContent.trim().match(/^(\d+)\./);
    if (match) heading.dataset.step = match[1].padStart(2, '0');
  });

  applySegmentFilters();
})();
