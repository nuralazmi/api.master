interface PhoneLanguageResult {
  language: string;
  voice: string;
}

const COUNTRY_CODE_MAP: Record<string, PhoneLanguageResult> = {
  '90': { language: 'tr-TR', voice: 'Polly.Filiz' },
  '1': { language: 'en-US', voice: 'Polly.Joanna' },
  '44': { language: 'en-GB', voice: 'Polly.Amy' },
  '49': { language: 'de-DE', voice: 'Polly.Vicki' },
  '33': { language: 'fr-FR', voice: 'Polly.Lea' },
  '34': { language: 'es-ES', voice: 'Polly.Lucia' },
  '39': { language: 'it-IT', voice: 'Polly.Bianca' },
  '31': { language: 'nl-NL', voice: 'Polly.Lotte' },
  '46': { language: 'sv-SE', voice: 'Polly.Astrid' },
  '47': { language: 'nb-NO', voice: 'Polly.Liv' },
  '45': { language: 'da-DK', voice: 'Polly.Naja' },
  '48': { language: 'pl-PL', voice: 'Polly.Ewa' },
  '351': { language: 'pt-PT', voice: 'Polly.Ines' },
  '55': { language: 'pt-BR', voice: 'Polly.Camila' },
  '81': { language: 'ja-JP', voice: 'Polly.Mizuki' },
  '82': { language: 'ko-KR', voice: 'Polly.Seoyeon' },
  '86': { language: 'cmn-CN', voice: 'Polly.Zhiyu' },
  '91': { language: 'hi-IN', voice: 'Polly.Aditi' },
  '7': { language: 'ru-RU', voice: 'Polly.Tatyana' },
  '966': { language: 'arb', voice: 'Polly.Zeina' },
  '971': { language: 'arb', voice: 'Polly.Zeina' },
  '972': { language: 'he-IL', voice: 'Polly.Joanna' },
  '30': { language: 'el-GR', voice: 'Polly.Joanna' },
  '40': { language: 'ro-RO', voice: 'Polly.Carmen' },
  '380': { language: 'uk-UA', voice: 'Polly.Joanna' },
  '52': { language: 'es-MX', voice: 'Polly.Mia' },
  '54': { language: 'es-ES', voice: 'Polly.Lucia' },
  '61': { language: 'en-AU', voice: 'Polly.Nicole' },
  '64': { language: 'en-NZ', voice: 'Polly.Amy' },
};

const DEFAULT_RESULT: PhoneLanguageResult = { language: 'en-US', voice: 'Polly.Joanna' };

// Sorted longest-first so we match 3-digit codes before 2- or 1-digit
const SORTED_CODES = Object.keys(COUNTRY_CODE_MAP).sort((a, b) => b.length - a.length);

export function getLanguageFromPhone(phone: string): PhoneLanguageResult {
  // Strip leading '+'
  const digits = phone.startsWith('+') ? phone.slice(1) : phone;

  for (const code of SORTED_CODES) {
    if (digits.startsWith(code)) {
      return COUNTRY_CODE_MAP[code];
    }
  }

  return DEFAULT_RESULT;
}
