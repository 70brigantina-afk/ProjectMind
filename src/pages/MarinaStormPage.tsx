import { useEffect, useState } from 'react';
import styles from './MarinaStormPage.module.css';

export const TELEGRAM_URL = 'https://t.me/MarinaDugina';

const BASE = import.meta.env.BASE_URL;
const IMG = (name: string) => `${BASE}marina/${name}`;

const PAGE_TITLE =
  'Навигация в шторм — бесплатная онлайн-встреча о стрессе и тревоге 9 июля';

const PAGE_DESCRIPTION =
  'Бесплатная онлайн-встреча с психологами Мариной Дугиной и Маргаритой Ипполитовой о стрессе, тревоге, кризисе и внутренней опоре. 9 июля в 19:00 МСК. Запись через Telegram.';

const OG_IMAGE = `${BASE}marina/marina-hero.jpg`;

const FOR_YOU_ITEMS = [
  'вы часто тревожитесь и не можете остановить поток мыслей',
  'чувствуете усталость, напряжение или внутренний хаос',
  'переживаете кризис, перемены или неопределённость',
  'боитесь будущего и не понимаете, на что опереться',
  'хотите снова почувствовать спокойствие и контроль над эмоциями',
  'вам важно, чтобы вас услышали без осуждения',
  'вы устали быть сильной / сильным и хотите поддержки',
  'вам нужен понятный первый шаг, а не сложные термины',
];

const MEETING_TOPICS = [
  'как стресс и кризис влияют на мысли, тело и эмоции',
  'почему тревога может усиливаться даже без явной причины',
  'как вернуть ощущение внутренней опоры',
  'как перестать ждать стабильности только снаружи и начать создавать её внутри',
  'какие простые практики помогают снизить напряжение',
  'как бережно поддержать себя в период перемен',
  'как услышать себя и не потеряться в чужих ожиданиях',
  'ответы на вопросы участников',
];

const AFTER_ITEMS = [
  'лучше понять, что с вами происходит',
  'увидеть возможные причины тревоги и напряжения',
  'получить первые практические техники самопомощи',
  'почувствовать больше ясности и поддержки',
  'понять следующий шаг для себя',
  'почувствовать, что вы не одиноки в своём состоянии',
];

const REVIEWS = [
  {
    name: 'Мария С.',
    initial: 'М',
    text: 'Замечательно, каждая встреча с вами не проходит даром и хочется всё запомнить и внедрить в свою жизнь. До сих пор пересматриваю эфиры с вами.',
  },
  {
    name: 'Наталья',
    initial: 'Н',
    text: 'Мариночка, огромная благодарность за проведённый эфир. Было подсвечено столько неочевидных моментов, на которые мы часто не обращаем внимания, а именно из них и складывается общая картина и возможное решение проблем. Благодарю за ценный эфир.',
  },
  {
    name: 'Участница встречи',
    initial: 'У',
    text: 'Спасибо вам. Мне очень понравилась практика отпускания, которую вы давали. Я адаптирую её под разные ситуации, и она очень помогает. После неё становится спокойно и легче.',
  },
  {
    name: 'Участница встречи',
    initial: 'У',
    text: 'Очень полезная информация в нужное время. Спасибо, что устраиваете такие встречи. Практики обязательно буду использовать.',
  },
  {
    name: 'Александр П.',
    initial: 'А',
    text: 'Очень понятно и доступно, на простом человеческом языке. Спасибо за полезную и важную информацию.',
  },
  {
    name: 'Анастасия С.',
    initial: 'А',
    text: 'Спасибо огромное, Марина. Я, как всегда, слушала и впитывала ваши слова как губка. Очень понятно и доступно.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Сколько стоит участие?',
    a: 'Участие бесплатное.',
  },
  {
    q: 'Кто ведёт встречу?',
    a: 'Встречу проводят два специалиста — психолог Марина Дугина и психолог, художник, специалист символдрамы Маргарита Ипполитова. Это позволит посмотреть на тему стресса и кризиса с разных сторон.',
  },
  {
    q: 'Где пройдёт встреча?',
    a: 'Онлайн, в Яндекс Телемосте. Ссылку Марина отправит участникам после записи через Telegram-канал.',
  },
  {
    q: 'Как записаться?',
    a: 'Перейдите в Telegram-канал Марины и напишите «УЧАСТВУЮ». После этого вам отправят ссылку на встречу.',
  },
  {
    q: 'Будет ли запись?',
    a: 'Запись не гарантируется. Лучше быть онлайн, чтобы получить максимум пользы, задать вопросы и забрать подарочные материалы.',
  },
  {
    q: 'Мне подойдёт встреча, если я никогда не была у психолога?',
    a: 'Да. Встреча проходит в мягком и понятном формате, без давления, оценок и сложных терминов.',
  },
  {
    q: 'Что делать после встречи?',
    a: 'Вы сможете использовать практики самостоятельно, а если почувствуете, что хотите глубже разобраться в своей ситуации, можно будет обсудить индивидуальную работу со специалистом.',
  },
];

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function usePageMeta() {
  useEffect(() => {
    document.title = PAGE_TITLE;
    setMeta('description', PAGE_DESCRIPTION);
    setMeta('og:title', PAGE_TITLE, true);
    setMeta('og:description', PAGE_DESCRIPTION, true);
    setMeta('og:type', 'website', true);
    setMeta('og:image', OG_IMAGE.startsWith('http') ? OG_IMAGE : `${window.location.origin}${OG_IMAGE}`, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', PAGE_TITLE);
    setMeta('twitter:description', PAGE_DESCRIPTION);
    setMeta('twitter:image', OG_IMAGE.startsWith('http') ? OG_IMAGE : `${window.location.origin}${OG_IMAGE}`);

    const scriptId = 'marina-storm-event-jsonld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'Навигация в шторм. Психология стресса и кризиса',
      startDate: '2026-07-09T19:00:00+03:00',
      eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'VirtualLocation',
        url: TELEGRAM_URL,
      },
      description: PAGE_DESCRIPTION,
      organizer: {
        '@type': 'Person',
        name: 'Марина Дугина',
      },
      performer: [{ '@type': 'Person', name: 'Марина Дугина' }, { '@type': 'Person', name: 'Маргарита Ипполитова' }],
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'RUB',
        availability: 'https://schema.org/InStock',
        url: TELEGRAM_URL,
      },
    });

    return () => {
      script?.remove();
    };
  }, []);
}

type MarinaImageProps = {
  src: string;
  alt: string;
  label: string;
  className?: string;
};

function MarinaImage({ src, alt, label, className }: MarinaImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`${styles.placeholder} ${className ?? ''}`} role="img" aria-label={alt}>
        <span className={styles.placeholderIcon} aria-hidden="true">
          ✦
        </span>
        <span>{label}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

type CtaProps = {
  label: string;
  hint?: string;
  micro?: string;
};

function CtaBlock({ label, hint, micro }: CtaProps) {
  return (
    <div className={styles.ctaWrap}>
      <a
        href={TELEGRAM_URL}
        className={styles.ctaBtn}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
      {hint && <p className={styles.ctaHint}>{hint}</p>}
      {micro && <p className={styles.ctaMicro}>{micro}</p>}
      <p className={styles.ctaMicro}>Участие бесплатное. Количество мест для живого общения ограничено.</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.faqItem}>
      <button
        type="button"
        className={styles.faqQuestion}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {question}
        <span className={`${styles.faqIcon} ${open ? styles.faqIconOpen : ''}`} aria-hidden="true">
          +
        </span>
      </button>
      {open && <div className={styles.faqAnswer}>{answer}</div>}
    </div>
  );
}

export function MarinaStormPage() {
  usePageMeta();

  return (
    <div className={styles.page}>
      {/* 1. Hero */}
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>Бесплатная онлайн-встреча</span>
            <h1 className={styles.heroTitle}>
              Навигация в шторм: как справляться со стрессом и кризисом, когда внутри всё
              нестабильно
            </h1>
            <p className={styles.heroSubtitle}>
              Бесплатная онлайн-встреча с двумя психологами — Мариной Дугиной и Маргаритой
              Ипполитовой. Поговорим о тревоге, стрессе, внутренней опоре и способах вернуть себе
              спокойствие в непростое время.
            </p>
            <div className={styles.facts}>
              <span className={styles.fact}>
                <span className={styles.factIcon} aria-hidden="true">
                  📅
                </span>
                9 июля 2026
              </span>
              <span className={styles.fact}>
                <span className={styles.factIcon} aria-hidden="true">
                  🕖
                </span>
                19:00 МСК
              </span>
              <span className={styles.fact}>
                <span className={styles.factIcon} aria-hidden="true">
                  💻
                </span>
                Онлайн, Яндекс Телемост
              </span>
              <span className={styles.fact}>
                <span className={styles.factIcon} aria-hidden="true">
                  ✨
                </span>
                Бесплатно
              </span>
              <span className={styles.fact}>
                <span className={styles.factIcon} aria-hidden="true">
                  👥
                </span>
                2 психолога в эфире
              </span>
            </div>
            <CtaBlock
              label="Записаться через Telegram"
              hint='Перейдите в Telegram-канал и напишите «УЧАСТВУЮ». Марина пришлёт ссылку на встречу.'
              micro="Без давления и навязывания"
            />
            <p className={styles.heroTrust}>
              Здесь вас услышат, примут и поймут. Без давления, оценок и навязывания.
            </p>
          </div>
          <div className={styles.heroImageWrap}>
            <MarinaImage
              src={IMG('marina-hero.jpg')}
              alt="Марина Дугина — психолог"
              label="Фото: marina-hero.jpg"
            />
          </div>
        </div>
      </section>

      {/* 2. For you */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Эта встреча для вас, если…</h2>
          <div className={styles.cardGrid}>
            {FOR_YOU_ITEMS.map((item) => (
              <div key={item} className={styles.card}>
                <div className={styles.cardIcon} aria-hidden="true">
                  ○
                </div>
                <p className={styles.cardText}>{item}</p>
              </div>
            ))}
          </div>
          <CtaBlock
            label="Написать «УЧАСТВУЮ»"
            micro="Можно прийти, даже если вы раньше не были у психолога"
          />
        </div>
      </section>

      {/* 3. What we'll discuss */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Что разберём на встрече</h2>
          <p className={styles.sectionIntro}>
            Встречу ведут два специалиста, чтобы участники могли увидеть тему стресса и кризиса с
            разных сторон: через психологию, работу с внутренними состояниями, ресурс, тело,
            эмоции, образ и личные смыслы.
          </p>
          <div className={styles.listGrid}>
            {MEETING_TOPICS.map((topic, i) => (
              <div key={topic} className={styles.listItem}>
                <span className={styles.listBullet}>{i + 1}</span>
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. After meeting */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>После встречи вы сможете</h2>
          <div className={styles.listGrid}>
            {AFTER_ITEMS.map((item) => (
              <div key={item} className={styles.listItem}>
                <span className={styles.listBullet} aria-hidden="true">
                  ✓
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Gift */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Подарок за регистрацию</h2>
          <div className={styles.giftBox}>
            <p className={styles.giftTitle}>После регистрации участники получат чек-лист:</p>
            <p className={styles.giftChecklist}>
              «10 практических техник, которые помогут вернуть контроль над эмоциями и снизить
              уровень стресса».
            </p>
            <p className={styles.giftExtra}>
              А для тех, кто останется до конца встречи, ведущие подготовят дополнительный подарок
              — практический материал для самостоятельной работы после эфира.
            </p>
            <p className={styles.giftNote}>
              Запись встречи не гарантируется, поэтому лучше быть онлайн, чтобы получить максимум
              пользы, задать вопросы и забрать подарочные материалы.
            </p>
          </div>
          <CtaBlock
            label="Получить доступ к встрече"
            micro="Подарок после регистрации"
          />
        </div>
      </section>

      {/* 6. Speakers */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Ведущие встречи</h2>
          <div className={styles.speakerGrid}>
            <article className={styles.speakerCard}>
              <div className={styles.speakerPhoto}>
                <MarinaImage
                  src={IMG('marina-about.jpg')}
                  alt="Марина Дугина"
                  label="Фото: marina-about.jpg"
                />
              </div>
              <div className={styles.speakerBody}>
                <h3 className={styles.speakerName}>Марина Дугина</h3>
                <p className={styles.speakerRole}>Психолог</p>
                <p className={styles.speakerText}>
                  Марина помогает людям справляться со стрессом, тревогой, кризисами и сложными
                  жизненными ситуациями. В работе соединяет психологическое образование,
                  практический опыт сопровождения людей и умение видеть причинно-следственные связи
                  в том, что происходит с человеком.
                </p>
                <ul className={styles.speakerFacts}>
                  <li>психолог-консультант</li>
                  <li>диплом о профессиональной переподготовке, 1200 часов</li>
                  <li>17 лет службы в МВД</li>
                  <li>с 2021 года — куратор по мышлению в Академии личных финансов</li>
                  <li>с конца 2025 года — личная психологическая практика</li>
                  <li>
                    работает с тревогой, самооценкой, отношениями, кризисами и эмоциональным
                    напряжением
                  </li>
                </ul>
                <p className={styles.speakerQuote}>
                  Марина не давит и не навязывает решения. Её задача — помочь человеку увидеть
                  ситуацию яснее, найти внутреннюю опору и двигаться в своём темпе.
                </p>
              </div>
            </article>

            <article className={styles.speakerCard}>
              <div className={styles.speakerPhoto}>
                <MarinaImage
                  src={IMG('margarita.jpg')}
                  alt="Маргарита Ипполитова"
                  label="Фото: margarita.jpg"
                />
              </div>
              <div className={styles.speakerBody}>
                <h3 className={styles.speakerName}>Маргарита Ипполитова</h3>
                <p className={styles.speakerRole}>Психолог, художник, специалист символдрамы</p>
                <p className={styles.speakerText}>
                  Маргарита соединяет психологию, творчество, арт-терапевтический подход и практики
                  работы с внутренним ресурсом. В своей работе помогает людям возвращать контакт с
                  собой, чувствовать больше целостности, силы и смысла.
                </p>
                <ul className={styles.speakerFacts}>
                  <li>психолог</li>
                  <li>художник</li>
                  <li>сертифицированный специалист символдрамы</li>
                  <li>
                    обучалась в Академии репарационной психологии и терапии Анны Черниговой IARPT
                  </li>
                  <li>
                    работает через психологию, творчество, образ, внутренний ресурс и связь с
                    природой
                  </li>
                  <li>ведёт женский клуб «Рождённая ветром»</li>
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 7. Education */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Образование и подтверждение экспертности</h2>
          <div className={styles.eduGrid}>
            <div className={styles.eduText}>
              <p>
                Марина Дугина — психолог-консультант с дипломом о профессиональной переподготовке
                (1200 часов). Обучение включало консультативную психологию, кризисную помощь,
                психологию семьи, психодиагностику и клиническую психологию.
              </p>
              <p>
                На бесплатной встрече вы получите поддержку в кризисе, практические техники
                самопомощи и инструменты для работы со стрессом и тревогой — мягко и без давления.
              </p>
              <div className={styles.eduTags}>
                <span className={styles.eduTag}>консультативная психология</span>
                <span className={styles.eduTag}>кризисная помощь</span>
                <span className={styles.eduTag}>психология семьи</span>
                <span className={styles.eduTag}>психодиагностика</span>
                <span className={styles.eduTag}>клиническая психология</span>
              </div>
            </div>
            <div className={styles.eduImages}>
              <div className={styles.eduImage}>
                <MarinaImage
                  src={IMG('diploma.jpg')}
                  alt="Диплом психолога-консультанта"
                  label="Фото: diploma.jpg"
                />
              </div>
              <div className={styles.eduImage}>
                <MarinaImage
                  src={IMG('diploma-details.jpg')}
                  alt="Программа обучения"
                  label="Фото: diploma-details.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Reviews */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Что говорят участники встреч</h2>
          <p className={styles.sectionIntro}>
            Живые отклики людей, которые уже были на встречах.
          </p>
          <div className={styles.reviewsGrid}>
            {REVIEWS.map((review) => (
              <blockquote key={review.name + review.text.slice(0, 20)} className={styles.reviewCard}>
                <p className={styles.reviewQuote}>{review.text}</p>
                <footer className={styles.reviewAuthor}>
                  <span className={styles.reviewAvatar} aria-hidden="true">
                    {review.initial}
                  </span>
                  <cite className={styles.reviewName}>{review.name}</cite>
                </footer>
              </blockquote>
            ))}
          </div>
          <CtaBlock
            label="Перейти в Telegram-канал"
            hint="Встреча проходит онлайн"
          />
        </div>
      </section>

      {/* 9. How to register */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Как попасть на встречу</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNum}>1</span>
              <span className={styles.stepText}>Перейдите в Telegram-канал Марины</span>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>2</span>
              <span className={styles.stepText}>Напишите «УЧАСТВУЮ»</span>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>3</span>
              <span className={styles.stepText}>
                Получите ссылку на встречу в Яндекс Телемост
              </span>
            </div>
          </div>
          <CtaBlock label="Перейти в Telegram-канал" />
        </div>
      </section>

      {/* 10. FAQ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Частые вопросы</h2>
          <div className={styles.faqList}>
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.q} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* 11. Final CTA */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <h2 className={styles.finalCtaTitle}>
            Если внутри сейчас шторм — не обязательно проходить через него в одиночку
          </h2>
          <p className={styles.finalCtaText}>
            Приходите на бесплатную встречу. Это безопасное пространство, где можно получить
            поддержку, ясность и первые практические инструменты для себя.
          </p>
          <CtaBlock
            label="Записаться через Telegram"
            micro="Бесплатная онлайн-встреча с психологом"
          />
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>Навигация в шторм · 9 июля 2026 · Бесплатная онлайн-встреча</p>
        </div>
      </footer>
    </div>
  );
}
