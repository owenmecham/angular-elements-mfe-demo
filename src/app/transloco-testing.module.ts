import { TranslocoConfig, TranslocoTestingModule } from '@ngneat/transloco';
import en_us from '../assets/i18n/en-us.json';
import es_mx from '../assets/i18n/es-mx.json';
import fr_ca from '../assets/i18n/fr-ca.json';

export function getTranslocoModule(config: Partial<TranslocoConfig> = {}) {
  return TranslocoTestingModule.withLangs(
    {
      'en-us': en_us,
      'es-mx': es_mx,
      'fr-ca': fr_ca,
    },
    {
      availableLangs: ['en-us', 'es-mx', 'fr-ca'],
      defaultLang: 'en-us',
      ...config,
    },
  );
}
