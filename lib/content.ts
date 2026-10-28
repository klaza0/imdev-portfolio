import { siFirebase, siKotlin, siNextdotjs, siNodedotjs, siReact, siSupabase } from "simple-icons";

export type Lang = "ar" | "en";

/** Everything you will want to change lives in this file. */
export const site = {
  brand: "IMDEV",
  /** Put your own photo in /public and set the path, e.g. "/hero/portrait.webp". */
  portrait: "/hero/portrait.webp" as string | null,
  contact: {
    phoneHref: "tel:+201064636417",
    phoneDisplay: "+20 106 463 6417",
    whatsapp: "https://wa.me/201064636417",
    email: "imontaser6@gmail.com",
  },
  /** One tile per brand letter. `tone` picks the tile finish. */
  letters: [
    { letter: "I", tone: "blue" },
    { letter: "M", tone: "blue" },
    { letter: "D", tone: "black" },
    { letter: "E", tone: "black" },
    { letter: "V", tone: "black" },
  ] as { letter: string; tone: "blue" | "black" }[],
  /** Indexes of the two letters that become the "what?" and "how?" tiles. */
  questionLetters: [0, 1] as [number, number],
  /** `color` is the tile, `fg` the logo. Logos come from the simple-icons package. */
  technologies: [
    { label: "Next.js", icon: siNextdotjs.path, color: "#171719", fg: "#ffffff" },
    { label: "React", icon: siReact.path, color: "#1b2b34", fg: "#61dafb" },
    { label: "Kotlin", icon: siKotlin.path, color: "#7f52ff", fg: "#ffffff" },
    { label: "Node.js", icon: siNodedotjs.path, color: "#3c873a", fg: "#ffffff" },
    { label: "Supabase", icon: siSupabase.path, color: "#1c1c1c", fg: "#3ecf8e" },
    { label: "Firebase", icon: siFirebase.path, color: "#f57c00", fg: "#ffffff" },
  ],
};

export type IntroToken =
  | { kind: "text"; value: string }
  | { kind: "brand" }
  | { kind: "tile"; index: 0 | 1 | 2 | 3 };

const ar = {
  meta: {
    title: `${site.brand} — برمجيات وأنظمة رقمية تُبنى حول أعمالك`,
    description: "مواقع وتطبيقات وأنظمة رقمية تشتغل معاك وتكبر بيك.",
  },
  skip: "انتقل إلى المحتوى",
  home: `${site.brand} — الرئيسية`,
  switchLabel: "Switch to English",
  switchShort: "EN",
  switchHref: "/en",
  nav: [
    { key: "services", label: "حلولنا", href: "#identity" },
    { key: "work", label: "أدواتنا", href: "#tools" },
    { key: "process", label: "كيف نعمل", href: "#approach" },
    { key: "about", label: site.brand, href: "#main" },
    { key: "contact", label: "كلّمني", href: "#why-wait" },
  ],
  mainNav: "القائمة الرئيسية",
  hero: {
    label: "إبراهيم منتصر",
    top: "إبراهيــم",
    bottom: "منتصــر",
    cta: "ابدأ مشروعك",
    portraitAlt: "إبراهيم منتصر",
  },
  folders: {
    region: "من أعمالنا، وإلى فكرتك",
    toolsTitle: "الأدوات اللي ببني بيها.",
    open: "فتح",
    close: "إغلاق",
    files: "ملفات",
    contents: "محتويات",
    items: [
      {
        label: "المشاريع",
        meta: "افتح الفولدر. شوف التفاصيل.",
        files: [
          { name: "IM Notes", meta: "Android", href: "#why-wait", image: "/work/im-notes.webp" },
          { name: "القرآن الكريم", meta: "Android", href: "#why-wait", image: "/work/quran.webp" },
          { name: "IM Store", meta: "Next.js", href: "https://www.im-store.online", image: "/work/im-store.webp" },
          { name: "دعوتي", meta: "Next.js", href: "#why-wait", image: "/work/da3waty.webp" },
        ],
      },
      {
        label: "شركاء النجاح",
        meta: "ثقة بتتبني، مشروع ورا مشروع.",
        files: [
          { name: "دعوتي", meta: "منصة دعوات", href: "#why-wait", image: "/work/da3waty.webp" },
          { name: "Google Play Console", meta: "نشر التطبيقات", href: "#why-wait", image: "/work/play-console.webp" },
          { name: "الصافي", meta: "هوية بصرية", href: "#why-wait", image: "/work/elsafy.webp" },
        ],
      },
      {
        label: "عندك فكرة؟",
        meta: "ابدأ مشروعك معنا.",
        files: [
          { name: "ابدأ مشروعك", meta: "احكِ لنا فكرتك", href: "#why-wait" },
          { name: "اكتشف الحلول", meta: "مساحة للاحتمالات", href: "#identity" },
        ],
      },
    ],
  },
  story: {
    intro: [
      [
        { kind: "text", value: "في" },
        { kind: "brand" },
        { kind: "tile", index: 0 },
        { kind: "text", value: "بنحوّل الأفكار" },
      ],
      [
        { kind: "text", value: "لتجارب ويب" },
        { kind: "tile", index: 1 },
        { kind: "text", value: "وتطبيقات" },
        { kind: "tile", index: 2 },
        { kind: "text", value: "ذكيّة،" },
      ],
      [
        { kind: "text", value: "وأنظمة" },
        { kind: "tile", index: 3 },
        { kind: "text", value: "تشتغل معاك وتكبر بيك." },
      ],
    ] as IntroToken[][],
    tileNames: ["كود", "واجهات", "موجات الضوء", "المعدن السائل"],
    capabilitiesLabel: "من الفكرة إلى نظام متكامل",
    capabilities: [
      { title: "ويب يليق بفكرتك.", text: "مواقع ومنصات سريعة، من أول زيارة لآخر خطوة. تجربة واضحة، وتفاصيل تخلي الاستخدام أسهل." },
      { title: "كل جزء في مكانه.", text: "واجهات مترابطة وقابلة للتطوير. نرتّب التعقيد خلف الكواليس، عشان اللي قدّامك يبقى بسيط." },
      { title: "تجربة تتحسّ.", text: "تطبيقات تجمع التصميم والحركة والاستجابة، وتخلّي كل تفاعل مفهوم وطبيعي." },
      { title: "جاهز للي جاي.", text: "أنظمة وأتمتة تربط شغلك وتخفّف التكرار، ببنية تقدر تتطوّر مع احتياجك." },
    ],
    lettersLabel: `حروف ${site.brand} ومعانيها`,
    letterWords: [
      { word: "الابتكار", note: "Innovation" },
      { word: "الإتقان", note: "Mastery" },
      { word: "تطوير البرمجيات", note: "Development" },
      { word: "هندسة الحلول", note: "Engineering" },
      { word: "الرؤية الإبداعية", note: "Vision" },
    ],
    questionsLabel: "هنعمل إيه؟ وإزاي؟",
    what: { prefix: "هنعمل ", base: "إيــــــــــــه؟", label: "هنعمل إيه؟" },
    how: { prefix: "و", base: "إزاي", label: "وإزاي" },
  },
  whyWait: {
    label: "كلّمني دلوقتي",
    call: "كلّمني",
    now: "دلوقتي",
    dots: "ونحط النقط عالحروف.",
    ringOn: "شغّل الرنّة",
    ringOff: "اسكت الرنّة",
  },
  contact: {
    eyebrow: "كل حاجة حلوة بتبدأ بكلام",
    title: ["فكرتك الجايّة.", "نخلّيها حقيقــــة."],
    whatsapp: "كلمني على واتساب",
    name: "اسمك",
    namePh: "أناديك بإيه؟",
    email: "الإيميل",
    message: "احكيلي عن فكرتك",
    messagePh: "موقع، تطبيق، أو فكرة لسه محدش عملها…",
    submit: "يلا نتكلّم",
    note: "هيفتح تطبيق الإيميل برسالتك جاهزة للإرسال.",
    subject: "مشروع جديد",
  },
};

export type Dict = typeof ar;

const en: Dict = {
  meta: {
    title: `${site.brand} — Software and digital systems built around your business`,
    description: "Websites, apps and systems that work with you and grow with you.",
  },
  skip: "Skip to content",
  home: `${site.brand} — Home`,
  switchLabel: "التبديل إلى العربية",
  switchShort: "ع",
  switchHref: "/",
  nav: [
    { key: "services", label: "Solutions", href: "#identity" },
    { key: "work", label: "Tools", href: "#tools" },
    { key: "process", label: "How I work", href: "#approach" },
    { key: "about", label: site.brand, href: "#main" },
    { key: "contact", label: "Call me", href: "#why-wait" },
  ],
  mainNav: "Main navigation",
  hero: {
    label: "Ibrahim Montaser",
    top: "Ibrahim",
    bottom: "Montaser",
    cta: "Start your project",
    portraitAlt: "Ibrahim Montaser",
  },
  folders: {
    region: "Tools, projects and your next idea",
    toolsTitle: "The tools I build with.",
    open: "Open",
    close: "Close",
    files: "files",
    contents: "Contents of",
    items: [
      {
        label: "Projects",
        meta: "Open the folder. Explore the details.",
        files: [
          { name: "IM Notes", meta: "Android", href: "#why-wait", image: "/work/im-notes.webp" },
          { name: "Holy Quran", meta: "Android", href: "#why-wait", image: "/work/quran.webp" },
          { name: "IM Store", meta: "Next.js", href: "https://www.im-store.online", image: "/work/im-store.webp" },
          { name: "Da3waty", meta: "Next.js", href: "#why-wait", image: "/work/da3waty.webp" },
        ],
      },
      {
        label: "Success partners",
        meta: "Trust, built project by project.",
        files: [
          { name: "Da3waty", meta: "Invitations platform", href: "#why-wait", image: "/work/da3waty.webp" },
          { name: "Google Play Console", meta: "App publishing", href: "#why-wait", image: "/work/play-console.webp" },
          { name: "El-Safy", meta: "Brand identity", href: "#why-wait", image: "/work/elsafy.webp" },        ],
      },
      {
        label: "Got an idea?",
        meta: "Let's build it together.",
        files: [
          { name: "Start your project", meta: "Tell me your idea", href: "#why-wait" },
          { name: "Explore the possibilities", meta: "Solutions", href: "#identity" },
        ],
      },
    ],
  },
  story: {
    intro: [
      [
        { kind: "text", value: "At" },
        { kind: "brand" },
        { kind: "tile", index: 0 },
        { kind: "text", value: "I turn ideas" },
      ],
      [
        { kind: "text", value: "into websites" },
        { kind: "tile", index: 1 },
        { kind: "text", value: "and apps" },
        { kind: "tile", index: 2 },
        { kind: "text", value: "that feel right," },
      ],
      [
        { kind: "text", value: "and systems" },
        { kind: "tile", index: 3 },
        { kind: "text", value: "that work with you and grow with you." },
      ],
    ],
    tileNames: ["code", "interfaces", "light waves", "liquid metal"],
    capabilitiesLabel: "From idea to connected systems",
    capabilities: [
      { title: "A web presence that fits.", text: "Fast websites and platforms, from the first visit to the final step. Clear journeys, with every detail considered." },
      { title: "Every part connected.", text: "Interfaces that work together and evolve with you. Complexity behind the scenes, simplicity on screen." },
      { title: "An experience you feel.", text: "Apps that bring design, motion and responsiveness together. Every interaction feels natural." },
      { title: "Ready for what's next.", text: "Systems and automation that connect your work, reduce repetition and grow around your needs." },
    ],
    lettersLabel: `The meaning of ${site.brand}`,
    letterWords: [
      { word: "Innovation", note: "Fresh ideas, built differently" },
      { word: "Mastery", note: "Every detail done right" },
      { word: "Development", note: "Software, built properly" },
      { word: "Engineering", note: "Solutions designed to last" },
      { word: "Vision", note: "Creative direction from day one" },
    ],
    questionsLabel: "What will we build, and how?",
    what: { prefix: "Let’s build ", base: "What?", label: "What will we build?" },
    how: { prefix: "and ", base: "How", label: "and how" },
  },
  whyWait: {
    label: "Call me now",
    call: "Call me",
    now: "now",
    dots: "Let’s connect the dots.",
    ringOn: "Turn ringtone on",
    ringOff: "Mute ringtone",
  },
  contact: {
    eyebrow: "GOOD THINGS START WITH A CONVERSATION",
    title: ["Your next idea.", "Let’s make it real."],
    whatsapp: "Chat on WhatsApp",
    name: "Your name",
    namePh: "What should I call you?",
    email: "Email address",
    message: "Tell me about your idea",
    messagePh: "A website, an app, or something entirely new…",
    submit: "Let’s talk",
    note: "Opens your email app with your message ready to send.",
    subject: "New project",
  },
};

export const dictionaries: Record<Lang, Dict> = { ar, en };
