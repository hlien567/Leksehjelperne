const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

const contactForm = document.getElementById('contact-form');
const contactMessage = document.getElementById('contact-message');
const consentCheckbox = document.getElementById('personvern-checkbox');

if (contactForm && contactMessage) {
  const submitButton = contactForm.querySelector('button[type="submit"]');

  const updateSubmitState = () => {
    if (submitButton && consentCheckbox) {
      submitButton.disabled = !consentCheckbox.checked;
    }
  };

  if (consentCheckbox) {
    consentCheckbox.addEventListener('change', updateSubmitState);
    updateSubmitState();
  }

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    contactMessage.textContent = 'Sender henvendelsen...';
    contactMessage.className = 'contact-message';

    const action = contactForm.action;
    if (!action || action.endsWith('#') || action.includes('your-form-id')) {
      contactMessage.textContent = 'Skjemaet er ikke konfigurert. Bytt ut <code>your-form-id</code> i action-attributtet med din egen Formspree-ID.';
      contactMessage.classList.add('error');
      return;
    }

    const formData = new FormData(contactForm);

    try {
      const response = await fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        contactMessage.textContent = 'Takk! Din henvendelse er sendt. Du vil få e-post når noen kontakter deg.';
        contactMessage.classList.add('success');
        contactForm.reset();
        updateSubmitState();
      } else {
        contactMessage.textContent = 'Noe gikk galt under innsending. Sjekk Formspree-oppsettet og prøv igjen.';
        contactMessage.classList.add('error');
      }
    } catch (error) {
      contactMessage.textContent = 'Kunne ikke sende skjemaet. Sjekk internettilkoblingen eller Formspree-innstillingene.';
      contactMessage.classList.add('error');
    }
  });
}
