/* Goal bank for the therapist's intervention plan. Each long-term goal holds short-term goals the
 * therapist can select for the learner. Goals follow what جملة practises and measures: repetition of
 * 2–6 word sentences, comprehension (matching picture from four), expression (the adult marks each
 * word said), the missing-card game, the word rhythm row, and the eight sentence structures per length. 80% is the user's achievement criterion,
 * not a published norm. Sources are listed below and in docs/intervention-goals.md. */
((root) => {
    'use strict';
    // This app: name for the report, therapist-mode key, and its progress store.
    const APP = { id: 'senb', name: 'جملة', therapistKey: 'sentences-builder-therapist', unlocksLevels: false, progress: () => root.SenbProgress };
    const SOURCES = {
        'asha-sld': {
            label: 'ASHA Practice Portal: Spoken Language Disorders',
            url: 'https://www.asha.org/practice-portal/clinical-topics/spoken-language-disorders/',
            note: 'Morphology and syntax targets: "Facilitating the acquisition and use of age-appropriate morphemes", "Increasing sentence length and complexity", "Increasing use of varied sentence types", "Improving the ability to understand and formulate more complex sentence structures" and "Judging the correctness of grammar"; carryover "beyond the treatment setting".'
        },
        'asha-lle': {
            label: 'ASHA Practice Portal: Late Language Emergence',
            url: 'https://www.asha.org/practice-portal/clinical-topics/late-language-emergence/',
            note: 'Treatment includes "providing spoken language models for the child" and "imitating or expanding the child\'s actions or words".'
        },
        'asha-ssd': {
            label: 'ASHA Practice Portal: Speech Sound Disorders: Articulation and Phonology',
            url: 'https://www.asha.org/practice-portal/clinical-topics/articulation-and-phonology/',
            note: 'Phonological awareness tasks include "segmentation and blending at the word, onset–rime, syllable, and phonemic levels".'
        },
        'cleave-2015': {
            label: 'Cleave, P. L., Becker, S. D., Curran, M. K., Owen Van Horne, A. J., & Fey, M. E. (2015). The efficacy of recasts in language intervention: A systematic review and meta-analysis. American Journal of Speech-Language Pathology, 24(2), 237–255.',
            url: 'https://doi.org/10.1044/2015_AJSLP-14-0105',
            note: 'Recasts (repeating the child\'s utterance in a corrected or expanded form) supported grammatical gains; average effects .96 (proximal) and .76 (distal); evidence quality varied.'
        }
    };

    const GOALS = [
        {
            id: 'L1', title: 'فهم الجمل',
            text: 'يفهم الطفل الجملة التي يسمعها ويختار صورتها.',
            sources: ['asha-sld'],
            short: [
                { id: 'S1.1', text: 'يختار صورة جملة من كلمتين (من 4 صور).', where: 'اختبار الطفل · الفهم · كلمتان' },
                { id: 'S1.2', text: 'يختار صورة جملة من 3 كلمات (من 4 صور).', where: 'اختبار الطفل · الفهم · 3 كلمات' },
                { id: 'S1.3', text: 'يختار صورة جملة من 4 كلمات (من 4 صور).', where: 'اختبار الطفل · الفهم · 4 كلمات' },
                { id: 'S1.4', text: 'يختار صورة جملة من 5 أو 6 كلمات (من 4 صور).', where: 'اختبار الطفل · الفهم · 5–6 كلمات' },
                { id: 'S1.5', text: 'يختار صورة جملة فيها مكان: «الولد عالكرسي».', where: 'الفهم · مجموعة «حرف جر + اسم مكان»' }
            ]
        },
        {
            id: 'L2', title: 'قول الجمل',
            text: 'يقول الطفل جملاً أطول: بعد النموذج أولاً، ثم وحده.',
            sources: ['asha-lle', 'asha-sld'],
            short: [
                { id: 'S2.1', text: 'يكرّر جملة من كلمتين بعد سماعها.', where: 'مهام التكرار · كلمتان' },
                { id: 'S2.2', text: 'يكرّر جملة من 3 أو 4 كلمات بعد سماعها.', where: 'مهام التكرار · 3–4 كلمات' },
                { id: 'S2.3', text: 'يكرّر جملة من 5 أو 6 كلمات بعد سماعها.', where: 'مهام التكرار · 5–6 كلمات' },
                { id: 'S2.4', text: 'يصف الصورة وحده بكلمتين: «ولد ياكل».', where: 'اختبار الطفل · التعبير · كلمتان' },
                { id: 'S2.5', text: 'يصف الصورة وحده بثلاث كلمات: «ولد ياكل تفاحة».', where: 'اختبار الطفل · التعبير · 3 كلمات' },
                { id: 'S2.6', text: 'يصف الصورة وحده بأربع كلمات أو أكثر.', where: 'اختبار الطفل · التعبير · 4–6 كلمات' }
            ]
        },
        {
            id: 'L3', title: 'القواعد',
            text: 'يستعمل الطفل الفعل والصفة والضمير وحروف الجر بشكل صحيح.',
            sources: ['asha-sld', 'cleave-2015'],
            short: [
                { id: 'S3.1', text: 'يقول الفعل الماضي: «أكل، شرب».', where: 'مجموعات «فعل ماضي»' },
                { id: 'S3.2', text: 'يقول المستقبل: «بدّو ياكل».', where: 'مجموعات «فعل مستقبل»' },
                { id: 'S3.3', text: 'يطابق الفعل مع الفاعل: «هو ياكل، هي تاكل».', where: 'لوحة بناء الجمل · ضمائر وأفعال' },
                { id: 'S3.4', text: 'يطابق الصفة مع الاسم: «ولد صغير، بنت صغيرة».', where: 'مجموعات «اسم + صفة»' },
                { id: 'S3.5', text: 'يستعمل حرف الجر مع المكان: «على الطاولة».', where: 'مجموعات «حرف جر + اسم مكان»' },
                { id: 'S3.6', text: 'يربط كلمتين بـ«و»: «ولد وبنت».', where: 'مجموعات «حرف عطف»' },
                { id: 'S3.7', text: 'يعبّر عن الملكية: «كتاب الولد، كتابي».', where: 'مجموعات «مضاف + مضاف إليه» و«ملكية»' },
                { id: 'S3.8', text: 'يختار البطاقة الناقصة في الجملة (من 3 بطاقات).', where: 'لعبة البطاقة الناقصة' }
            ]
        },
        {
            id: 'L4', title: 'كلمات الجملة',
            text: 'يعرف الطفل أن الجملة كلمات، ويعدّها بالإيقاع.',
            sources: ['asha-ssd'],
            short: [
                { id: 'S4.1', text: 'يضغط دائرة لكل كلمة في جملة من 2 أو 3 كلمات.', where: 'لوحة بناء الجمل · صف الإيقاع' },
                { id: 'S4.2', text: 'يضغط دائرة لكل كلمة في جملة من 4 إلى 6 كلمات.', where: 'لوحة بناء الجمل · صف الإيقاع' }
            ]
        },
        {
            id: 'L5', title: 'الأسئلة',
            text: 'يجيب الطفل عن «مين، شو، وين، إيمتى» ويسأل بنفسه.',
            sources: ['asha-sld'],
            short: [
                { id: 'S5.1', text: 'يجيب عن «مين؟» و«شو عم يعمل؟».', where: 'لوحة بناء الجمل' },
                { id: 'S5.2', text: 'يجيب عن «وين؟» و«إيمتى؟».', where: 'مجموعات المكان والزمان' },
                { id: 'S5.3', text: 'يسأل سؤالاً: «شو هاد؟ وين الطابة؟».', where: 'فئة الأسئلة · لوحة بناء الجمل' }
            ]
        },
        {
            id: 'L6', title: 'الاستعمال اليومي',
            text: 'يستعمل الطفل جمله الجديدة خارج الجلسة ولا ينساها.',
            sources: ['asha-sld', 'cleave-2015'],
            short: [
                { id: 'S6.1', text: 'يصف صوراً جديدة من كتاب أو صور العائلة.', where: 'خارج التطبيق' },
                { id: 'S6.2', text: 'يقول جمله الجديدة في البيت (حسب الأهل).', where: 'رسالة الأهل' },
                { id: 'S6.3', text: 'يتذكّر جمله بعد أسبوعين بدون تدريب.', where: 'اختبار الطفل' }
            ]
        }
    ];

    // Ready-made plans: one tap adds their short-term goals to the child's plan.
    const PLANS = [
        { id: 'P1', title: 'بداية', text: 'جمل من كلمتين', goals: ["S1.1", "S2.1", "S2.4", "S4.1"] },
        { id: 'P2', title: 'متوسط', text: 'جمل من 3–4 كلمات والقواعد الأولى', goals: ["S1.2", "S1.3", "S2.2", "S2.5", "S3.3", "S3.4", "S3.8"] },
        { id: 'P3', title: 'متقدم', text: 'جمل طويلة وأسئلة واستعمال يومي', goals: ["S1.4", "S2.3", "S2.6", "S3.1", "S3.2", "S5.1", "S6.2"] }
    ];
    const LEVELS = [20, 40, 60, 80];
    const ACHIEVED = 80;
    const byId = new Map(GOALS.flatMap(goal => goal.short.map(item => [item.id, { ...item, long: goal }])));
    const api = { APP, SOURCES, GOALS, PLANS, LEVELS, ACHIEVED, short: id => byId.get(id) || null };
    if (typeof module !== 'undefined') module.exports = api;
    root.InterventionGoals = api;
})(globalThis);
