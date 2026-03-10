const textMap = {
  fullName: ['namePreview', 'backNamePreview'],
  title: ['titlePreview'],
  company: ['companyPreview', 'backCompanyPreview'],
  tagline: ['taglinePreview'],
  phone: ['phonePreview'],
  email: ['emailPreview'],
  website: ['webPreview', 'backWebsitePreview'],
  address: ['addressPreview'],
  credential: ['credentialPreview'],
  profileUrl: ['profilePreview'],
  backNote: ['backNotePreview'],
};

export function renderCard(state, elements) {
  Object.entries(textMap).forEach(([key, targets]) => {
    targets.forEach((id) => {
      elements[id].textContent = state[key] || '';
    });
  });

  elements.logoPreview.style.display = state.logoData ? 'block' : 'none';
  elements.logoPreview.src = state.logoData || '';

  elements.avatarPreview.style.display = state.avatarData ? 'block' : 'none';
  elements.avatarPreview.src = state.avatarData || '';

  applyCardClasses(state, elements.cardFront);
  applyCardClasses(state, elements.cardBack);

  document.documentElement.style.setProperty('--brand-primary', state.brandPrimary);
  document.documentElement.style.setProperty('--brand-accent', state.brandAccent);

  elements.qrContainer.style.display = state.showQr === 'yes' ? 'grid' : 'none';
}

function applyCardClasses(state, card) {
  const classes = [...card.classList].filter((name) => !name.startsWith('template-') && !name.startsWith('type-'));
  card.className = `${classes.join(' ')} template-${state.template} type-${state.typeScale}`.trim();
}

export function toggleSide(side, elements) {
  const frontOn = side === 'front';
  elements.cardFront.classList.toggle('is-hidden', !frontOn);
  elements.cardBack.classList.toggle('is-hidden', frontOn);
}
