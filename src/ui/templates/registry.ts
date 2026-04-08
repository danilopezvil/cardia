import type { CardTemplate } from '../../domain/card';
import { CorporateTemplate } from './components/CorporateTemplate';
import { CreativeTemplate } from './components/CreativeTemplate';
import { HealthTemplate } from './components/HealthTemplate';
import { LegalTemplate } from './components/LegalTemplate';
import { MinimalTemplate } from './components/MinimalTemplate';
import { TechTemplate } from './components/TechTemplate';
import type { CardTemplateComponent } from './types';

export const templateRegistry: Record<CardTemplate, CardTemplateComponent> = {
  corporate: CorporateTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  health: HealthTemplate,
  legal: LegalTemplate,
  tech: TechTemplate,
};
