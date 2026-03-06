export const CALL_MESSAGES: Record<string, string> = {
  'tr-TR': 'Merhaba, bu sizin zamanlanmış arama hatırlatmanızdır.',
  'en-US': 'Hello, this is your scheduled call reminder.',
  'en-GB': 'Hello, this is your scheduled call reminder.',
  'en-AU': 'Hello, this is your scheduled call reminder.',
  'en-NZ': 'Hello, this is your scheduled call reminder.',
  'de-DE': 'Hallo, dies ist Ihre geplante Anruferinnerung.',
  'fr-FR': 'Bonjour, ceci est votre rappel d\'appel programmé.',
  'es-ES': 'Hola, este es su recordatorio de llamada programada.',
  'es-MX': 'Hola, este es su recordatorio de llamada programada.',
  'it-IT': 'Ciao, questo è il promemoria della chiamata programmata.',
  'nl-NL': 'Hallo, dit is uw geplande oproepherinnering.',
  'sv-SE': 'Hej, detta är din schemalagda samtalspåminnelse.',
  'nb-NO': 'Hei, dette er din planlagte samtalepåminnelse.',
  'da-DK': 'Hej, dette er din planlagte opkaldsrundelse.',
  'pl-PL': 'Witaj, to jest przypomnienie o zaplanowanym połączeniu.',
  'pt-PT': 'Olá, este é o seu lembrete de chamada agendada.',
  'pt-BR': 'Olá, este é o seu lembrete de chamada agendada.',
  'ja-JP': 'こんにちは、予定された通話のリマインダーです。',
  'ko-KR': '안녕하세요, 예약된 통화 알림입니다.',
  'cmn-CN': '您好，这是您的预定通话提醒。',
  'hi-IN': 'नमस्ते, यह आपकी निर्धारित कॉल अनुस्मारक है।',
  'ru-RU': 'Здравствуйте, это напоминание о запланированном звонке.',
  'arb': 'مرحبا، هذا تذكير بمكالمتك المجدولة.',
  'he-IL': 'שלום, זוהי תזכורת לשיחה המתוכננת שלך.',
  'el-GR': 'Γεια σας, αυτή είναι η υπενθύμιση της προγραμματισμένης κλήσης σας.',
  'ro-RO': 'Bună ziua, aceasta este reamintirea apelului dumneavoastră programat.',
  'uk-UA': 'Вітаю, це нагадування про ваш запланований дзвінок.',
};

export function getCallMessage(language: string): string {
  return CALL_MESSAGES[language] ?? CALL_MESSAGES['en-US'];
}
