const q = (sel) => document.querySelector(sel);

export function getDom() {
  const form = q('#card-editor-form');
  const inputs = {
    fullName: q('#fullName'),
    jobTitle: q('#jobTitle'),
    company: q('#company'),
    credential: q('#credential'),
    phone: q('#phone'),
    email: q('#email'),
    website: q('#website'),
    address: q('#address'),
    template: q('#template'),
    typography: q('#typography'),
    brandPrimary: q('#brandPrimary'),
    brandAccent: q('#brandAccent'),
    surfaceTone: q('#surfaceTone'),
    qrValue: q('#qrValue'),
    qrPlacement: q('#qrPlacement'),
    backMessage: q('#backMessage'),
    logoUpload: q('#logoUpload'),
    profileUpload: q('#profileUpload'),
  };

  const actions = {
    sample: q('#sampleDataTop'),
    reset: q('#resetTop'),
    export: q('#exportTop'),
    print: q('#printTop'),
    sampleAlt: q('#sampleDataBottom'),
    resetAlt: q('#resetBottom'),
    exportAlt: q('#exportBottom'),
    printAlt: q('#printBottom'),
  };

  const preview = {
    frontCard: q('#card-front-surface'),
    backCard: q('#card-back-surface'),
    frontPanel: q('#card-front-panel'),
    backPanel: q('#card-back-panel'),
    frontToggle: q('#frontSideBtn'),
    backToggle: q('#backSideBtn'),
    front: {
      logo: q('#preview-logo'),
      profile: q('#preview-profile'),
      company: q('#preview-company'),
      name: q('#preview-name'),
      title: q('#preview-title'),
      credential: q('#preview-credential'),
      phone: q('#preview-phone'),
      email: q('#preview-email'),
      website: q('#preview-website'),
      address: q('#preview-address'),
      qr: q('#preview-front-qr'),
    },
    back: {
      company: q('#preview-back-company'),
      name: q('#preview-back-name'),
      message: q('#preview-back-message'),
      profileLink: q('#preview-back-profile-link'),
      website: q('#preview-back-website'),
      qr: q('#preview-back-qr'),
    },
  };

  return { form, inputs, actions, preview };
}

export function fillForm(inputs, state) {
  Object.entries(inputs).forEach(([key, el]) => {
    if (!el || el.type === 'file') return;
    if (state[key] !== undefined && document.activeElement !== el) el.value = state[key];
  });
}

export function setFieldError(input, message = '') {
  if (!input) return;
  input.setCustomValidity(message);
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
