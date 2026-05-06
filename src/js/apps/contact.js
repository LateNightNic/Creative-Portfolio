export function getContent() {
  return `
    <form class="contact-form">
      <!-- !! Replace the value below with your Web3Forms access key from web3forms.com !! -->
      <input type="hidden" name="access_key" value="f63d3fe0-82ab-46eb-8b53-080e7286b7ab">
      <input type="checkbox" name="botcheck" style="display:none">

      <div class="contact-header">
        <div class="contact-row">
          <span class="contact-row__label">To</span>
          <span class="contact-row__locked">Nic Milligan</span>
        </div>
        <div class="contact-row">
          <label class="contact-row__label" for="contact-from">From</label>
          <input class="contact-input" type="email" id="contact-from" name="email"
            placeholder="Your email address here" required autocomplete="email">
        </div>
        <div class="contact-row">
          <label class="contact-row__label" for="contact-subject">Subject</label>
          <input class="contact-input" type="text" id="contact-subject" name="subject"
            placeholder="Subject" required>
        </div>
        <div class="contact-row">
          <label class="contact-row__label" for="contact-attachment">Attach</label>
          <input class="contact-file" type="file" id="contact-attachment" name="attachment">
        </div>
      </div>

      <textarea class="contact-textarea" id="contact-message" name="message"
        placeholder="What do you want to say?" required></textarea>

      <div class="contact-footer">
        <button class="contact-submit" type="submit">Send</button>
      </div>
    </form>

    <div class="contact-success" hidden>
      <p>Message sent — I'll be in touch.</p>
    </div>
    <div class="contact-error" hidden>
      <p>Something went wrong. <a href="mailto:hello@nicmilligan.com">Email directly instead →</a></p>
    </div>
  `;
}

export function init(win) {
  const form = win.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.contact-submit');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(form),
      });
      const json = await res.json();
      if (json.success) {
        form.hidden = true;
        win.querySelector('.contact-success').hidden = false;
      } else {
        throw new Error(json.message);
      }
    } catch {
      win.querySelector('.contact-error').hidden = false;
      btn.disabled = false;
      btn.textContent = 'Send';
    }
  });
}
