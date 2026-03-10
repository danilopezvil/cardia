export const STORAGE_KEY = 'cardia-studio-state-v1';

export const TEMPLATE_OPTIONS = [
  'executive-corporate',
  'editorial-minimal',
  'modern-creative',
  'tech-professional',
  'health-and-wellness',
  'prestige-dark',
  'forensic-psychology',
  'senior-software-architect',
  'legal-institutional',
];

export const DEFAULT_STATE = {
  side: 'front',
  template: 'executive-corporate',
  typography: 'inter-serif',
  fullName: 'Dr. Amelia Reyes',
  jobTitle: 'Forensic Psychologist',
  company: 'Northbridge Behavioral Lab',
  credential: 'PsyD, ABPP Forensic',
  phone: '+1 (202) 555-0147',
  email: 'amelia@northbridgelab.com',
  website: 'https://northbridgelab.com',
  address: '420 Madison Ave, New York',
  brandPrimary: '#14213d',
  brandAccent: '#d4a373',
  surfaceTone: '#f8fafc',
  qrValue: 'https://northbridgelab.com',
  qrPlacement: 'back',
  backMessage: 'Confidential consultations by appointment.',
  logoData: '',
  profileData: '',
};

export const SAMPLE_DATA = {
  fullName: 'Avery Sloan',
  jobTitle: 'Senior Software Architect',
  company: 'Granite Systems',
  credential: 'Distributed Systems & Platform Strategy',
  phone: '+1 (415) 555-0127',
  email: 'avery@granitesystems.io',
  website: 'https://granitesystems.io',
  address: '85 Mission St, San Francisco',
  template: 'senior-software-architect',
  typography: 'space-public',
  brandPrimary: '#0f172a',
  brandAccent: '#22c55e',
  qrValue: 'https://cal.com/avery-sloan',
  backMessage: 'Architecture reviews · Fractional CTO advisory · Remote worldwide',
};

export const FIELD_VALIDATORS = {
  fullName: (v) => v.trim().length >= 2,
  jobTitle: (v) => v.trim().length >= 2,
  company: (v) => v.trim().length >= 2,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  website: (v) => /^(https?:\/\/).+/i.test(v.trim()),
  qrValue: (v) => v.trim() === '' || /^(https?:\/\/).+/i.test(v.trim()),
  phone: (v) => v.trim().length >= 7,
};
