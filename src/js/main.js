import { WindowManager } from './windows.js';
import { IconManager } from './icons.js';
import { initTopbar } from './topbar.js';
import { getContent as aboutContent } from './apps/about.js';
import { getContent as projectsContent } from './apps/projects.js';
import { getContent as playgroundContent } from './apps/playground.js';
import { getContent as resumeContent } from './apps/resume.js';
import { getContent as contactContent, init as contactInit } from './apps/contact.js';
import { getContent as blogContent } from './apps/blog.js';

const apps = {
  projects:   { title: 'My Projects',  content: projectsContent },
  playground: { title: 'Playground',   content: playgroundContent },
  about:      { title: 'About Me',     content: aboutContent },
  resume:     { title: 'Resume',       content: resumeContent },
  contact:    { title: 'Contact',      content: contactContent, init: contactInit },
  blog:       { title: 'My Blog',      content: blogContent },
};

const manager = new WindowManager(document.getElementById('windows'));
const iconManager = new IconManager();

document.querySelectorAll('.desktop-icon').forEach((icon) => {
  const app = apps[icon.dataset.app];
  if (!app) return;
  icon.addEventListener('click', () => {
    const win = manager.open({
      id: icon.dataset.app,
      title: app.title,
      content: app.content(),
      triggerEl: icon,
    });
    if (app.init && !win.dataset.initialized) {
      app.init(win);
      win.dataset.initialized = 'true';
    }
  });
});

initTopbar({ windowManager: manager, iconManager });
1