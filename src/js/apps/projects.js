import { openProjectWindow } from './project-detail.js';

export const projects = [
  {
    slug: 'through-the-frames',
    title: 'Through the Frames',
    tag: 'Personal',
    description: 'A personal photography website with rich, orchestrated animations.',
    role: 'Full Stack Developer',
    startDate: 'Sept 2025',
    endDate: 'Sept 2025',
    link: 'https://example.com',
    stack: ['Next.js', 'React', 'TypeScript', 'GSAP', 'Tailwind CSS', 'Cloudflare Images', 'Neon Postgres', 'Drizzle ORM'],
    tasks: ['Design', 'Branding', 'Backend Development', 'Frontend Development'],
    sections: [
      {
        heading: 'Overview',
        body: '<p>A personal photography website built to display my collections with rich, orchestrated animations. The goal was to create something visually complex where every transition, scroll interaction, and hover state feels intentional and coordinated. I chose a stack that could keep up with what I had in mind.</p>',
      },
      {
        heading: 'Stack',
        body: '<p>Next.js 15 (App Router) with React 19 and TypeScript. Tailwind CSS v4 for styling. GSAP 3 with the <code>SplitText</code> plugin drives nearly every animation on the site. Neon serverless PostgreSQL with Drizzle ORM manages collections and images. All photos are served through Cloudflare Images with three delivery variants (<code>ttfcover</code>, <code>ttfgallery</code>, <code>fullres</code>), serving the right resolution per context while keeping bandwidth low.</p>',
      },
      {
        heading: 'Loading Sequence',
        body: '<p>The entry experience is a fully orchestrated GSAP timeline: a photograph slides up from below while progressively sharpening (animating <code>filter: blur</code> from 10px to 0), a progress counter counts to 100%, and an SVG border traces itself around the image via <code>strokeDashoffset</code> math on the rectangle’s perimeter. Everything runs as a single <code>gsap.timeline()</code> with precise overlap offsets (<code>"-=0.3"</code>, <code>"&lt;"</code>) so nothing feels disconnected.</p>',
      },
      {
        heading: 'Infinite Slider',
        body: '<p>The main page is a full-height, horizontally draggable slider showing all collections. The collection array is duplicated five times and starts in the middle copy. A <code>requestAnimationFrame</code> loop applies linear interpolation (<code>diff * 0.1</code>) between the current position and the target, producing buttery momentum even on trackpads.</p>',
      },
    ],
    visuals: [
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Through the Frames hero' },
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Collection grid' },
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Detail page' },
    ],
  },
  { slug: 'project-2', title: 'Project 2', tag: 'Personal',    description: 'A short, generic description of this placeholder project.' },
  { slug: 'project-3', title: 'Project 3', tag: 'Commercial', description: 'A short, generic description of this placeholder project.' },
  { slug: 'project-4', title: 'Project 4', tag: 'Personal',    description: 'A short, generic description of this placeholder project.' },
  { slug: 'project-5', title: 'Project 5', tag: 'Commercial', description: 'A short, generic description of this placeholder project.' },
];

function card({ slug, title, description, tag }) {
  return `
    <li>
      <button type="button" class="project-card" data-slug="${slug}" aria-label="Open project: ${title}">
        <div class="project-card__thumb" aria-hidden="true"></div>
        <div class="project-card__info">
          <div class="project-card__header">
            <span class="project-card__title">${title}</span>
            <span class="project-card__tag">${tag}</span>
          </div>
          <p class="project-card__desc">${description}</p>
        </div>
      </button>
    </li>`;
}

export function getContent() {
  return `<ul class="project-list">${projects.map(card).join('')}</ul>`;
}

export function init(win) {
  win.querySelectorAll('.project-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      openProjectWindow(btn.dataset.slug, btn);
    });
  });
}
