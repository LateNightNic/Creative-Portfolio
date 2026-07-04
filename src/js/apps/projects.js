import { openProjectWindow } from './project-detail.js';

export const projects = [
  {
    // Project 01 //
    slug: 'candy-crush-saga-ctv',
    title: 'Candy Crush Saga CTV',
    tag: 'Commercial',
    description: 'Designing and overseeing a new creative strategy and direction for King Games flagship game, Candy Crush Saga.',
    role: 'Senior Creative',
    startDate: 'Sept 2024',
    endDate: 'Nov 2025',
    // link: 'https://example.com',
    // stack: ['Next.js', 'React', 'TypeScript', 'GSAP', 'Tailwind CSS', 'Cloudflare Images', 'Neon Postgres', 'Drizzle ORM'],
    tasks: ['Creative Direction', 'Art Direction', 'Creative Strategy', 'Concept Development', 'Copywriting'],
    sections: [
      {
        heading: 'Overview',
        body: '<p>An overview of CTV the problem faced / solved. Brief overview of my role</p>',
      },
      {
        heading: 'A new creativey strategy',
        body: '<p>How I created the new creative strategy and 12 month roadmap. Bringing AI development in-house.</p>',
      },
      {
        heading: 'Direction & Results',
        body: '<p>How I led on direction and the impact I had on the business. Increased volume of concepts tested, consistently won tests. Concepts / formats that allow for rapid optimisation to maximise winnings</p>',
      },
    ],
    visuals: [
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Through the Frames hero', caption: 'Candy Factory Video (museum feature)' },
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Collection grid', caption: 'Candy Factory Op Montage' },
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Detail page', caption: 'Sweet Waiting' },
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Detail page', caption: 'Sweet Waiting Op Variations + Messaging' },
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Detail page', caption: 'Find More Visuals' },  
    ],
  },
  {
    // Project 02 //
    slug: 'crush-their-crush',
    title: 'Crush Their Crush',
    tag: 'Commercial',
    description: 'A short, generic description of this placeholder project.',
    role: 'Senior Creative',
    startDate: 'Sept 2024',
    endDate: 'Nov 2025',
    // link: 'https://example.com',
    // stack: ['Next.js', 'React', 'TypeScript', 'GSAP', 'Tailwind CSS', 'Cloudflare Images', 'Neon Postgres', 'Drizzle ORM'],
    tasks: ['Creative Direction', 'Art Direction', 'Creative Strategy', 'Concept Development', 'Copywriting'],
    sections: [
      {
        heading: 'Overview',
        body: '<p>Placeholder overview copy.</p>',
      },
      {
        heading: 'Placeholder Heading',
        body: '<p>Placeholder section copy.</p>',
      },
      {
        heading: 'Direction & Results',
        body: '<p>Placeholder results copy.</p>',
      },
    ],
    visuals: [
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Placeholder visual', caption: 'Caption placeholder' },
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Placeholder visual', caption: 'Caption placeholder' },
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Placeholder visual', caption: 'Caption placeholder' },
    ],
  },
  {
    // Project 03 //
    slug: 'mobile-gaming-user-aquisition',
    title: 'Mobile Gaming UA',
    tag: 'Commercial',
    description: 'A short, generic description of this placeholder project.',
    role: 'Senior Creative',
    startDate: 'Sept 2024',
    endDate: 'Nov 2025',
    // link: 'https://example.com',
    // stack: ['Next.js', 'React', 'TypeScript', 'GSAP', 'Tailwind CSS', 'Cloudflare Images', 'Neon Postgres', 'Drizzle ORM'],
    tasks: ['Creative Direction', 'Art Direction', 'Creative Strategy', 'Concept Development', 'Copywriting'],
    sections: [
      {
        heading: 'Overview',
        body: '<p>Placeholder overview copy.</p>',
      },
      {
        heading: 'Placeholder Heading',
        body: '<p>Placeholder section copy.</p>',
      },
      {
        heading: 'Direction & Results',
        body: '<p>Placeholder results copy.</p>',
      },
    ],
    visuals: [
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Placeholder visual', caption: 'Caption placeholder' },
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Placeholder visual', caption: 'Caption placeholder' },
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Placeholder visual', caption: 'Caption placeholder' },
    ],
  },
  {
    // Project 04 //
    slug: 'treatwell-brand-animation',
    title: 'Treatwell Brand Animation',
    tag: 'Commercial',
    description: 'A short, generic description of this placeholder project.',
    role: 'Senior Creative',
    startDate: 'Sept 2024',
    endDate: 'Nov 2025',
    // link: 'https://example.com',
    // stack: ['Next.js', 'React', 'TypeScript', 'GSAP', 'Tailwind CSS', 'Cloudflare Images', 'Neon Postgres', 'Drizzle ORM'],
    tasks: ['Creative Direction', 'Art Direction', 'Creative Strategy', 'Concept Development', 'Copywriting'],
    sections: [
      {
        heading: 'Overview',
        body: '<p>Placeholder overview copy.</p>',
      },
      {
        heading: 'Placeholder Heading',
        body: '<p>Placeholder section copy.</p>',
      },
      {
        heading: 'Direction & Results',
        body: '<p>Placeholder results copy.</p>',
      },
    ],
    visuals: [
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Placeholder visual', caption: 'Caption placeholder' },
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Placeholder visual', caption: 'Caption placeholder' },
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Placeholder visual', caption: 'Caption placeholder' },
    ],
  },
  {
    // Project 05 //
    slug: 'project-5',
    title: 'Project 5',
    tag: 'Commercial',
    description: 'A short, generic description of this placeholder project.',
    role: 'Senior Creative',
    startDate: 'Sept 2024',
    endDate: 'Nov 2025',
    // link: 'https://example.com',
    // stack: ['Next.js', 'React', 'TypeScript', 'GSAP', 'Tailwind CSS', 'Cloudflare Images', 'Neon Postgres', 'Drizzle ORM'],
    tasks: ['Creative Direction', 'Art Direction', 'Creative Strategy', 'Concept Development', 'Copywriting'],
    sections: [
      {
        heading: 'Overview',
        body: '<p>Placeholder overview copy.</p>',
      },
      {
        heading: 'Placeholder Heading',
        body: '<p>Placeholder section copy.</p>',
      },
      {
        heading: 'Direction & Results',
        body: '<p>Placeholder results copy.</p>',
      },
    ],
    visuals: [
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Placeholder visual', caption: 'Caption placeholder' },
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Placeholder visual', caption: 'Caption placeholder' },
      { type: 'image', src: 'images/project-visual-placeholder.svg', alt: 'Placeholder visual', caption: 'Caption placeholder' },
    ],
  },
];

function card({ slug, title, description, tag }) {
  return `
    <li>
      <button type="button" class="project-card" data-slug="${slug}" aria-label="Open project: ${title}">
        <div class="project-card__thumb" aria-hidden="true"></div>
        <div class="project-card__info">
          <span class="project-card__tag">${tag}</span>
          <span class="project-card__title">${title}</span>
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
