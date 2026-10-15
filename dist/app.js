const byId = (id) => document.getElementById(id);
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};
const safeURL = (value) => {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value, location.href);
    if (['https:', 'http:'].includes(url.protocol)) return url.href;
    // The self-contained preview can link to its adjacent CV and local assets.
    const relative = !/^(?:[a-z][a-z0-9+.-]*:|[\\/])/i.test(value);
    if (location.protocol === 'file:' && url.protocol === 'file:' && relative) return url.href;
    return null;
  } catch { return null; }
};
const assetURL = (value) => {
  if (typeof value === 'string' && /^data:image\/(?:png|jpeg|webp|gif);base64,[A-Za-z0-9+/]+=*$/.test(value)) return value;
  return safeURL(value);
};
const externalLink = (title, href) => {
  const url = safeURL(href);
  if (!url) return null;
  const link = el('a', 'text-link', title + ' ↗');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
};

let projects = [];
let artwork = [];
let projectLayout = 'gallery';
let artworkFilter = 'all';
let lastTrigger = null;
let projectReturnHash = '#proyectos';
const dialog = byId('project-dialog');
let detailSections = [];
let detailReadingFrame = null;
let detailLayoutObserver = null;
const motionStopped = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('motion-paused');

function enterContent(node) {
  node.classList.remove('is-content-entering');
  if (!motionStopped()) requestAnimationFrame(() => node.classList.add('is-content-entering'));
}
function syncDetailLayout() {
  if (!dialog.open) return;
  const toolbarHeight = dialog.querySelector('.dialog-toolbar').getBoundingClientRect().height;
  const navigationHeight = byId('project-detail').querySelector('.detail-navigation')?.getBoundingClientRect().height || 0;
  dialog.style.setProperty('--dialog-toolbar-height', toolbarHeight + 'px');
  dialog.style.setProperty('--detail-anchor-offset', (toolbarHeight + navigationHeight + 22) + 'px');
}

function markDetailSection(button) {
  const changed = !button.hasAttribute('aria-current');
  detailSections.forEach((item) => {
    if (item.button === button) item.button.setAttribute('aria-current', 'location');
    else item.button.removeAttribute('aria-current');
  });
  const navigation = button.parentElement;
  if (changed && navigation.scrollWidth > navigation.clientWidth) {
    navigation.scrollTo({left: Math.max(0, button.offsetLeft - (navigation.clientWidth - button.offsetWidth) / 2), behavior: motionStopped() ? 'instant' : 'smooth'});
  }
}
function updateDetailSection() {
  detailReadingFrame = null;
  if (!dialog.open || !detailSections.length) return;
  const navigation = byId('project-detail').querySelector('.detail-navigation');
  const edge = navigation.getBoundingClientRect().bottom + 36;
  let current = detailSections[0];
  detailSections.forEach((item) => { if (item.section.getBoundingClientRect().top <= edge) current = item; });
  markDetailSection(current.button);
}
dialog.addEventListener('scroll', () => {
  if (!detailReadingFrame) detailReadingFrame = requestAnimationFrame(updateDetailSection);
}, {passive: true});
function addDetailJump(navigation, section, label) {
  const button = el('button', null, label);
  button.type = 'button';
  button.addEventListener('click', () => {
    section.scrollIntoView({block: 'start', behavior: motionStopped() ? 'instant' : 'smooth'});
    section.tabIndex = -1; section.focus({preventScroll: true});
    markDetailSection(button);
  });
  detailSections.push({button, section});
  navigation.append(button);
}

function conceptGraphic(index) {
  const graphics = [
    `<svg viewBox="0 0 600 370" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><rect x="80" y="64" width="220" height="258" rx="8"/><rect x="188" y="96" width="220" height="258" rx="8"/><rect x="296" y="40" width="220" height="258" rx="8"/><path d="M320 95h170M320 112h114M320 258h170"/></g><text x="318" y="228" fill="currentColor" font-family="sans-serif" font-size="100" font-weight="700">05</text><text x="320" y="280" fill="currentColor" font-family="sans-serif" font-size="14" letter-spacing="3">MISIONES</text><circle cx="125" cy="104" r="8" fill="currentColor"/></svg>`,
    `<svg viewBox="0 0 600 370" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="300" cy="185" r="132"/><circle cx="300" cy="185" r="94"/><path d="M80 185h440M300 36v298M155 95l290 180M155 275l290-180"/></g><g fill="currentColor"><circle cx="80" cy="185" r="9"/><circle cx="520" cy="185" r="9"/><circle cx="300" cy="53" r="9"/><circle cx="300" cy="317" r="9"/></g><rect x="211" y="147" width="178" height="76" fill="var(--visual-bg, #e5ebdf)"/><text x="300" y="191" text-anchor="middle" fill="currentColor" font-family="sans-serif" font-size="25" font-weight="700" letter-spacing="2">OPERACIÓN</text></svg>`,
    `<svg viewBox="0 0 600 370" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-opacity=".3" stroke-width="1.5"><rect x="34" y="35" width="532" height="300" rx="2"/><path d="M300 35v300M34 105h90v160H34M566 105h-90v160h90"/><circle cx="300" cy="185" r="65"/></g><text x="58" y="277" fill="currentColor" font-family="sans-serif" font-size="242" font-weight="800" letter-spacing="-18">26</text><g fill="none" stroke="currentColor" stroke-width="2"><circle cx="476" cy="128" r="57"/><path d="M476 104l24 18-9 28h-30l-9-28zM476 104v-33M500 122l31-10M491 150l19 24M461 150l-19 24M452 122l-31-10"/></g><text x="400" y="248" fill="currentColor" font-family="sans-serif" font-size="18" font-weight="700" letter-spacing="3">MUNDIAL</text><text x="400" y="275" fill="currentColor" font-family="sans-serif" font-size="12" letter-spacing="2">OPERACIÓN</text></svg>`,
    `<svg viewBox="0 0 600 370" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><rect x="30" y="54" width="146" height="64" rx="5"/><rect x="30" y="153" width="146" height="64" rx="5"/><rect x="30" y="252" width="146" height="64" rx="5"/><rect x="257" y="132" width="134" height="106" rx="7"/><rect x="445" y="132" width="130" height="106" rx="7"/><path d="M176 86h37q16 0 16 16v167q0 15-16 15h-37M176 185h81M391 185h54M245 178l12 7-12 7M433 178l12 7-12 7M467 193h86M467 207h58"/></g><g fill="currentColor" font-family="sans-serif" text-anchor="middle"><text x="103" y="92" font-size="17" letter-spacing="1">NACIONAL</text><text x="103" y="191" font-size="17" letter-spacing="1">AMAZON</text><text x="103" y="290" font-size="12" letter-spacing=".5">MERCADO LIBRE</text><text x="324" y="196" font-size="32" font-weight="700" letter-spacing="2">JALO</text><text x="510" y="175" font-size="16" font-weight="700" letter-spacing="1">MEDICIÓN</text></g><circle cx="229" cy="185" r="4" fill="currentColor"/></svg>`,
    `<svg viewBox="0 0 600 370" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><rect x="36" y="118" width="145" height="135" rx="7"/><rect x="225" y="93" width="150" height="185" rx="7"/><rect x="419" y="118" width="145" height="135" rx="7"/><path d="M181 185h44M375 185h44M213 178l12 7-12 7M407 178l12 7-12 7M254 140h92M254 158h69M254 221h92"/></g><g fill="currentColor" font-family="sans-serif" font-size="16" font-weight="700"><text x="108" y="192" text-anchor="middle">NOTAS</text><text x="300" y="197" text-anchor="middle">AGENTE</text><text x="492" y="192" text-anchor="middle">SEGUIMIENTO</text></g></svg>`,
  ];
  return graphics[index % graphics.length];
}

function renderProjects() {
  const list = byId('project-list');
  list.replaceChildren();
  projects.forEach((project, index) => {
    const card = el('article', `project-card project-card--${index + 1} project-card--${project.slug}`);
    const visual = el('div', `project-visual project-visual--${project.slug}`);
    const cover = assetURL(project.cover?.src) ? project.cover : project.media?.find((item) => assetURL(item.src));
    if (cover) {
      visual.classList.add('public-cover');
      if (cover.layout === 'campaign') visual.classList.add('public-cover--campaign');
      const backdrop = assetURL(cover.background);
      if (backdrop) visual.style.backgroundImage = `url("${backdrop}")`;
      const lockup = el('div', 'cover-lockup');
      const img = el('img');
      img.className = 'cover-primary';
      img.src = assetURL(cover.src);
      img.alt = cover.alt || project.title;
      img.loading = 'lazy';
      const fallback = () => {
        visual.style.backgroundImage = '';
        visual.classList.remove('public-cover');
        visual.innerHTML = conceptGraphic(index);
        visual.append(el('span', 'visual-caption', 'Esquema del proyecto'));
      };
      img.addEventListener('error', fallback, { once: true });
      lockup.append(img);
      const secondary = assetURL(cover.secondarySrc);
      if (secondary) {
        const image = el('img', 'cover-secondary');
        image.src = secondary;
        image.alt = cover.secondaryAlt || project.title;
        image.loading = 'lazy';
        image.addEventListener('error', () => image.remove(), { once: true });
        lockup.append(image);
      }
      visual.append(lockup, el('span', 'visual-caption', 'Fuente pública de campaña'));
    } else {
      // These original vector diagrams explain scope; they are not campaign pieces.
      visual.innerHTML = conceptGraphic(index);
      visual.append(el('span', 'visual-caption', 'Esquema del proyecto'));
    }
    const frame = el('span', 'exploration-frame');
    frame.setAttribute('aria-hidden', 'true');
    visual.append(frame);
    const meta = el('div', 'project-meta', `${String(index + 1).padStart(2, '0')} / ${project.period}`);
    const category = el('p', 'project-category', project.role);
    const title = el('h3', 'project-title', project.title);
    const summary = el('p', 'project-summary', project.summary);
    const button = el('button', 'project-open', 'Explorar caso');
    button.type = 'button';
    button.setAttribute('aria-label', `Explorar caso: ${project.title}`);
    button.append(el('span', 'project-arrow', '↗'));
    button.addEventListener('click', () => openProject(project, button));
    card.append(visual, meta, category, title, summary);
    const participation = publicResult(project);
    if (participation) card.append(participation);
    card.append(button);
    const previewButton = el('button', 'project-visual-open');
    previewButton.type = 'button';
    previewButton.setAttribute('aria-label', `Abrir imágenes y detalle: ${project.title}`);
    previewButton.addEventListener('click', () => openProject(project, previewButton));
    visual.append(previewButton);
    list.append(card);
  });
}

function publicResult(project, expanded = false) {
  const metric = project.publicResult;
  if (!metric || !Number.isSafeInteger(metric.count) || metric.count < 0 || !metric.label) return null;
  const block = el('div', 'public-participation');
  block.append(el('strong', null, new Intl.NumberFormat('es-MX').format(metric.count)), el('span', null, metric.label));
  block.append(el('p', 'metric-source', metric.period));
  if (expanded) {
    block.append(el('p', 'metric-source', metric.scope));
  }
  return block;
}

function detailSection(label, value) {
  const section = el('section', 'detail-section');
  section.append(el('h3', null, label));
  if (Array.isArray(value)) {
    const list = el('ul');
    value.forEach((item) => list.append(el('li', null, item)));
    section.append(list);
  } else section.append(el('p', null, value));
  return section;
}

function openProject(project, trigger = null, updateHash = true) {
  const changingCase = dialog.open;
  lastTrigger = trigger;
  detailSections = [];
  const detail = byId('project-detail');
  detail.replaceChildren();
  detail.append(el('p', 'detail-kicker', `${project.period} · ${project.organization} · ${project.role}`));
  const title = el('h2', 'detail-title', project.title);
  title.id = 'detail-project-title';
  dialog.setAttribute('aria-labelledby', title.id);
  const projectIndex = projects.indexOf(project);
  byId('dialog-kind').textContent = `${String(projectIndex + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')} · Proyecto seleccionado`;
  detail.append(title, el('p', 'detail-summary', project.subtitle));
  const participation = publicResult(project, true);
  if (participation) detail.append(participation);
  const navigation = el('nav', 'detail-navigation');
  navigation.setAttribute('aria-label', 'Apartados del caso');
  detail.append(navigation);
  for (const [label, value] of [
    ['Contexto', project.context], ['Mi aportación', project.contribution],
    ['Decisión de trabajo', project.decision], ['Entrega', project.delivery],
  ]) if (value) {
    const section = detailSection(label, value);
    addDetailJump(navigation, section, label === 'Decisión de trabajo' ? 'Decisión' : label);
    detail.append(section);
  }

  const missions = (project.media || []).filter((media) => media.kind === 'mission' && assetURL(media.src));
  if (missions.length) {
    const section = el('section', 'detail-section mission-media-section');
    section.append(el('h3', null, 'Selección de piezas de campaña'));
    section.append(el('p', 'mission-media-credit', 'Diseño: equipo de diseño de JALO. Coordinación: Fernando Pérez.'));
    const gallery = el('div', 'mission-media-grid');
    for (const media of missions) {
      const figure = el('figure');
      const img = el('img');
      img.src = assetURL(media.src); img.alt = media.alt; img.loading = 'lazy';
      figure.append(img, el('figcaption', null, media.caption));
      gallery.append(figure);
    }
    section.append(gallery);
    const source = externalLink('Landing pública de la campaña', missions[0].sourceURL);
    if (source) section.append(source);
    addDetailJump(navigation, section, 'Piezas');
    detail.append(section);
  }
  for (const media of (project.media || []).filter((media) => media.kind !== 'mission')) {
    const src = assetURL(media.src);
    if (!src) continue;
    const figure = el('figure', 'detail-media');
    const img = el('img');
    img.src = src; img.alt = media.alt || project.title; img.loading = 'lazy';
    figure.append(img);
    const caption = [media.caption, media.credit].filter(Boolean).join(' · ');
    if (caption) figure.append(el('figcaption', null, caption));
    if (media.sourceURL) {
      const source = externalLink('Publicación de origen', media.sourceURL);
      if (source) figure.append(source);
    }
    detail.append(figure);
  }
  const credits = detailSection('Créditos generales', project.credits || []);
  credits.classList.add('credit-list');
  detail.append(credits);
  if (project.tools?.length) detail.append(el('p', 'detail-tools', project.tools.join(' · ')));
  if (project.publicReferences?.length) {
    const links = el('div', 'public-links');
    project.publicReferences.forEach((ref) => {
      const link = externalLink(ref.title, ref.url);
      if (link) links.append(link);
    });
    detail.append(links);
  }
  const switcher = el('nav', 'case-switcher');
  switcher.setAttribute('aria-label', 'Cambiar de campaña');
  for (const [offset, label, arrow] of [[-1, 'Caso anterior', '←'], [1, 'Siguiente caso', '→']]) {
    const target = projects[projectIndex + offset];
    const button = el('button', offset < 0 ? 'case-prev' : 'case-next');
    button.type = 'button';
    button.append(el('span', 'case-switch-label', `${arrow} ${label}`));
    button.append(el('span', 'case-switch-title', target?.title || (offset < 0 ? 'Primer caso' : 'Último caso')));
    button.disabled = !target;
    if (target) button.addEventListener('click', () => openProject(target, lastTrigger));
    switcher.append(button);
  }
  detail.append(switcher);
  if (!dialog.open) {
    if (!location.hash.startsWith('#proyecto=')) projectReturnHash = location.hash || '#inicio';
    dialog.showModal();
  }
  document.body.classList.add('dialog-open');
  dialog.scrollTop = 0;
  syncDetailLayout();
  if ('ResizeObserver' in window) {
    detailLayoutObserver?.disconnect();
    detailLayoutObserver = new ResizeObserver(syncDetailLayout);
    detailLayoutObserver.observe(dialog.querySelector('.dialog-toolbar'));
    detailLayoutObserver.observe(navigation);
  }
  if (changingCase) { title.tabIndex = -1; title.focus({preventScroll: true}); }
  else byId('close-dialog').focus();
  enterContent(detail);
  updateDetailSection();
  if (updateHash) history.replaceState(null, '', `#proyecto=${encodeURIComponent(project.slug)}`);
}

function closeProject() {
  if (dialog.open) dialog.close();
}
byId('close-dialog').addEventListener('click', closeProject);
dialog.addEventListener('click', (event) => { if (event.target === dialog) closeProject(); });
dialog.addEventListener('close', () => {
  detailSections = [];
  detailLayoutObserver?.disconnect();
  detailLayoutObserver = null;
  if (!byId('artwork-dialog')?.open) document.body.classList.remove('dialog-open');
  if (location.hash.startsWith('#proyecto=')) history.replaceState(null, '', projectReturnHash);
  lastTrigger?.focus();
});
function detailFromHash() {
  const match = location.hash.match(/^#proyecto=(.+)$/);
  if (!match) return null;
  try { return projects.find((item) => item.slug === decodeURIComponent(match[1])); }
  catch { return null; }
}
window.addEventListener('hashchange', () => {
  const item = detailFromHash();
  if (item) openProject(item, null, false);
  else if (dialog.open) dialog.close();
});

function renderProfile(content) {
  const profile = content.profile;
  byId('profile-name').textContent = profile.name;
  byId('profile-headline').textContent = profile.headline;
  if (Array.isArray(profile.heroTitle) && profile.heroTitle.length === 2) {
    byId('hero-title').replaceChildren(document.createTextNode(profile.heroTitle[0]), el('br'), el('span', null, profile.heroTitle[1]));
  }
  byId('profile-intro').textContent = profile.intro;
  byId('about-text').textContent = profile.about;
  const capabilityList = byId('capability-list');
  capabilityList.replaceChildren();
  profile.capabilities.forEach((item, index) => {
    const capability = el('article', 'capability');
    capability.append(el('h3', null, item.title), el('p', null, item.text));
    if (item.steps?.length) {
      const steps = el('ol', 'capability-steps');
      steps.id = `capability-steps-${index + 1}`; steps.hidden = true;
      item.steps.forEach((step) => steps.append(el('li', null, step)));
      const toggle = el('button', 'capability-toggle', 'Ver cómo lo aplico +');
      toggle.type = 'button'; toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', steps.id);
      toggle.addEventListener('click', () => {
        steps.hidden = !steps.hidden;
        toggle.setAttribute('aria-expanded', String(!steps.hidden));
        toggle.textContent = steps.hidden ? 'Ver cómo lo aplico +' : 'Cerrar recorrido −';
      });
      capability.append(toggle, steps);
    }
    capabilityList.append(capability);
  });
  const timeline = byId('timeline');
  timeline.replaceChildren();
  content.trajectory.forEach((item) => {
    const entry = el('article', 'timeline-entry');
    const range = [item.start, item.current ? 'Actualidad' : item.end].filter(Boolean).join(' — ');
    if (range) entry.append(el('p', 'timeline-date', range));
    entry.append(el('h3', null, item.organization || item.function));
    if (item.organization) entry.append(el('p', 'timeline-role', item.formalTitle || item.function));
    entry.append(el('p', null, item.text));
    timeline.append(entry);
  });
  const education = byId('education');
  education.replaceChildren();
  content.education.forEach((item) => {
    const entry = el('article', 'education-entry');
    entry.append(el('h3', null, item.qualification));
    const detail = [item.institution, item.date].filter(Boolean).join(' · ');
    if (detail) entry.append(el('p', null, detail));
    education.append(entry);
  });
  const cv = safeURL(content.cv?.publicFile);
  const cvLink = byId('cv-link');
  cvLink.hidden = !cv;
  if (cv) {
    const cvURL = new URL(cv);
    if (content.cv.revision && ['http:', 'https:'].includes(cvURL.protocol)) cvURL.searchParams.set('v', content.cv.revision);
    cvLink.href = cvURL.href;
    cvLink.setAttribute('download', 'Fernando-Perez-CV.pdf');
  }
  const contactLinks = byId('contact-links');
  contactLinks.replaceChildren();
  if (profile.contact?.email) {
    const link = el('a', 'contact-link', profile.contact.email);
    link.href = `mailto:${encodeURIComponent(profile.contact.email)}`;
    contactLinks.append(link);
  }
  const linkedin = externalLink('LinkedIn', profile.contact?.linkedin);
  if (linkedin) contactLinks.append(linkedin);
  byId('contact-section').hidden = contactLinks.childElementCount === 0;
  byId('contact-nav').hidden = contactLinks.childElementCount === 0;
  if (profile.location) contactLinks.append(el('p', 'contact-location', profile.location));
}

function renderPortfolio3D(portfolio = {}) {
  portfolio ||= {};
  const list = byId('three-d-list');
  list.replaceChildren();
  const works = Array.isArray(portfolio.works) ? portfolio.works.filter((work) => work && work.title) : [];
  artwork = works;
  byId('trabajo-3d').hidden = works.length === 0;
  byId('three-d-nav').hidden = works.length === 0;
  if (!works.length) return;
  byId('three-d-title').textContent = portfolio.title || 'Espacios, modelos y experiencias.';
  byId('three-d-intro').textContent = portfolio.intro || '';
  const album = safeURL(portfolio.albumURL);
  const albumLink = byId('three-d-album');
  albumLink.hidden = !album;
  if (album) {
    albumLink.href = album;
    albumLink.target = '_blank';
    albumLink.rel = 'noopener noreferrer';
  }
  works.forEach((work, index) => {
    const card = el('article', 'three-d-card');
    card.dataset.category = work.filter || (work.experienceURL ? 'virtual' : 'visualization');
    const src = assetURL(work.image?.src);
    if (src) {
      const frame = el('div', 'three-d-image');
      const image = el('img');
      image.src = src;
      image.alt = work.image?.alt || work.title;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.addEventListener('error', () => frame.remove(), { once: true });
      const preview = el('button', 'three-d-preview');
      preview.type = 'button';
      preview.setAttribute('aria-label', `Ampliar obra: ${work.title}`);
      preview.append(image, el('span', 'three-d-expand', 'Ampliar ↗'));
      preview.addEventListener('click', () => openArtwork(index, preview));
      frame.append(preview);
      card.append(frame);
    }
    const body = el('div', 'three-d-body');
    if (work.category) body.append(el('p', 'three-d-category', work.category));
    body.append(el('h3', 'three-d-work-title', work.title));
    if (work.description) body.append(el('p', 'three-d-description', work.description));
    if (Array.isArray(work.tools) && work.tools.length) {
      const tools = el('ul', 'three-d-tools');
      tools.setAttribute('aria-label', `Herramientas de ${work.title}`);
      work.tools.forEach((tool) => tools.append(el('li', null, tool)));
      body.append(tools);
    }
    if (work.credit) body.append(el('p', 'three-d-credit', work.credit));
    const links = el('div', 'three-d-links');
    const source = externalLink('Ver proyecto en ArtStation', work.sourceURL);
    const experience = externalLink('Explorar experiencia', work.experienceURL);
    if (source) links.append(source);
    if (experience) links.append(experience);
    if (links.childElementCount) body.append(links);
    card.append(body);
    list.append(card);
  });
  filterArtwork(artworkFilter);
}

function filterArtwork(value) {
  artworkFilter = value;
  byId('three-d-list').querySelectorAll('.three-d-card').forEach((card) => {
    card.hidden = value !== 'all' && card.dataset.category !== value;
  });
  byId('three-d-filters').querySelectorAll('button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.threeDFilter === value));
  });
  setupReveals();
}

function setProjectLayout(value) {
  projectLayout = value;
  byId('project-list').classList.toggle('is-list', value === 'list');
  byId('project-layout-switch').querySelectorAll('button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.projectLayout === value));
  });
  setupReveals();
  enterContent(byId('project-list'));
}

let lastArtworkTrigger = null;
let viewedWork = 0;
let artworkReturnHash = '#trabajo-3d';
function openArtwork(index, trigger = null, updateHash = true) {
  const work = artwork[index];
  if (!work) return;
  viewedWork = index;
  if (trigger) lastArtworkTrigger = trigger;
  const lightbox = byId('artwork-dialog');
  const image = byId('artwork-image');
  image.src = assetURL(work.image?.src);
  image.alt = work.image?.alt || work.title;
  byId('artwork-title').textContent = work.title;
  byId('artwork-dialog-label').textContent = `${String(index + 1).padStart(2, '0')} / ${String(artwork.length).padStart(2, '0')} · ${work.category}`;
  byId('artwork-description').textContent = work.description || '';
  byId('artwork-credit').textContent = work.credit || '';
  const links = byId('artwork-links'); links.replaceChildren();
  const source = externalLink('Publicación original', work.sourceURL);
  const experience = externalLink('Explorar experiencia', work.experienceURL);
  if (source) links.append(source);
  if (experience) links.append(experience);
  byId('artwork-image-frame').classList.remove('is-zoomed');
  byId('artwork-zoom').setAttribute('aria-pressed', 'false');
  byId('artwork-zoom').textContent = 'Acercar imagen';
  if (!lightbox.open) {
    if (!location.hash.startsWith('#obra=')) artworkReturnHash = location.hash || '#inicio';
    lightbox.showModal(); byId('close-artwork').focus();
  }
  document.body.classList.add('dialog-open');
  if (updateHash) history.replaceState(null, '', `#obra=${index + 1}`);
}

let revealObserver = null;
function setupReveals() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  if (!revealObserver) revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-entered'); revealObserver.unobserve(entry.target); }
    });
  }, {threshold: 0.06, rootMargin: '0px 0px 32px 0px'});
  document.querySelectorAll('.project-card, .three-d-card, .capability, .timeline-entry, .section-heading').forEach((node) => {
    if (node.hidden || node.classList.contains('is-entered')) return;
    node.classList.add('reveal'); revealObserver.observe(node);
  });
  document.documentElement.classList.add('motion-ready');
}

let interactionsReady = false;
function setupInteractions() {
  if (interactionsReady) { setupReveals(); return; }
  interactionsReady = true;
  byId('three-d-filters').querySelectorAll('button').forEach((button) => button.addEventListener('click', () => filterArtwork(button.dataset.threeDFilter)));
  byId('project-layout-switch').querySelectorAll('button').forEach((button) => button.addEventListener('click', () => setProjectLayout(button.dataset.projectLayout)));
  const lightbox = byId('artwork-dialog');
  byId('close-artwork').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('close', () => {
    if (!dialog.open) document.body.classList.remove('dialog-open');
    if (location.hash.startsWith('#obra=')) history.replaceState(null, '', artworkReturnHash);
    lastArtworkTrigger?.focus();
  });
  const previous = () => openArtwork((viewedWork - 1 + artwork.length) % artwork.length);
  const next = () => openArtwork((viewedWork + 1) % artwork.length);
  byId('artwork-prev').addEventListener('click', previous);
  byId('artwork-next').addEventListener('click', next);
  byId('artwork-zoom').addEventListener('click', () => {
    const zoomed = byId('artwork-image-frame').classList.toggle('is-zoomed');
    byId('artwork-zoom').setAttribute('aria-pressed', String(zoomed));
    byId('artwork-zoom').textContent = zoomed ? 'Ver imagen completa' : 'Acercar imagen';
  });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); previous(); }
    if (event.key === 'ArrowRight') { event.preventDefault(); next(); }
  });
  window.addEventListener('hashchange', () => {
    const match = location.hash.match(/^#obra=(\d+)$/);
    if (match) openArtwork(Number(match[1]) - 1, null, false);
    else if (lightbox.open) lightbox.close();
  });
  const navLinks = Array.from(document.querySelectorAll('.site-header nav a'));
  const sections = navLinks.map((link) => ({link, target:document.querySelector(link.getAttribute('href'))})).filter(({target}) => target);
  const pageSections = Array.from(document.querySelectorAll('main > section'));
  const header = document.querySelector('.site-header');
  const syncHeaderLayout = () => {
    document.documentElement.style.setProperty('--header-measured', header.getBoundingClientRect().height + 'px');
  };
  syncHeaderLayout();
  if ('ResizeObserver' in window) new ResizeObserver(syncHeaderLayout).observe(header);
  let readingFrame = null;
  const updateReading = () => {
    readingFrame = null;
    const available = document.documentElement.scrollHeight - innerHeight;
    byId('reading-progress').style.transform = `scaleX(${available > 0 ? Math.min(1, Math.max(0, scrollY / available)) : 0})`;
    let current = null;
    const readingEdge = header.getBoundingClientRect().height + 72;
    sections.forEach((item) => { if (!item.target.hidden && item.target.getBoundingClientRect().top <= readingEdge) current = item; });
    navLinks.forEach((link) => {
      const active = current?.link === link;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
    let activeSection = byId('inicio');
    pageSections.forEach((section) => { if (!section.hidden && section.getBoundingClientRect().top <= readingEdge) activeSection = section; });
    pageSections.forEach((section) => section.classList.toggle('is-section-current', section === activeSection));
    byId('inicio').classList.toggle('is-background-dormant', byId('inicio').getBoundingClientRect().bottom <= header.getBoundingClientRect().height);
  };
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const target = byId(link.getAttribute('href').slice(1));
    if (!target || !target.matches('main, main > section')) return;
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (target.hidden) return;
      event.preventDefault();
      syncHeaderLayout();
      if (location.hash !== link.getAttribute('href')) history.pushState(null, '', link.getAttribute('href'));
      target.scrollIntoView({block: 'start', behavior: motionStopped() ? 'instant' : 'smooth'});
      target.tabIndex = -1;
      target.focus({preventScroll: true});
    });
  });
  window.addEventListener('scroll', () => { if (!readingFrame) readingFrame = requestAnimationFrame(updateReading); }, {passive:true});
  window.addEventListener('resize', () => { syncHeaderLayout(); syncDetailLayout(); updateReading(); }); updateReading();
  setupAtmosphere();
  setupReveals();
}

function setupAtmosphere() {
  const hero = byId('inicio');
  const toggle = byId('motion-toggle');
  if (!hero || !toggle) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  try { paused = localStorage.getItem('fernando-motion') === 'paused'; } catch { /* Preferences are optional. */ }
  let lightFrame = null;
  let lightX = 0;
  let lightY = 0;
  const resetLight = () => {
    if (lightFrame) cancelAnimationFrame(lightFrame);
    lightFrame = null;
    hero.style.setProperty('--light-x', '0px');
    hero.style.setProperty('--light-y', '0px');
  };
  const applyPreference = () => {
    const stopped = paused || preference.matches;
    document.documentElement.classList.toggle('motion-paused', stopped);
    toggle.setAttribute('aria-pressed', String(!stopped));
    toggle.disabled = preference.matches;
    toggle.textContent = preference.matches ? 'Movimiento reducido' : paused ? 'Activar movimiento' : 'Pausar movimiento';
    if (stopped) resetLight();
  };
  toggle.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('fernando-motion', paused ? 'paused' : 'active'); } catch { /* Keep the choice for this page. */ }
    applyPreference();
  });
  preference.addEventListener('change', applyPreference);
  hero.addEventListener('pointermove', (event) => {
    if (paused || preference.matches || event.pointerType !== 'mouse') return;
    const bounds = hero.getBoundingClientRect();
    lightX = Math.max(-18, Math.min(18, ((event.clientX - bounds.left) / bounds.width - 0.5) * 36));
    lightY = Math.max(-14, Math.min(14, ((event.clientY - bounds.top) / bounds.height - 0.5) * 28));
    if (!lightFrame) lightFrame = requestAnimationFrame(() => {
      hero.style.setProperty('--light-x', `${lightX.toFixed(1)}px`);
      hero.style.setProperty('--light-y', `${lightY.toFixed(1)}px`);
      lightFrame = null;
    });
  }, {passive: true});
  hero.addEventListener('pointerleave', resetLight);
  applyPreference();
}

let modelModule = null;
function loadModelViewer() {
  if (!modelModule) modelModule = import('https://cdn.jsdelivr.net/npm/@google/model-viewer@4.3.1/dist/model-viewer.min.js');
  return modelModule;
}
function renderModels(models = []) {
  const list = byId('models-list');
  list.replaceChildren();
  const valid = models.filter((model) => safeURL(model.src));
  byId('models-section').hidden = valid.length === 0;
  valid.forEach((model) => {
    const figure = el('figure', 'model-card');
    const host = el('div', 'model-host');
    const button = el('button', 'model-load', 'Explorar modelo 3D');
    button.type = 'button';
    const poster = assetURL(model.poster);
    if (poster) {
      const image = el('img', 'model-poster');
      image.src = poster; image.alt = model.alt || model.title; image.loading = 'lazy';
      host.append(image);
    }
    const status = el('p', 'model-status');
    status.setAttribute('role', 'status');
    host.append(button, status);
    const caption = el('figcaption');
    caption.append(el('h3', null, model.title));
    if (model.description) caption.append(el('p', null, model.description));
    if (model.credit) caption.append(el('p', 'model-credit', model.credit));
    figure.append(host, caption);
    list.append(figure);
    button.addEventListener('click', async () => {
      button.disabled = true; status.textContent = 'Cargando modelo…';
      try {
        await loadModelViewer();
        const viewer = el('model-viewer');
        viewer.src = safeURL(model.src);
        viewer.alt = model.alt || model.title;
        viewer.setAttribute('camera-controls', '');
        viewer.setAttribute('touch-action', 'pan-y');
        viewer.setAttribute('shadow-intensity', '1');
        if (poster) viewer.setAttribute('poster', poster);
        const motionOK = !matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (motionOK && model.autoRotate) viewer.setAttribute('auto-rotate', '');
        viewer.addEventListener('load', () => {
          status.textContent = 'Arrastra para girar. Acerca o aleja para explorar.';
        });
        viewer.addEventListener('error', () => {
          viewer.remove();
          const image = host.querySelector('.model-poster');
          if (image) image.hidden = false;
          button.hidden = false; button.disabled = false;
          status.textContent = 'No se pudo cargar el modelo. Puedes volver a intentarlo.';
        });
        host.prepend(viewer);
        const image = host.querySelector('.model-poster');
        if (image) image.hidden = true;
        button.hidden = true;
      } catch {
        button.disabled = false;
        status.textContent = 'No se pudo cargar el visor. Puedes volver a intentarlo.';
      }
    });
  });
}

async function bootstrap() {
  try {
    const embedded = byId('portfolio-content');
    let content;
    if (embedded) content = JSON.parse(embedded.textContent);
    else {
      const response = await fetch('./content.json', {cache: 'no-cache'});
      if (!response.ok) throw new Error('Content unavailable');
      content = await response.json();
    }
    if (!content.profile || !Array.isArray(content.projects)) throw new Error('Content invalid');
    renderProfile(content);
    projects = [...content.projects].sort((a, b) => (b.publicResult?.count ?? -1) - (a.publicResult?.count ?? -1));
    renderProjects();
    renderPortfolio3D(content.portfolio3d);
    renderModels(content.models3d);
    setupInteractions();
    document.documentElement.classList.add('content-ready');
    const item = detailFromHash();
    if (item) openProject(item, null, false);
    const workMatch = location.hash.match(/^#obra=(\d+)$/);
    if (workMatch) openArtwork(Number(workMatch[1]) - 1, null, false);
    if (!item && !workMatch && location.hash) {
      const anchor = byId(location.hash.slice(1));
      if (anchor && !anchor.hidden) requestAnimationFrame(() => anchor.scrollIntoView({block:'start', behavior:'instant'}));
    }
  } catch (error) {
    const message = el('div', 'content-error');
    message.setAttribute('role', 'alert');
    message.append(el('p', null, 'No fue posible cargar los proyectos.'));
    const retry = el('button', 'project-open', 'Volver a cargar');
    retry.type = 'button'; retry.addEventListener('click', bootstrap);
    message.append(retry);
    byId('project-list').replaceChildren(message);
    console.error('Portfolio content could not be loaded.', error);
  }
}

bootstrap();
