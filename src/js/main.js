import { WindowManager } from './windows.js';
import { IconManager } from './icons.js';
import { initTopbar } from './topbar.js';
import { getContent as aboutContent } from './apps/about.js';
import { getContent as projectsContent, init as projectsInit } from './apps/projects.js';
import { getContent as playgroundContent } from './apps/playground.js';
import { getContent as resumeContent, init as resumeInit } from './apps/resume.js';
import { getContent as contactContent, init as contactInit } from './apps/contact.js';
import { getContent as blogContent } from './apps/blog.js';
import { setWindowManager } from './apps/project-detail.js';

const apps = {
  projects:   { title: 'My Projects',  content: projectsContent, init: projectsInit },
  playground: { title: 'Playground',   content: playgroundContent },
  about:      { title: 'About Me',     content: aboutContent },
  resume:     { title: 'Resume',       content: resumeContent, init: resumeInit, width: 720, height: 880 },
  contact:    { title: 'Contact',      content: contactContent, init: contactInit },
  blog:       { title: 'My Blog',      content: blogContent },
};

const manager = new WindowManager(document.getElementById('windows'));
const iconManager = new IconManager();
setWindowManager(manager);

document.querySelectorAll('.desktop-icon').forEach((icon) => {
  const app = apps[icon.dataset.app];
  if (!app) return;
  icon.addEventListener('click', () => {
    const win = manager.open({
      id: icon.dataset.app,
      title: app.title,
      content: app.content(),
      triggerEl: icon,
      width: app.width,
      height: app.height,
    });
    if (app.init && !win.dataset.initialized) {
      app.init(win);
      win.dataset.initialized = 'true';
    }
  });
});

initTopbar({ windowManager: manager, iconManager });
1