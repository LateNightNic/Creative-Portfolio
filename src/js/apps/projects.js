const projects = [
  { title: 'Project 1', description: 'A short, generic description of this placeholder project.', tag: 'Commercial' },
  { title: 'Project 2', description: 'A short, generic description of this placeholder project.', tag: 'Personal' },
  { title: 'Project 3', description: 'A short, generic description of this placeholder project.', tag: 'Commercial' },
  { title: 'Project 4', description: 'A short, generic description of this placeholder project.', tag: 'Personal' },
  { title: 'Project 5', description: 'A short, generic description of this placeholder project.', tag: 'Commercial' },
];

function card({ title, description, tag }) {
  return `
    <li class="project-card">
      <div class="project-card__thumb" aria-hidden="true"></div>
      <div class="project-card__info">
        <div class="project-card__header">
          <span class="project-card__title">${title}</span>
          <span class="project-card__tag">${tag}</span>
        </div>
        <p class="project-card__desc">${description}</p>
      </div>
    </li>`;
}

export function getContent() {
  return `<ul class="project-list">${projects.map(card).join('')}</ul>`;
}
