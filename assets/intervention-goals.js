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
            text: 'سيفهم الطفل جملاً تزداد طولاً وتعقيداً، فيختار الصورة التي تطابق الجملة المسموعة.',
            sources: ['asha-sld'],
            short: [
                { id: 'S1.1', text: 'يختار الصورة المطابقة لجملة من كلمتين من بين 4 صور بدقة 80%.', where: 'اختبار الطفل · الفهم · كلمتان' },
                { id: 'S1.2', text: 'يختار الصورة المطابقة لجملة من 3 كلمات من بين 4 صور بدقة 80%.', where: 'اختبار الطفل · الفهم · 3 كلمات' },
                { id: 'S1.3', text: 'يختار الصورة المطابقة لجملة من 4 كلمات من بين 4 صور بدقة 80%.', where: 'اختبار الطفل · الفهم · 4 كلمات' },
                { id: 'S1.4', text: 'يختار الصورة المطابقة لجملة من 5 أو 6 كلمات من بين 4 صور بدقة 80%.', where: 'اختبار الطفل · الفهم · 5–6 كلمات' },
                { id: 'S1.5', text: 'يختار الصورة المطابقة لجملة فيها حرف جر واسم مكان (مثل: الولد قاعد عالكرسي) بدقة 80%.', where: 'الفهم · مجموعة «حرف جر + اسم مكان»' }
            ]
        },
        {
            id: 'L2', title: 'تكرار الجمل وطولها',
            text: 'سيقول الطفل جملاً أطول تدريجياً، بالتكرار بعد النموذج ثم في وصف الصور.',
            sources: ['asha-lle', 'asha-sld'],
            short: [
                { id: 'S2.1', text: 'يكرّر جملة من كلمتين بعد النموذج كاملة بدقة 80%.', where: 'مهام التكرار · كلمتان' },
                { id: 'S2.2', text: 'يكرّر جملة من 3 أو 4 كلمات بعد النموذج كاملة بدقة 80%.', where: 'مهام التكرار · 3–4 كلمات' },
                { id: 'S2.3', text: 'يكرّر جملة من 5 أو 6 كلمات بعد النموذج كاملة بدقة 80%.', where: 'مهام التكرار · 5–6 كلمات' },
                { id: 'S2.4', text: 'يصف الصورة بجملة من كلمتين (فاعل + فعل) دون نموذج، بنسبة 80% من الكلمات.', where: 'اختبار الطفل · التعبير · كلمتان' },
                { id: 'S2.5', text: 'يصف الصورة بجملة من 3 كلمات (فاعل + فعل + مفعول به) دون نموذج، بنسبة 80% من الكلمات.', where: 'اختبار الطفل · التعبير · 3 كلمات' },
                { id: 'S2.6', text: 'يصف الصورة بجملة من 4 كلمات أو أكثر دون نموذج، بنسبة 80% من الكلمات.', where: 'اختبار الطفل · التعبير · 4–6 كلمات' }
            ]
        },
        {
            id: 'L3', title: 'القواعد وبناء الجملة',
            text: 'سيستخدم الطفل الصيغ النحوية والصرفية المستهدفة بشكل صحيح في جمله.',
            sources: ['asha-sld', 'cleave-2015'],
            short: [
                { id: 'S3.1', text: 'يستخدم الفعل الماضي عند وصف حدث انتهى بدقة 80%.', where: 'مجموعات «فعل ماضي»' },
                { id: 'S3.2', text: 'يستخدم صيغة المستقبل (بدّو + فعل) بدقة 80%.', where: 'مجموعات «فعل مستقبل»' },
                { id: 'S3.3', text: 'يطابق الفعل مع الفاعل في الضمير والجنس (هو ياكل، هي تاكل، أنا باكل) بدقة 80%.', where: 'لوحة بناء الجمل · ضمائر وأفعال' },
                { id: 'S3.4', text: 'يضع الصفة بعد الاسم ويطابقها معه (ولد صغير، بنت صغيرة) بدقة 80%.', where: 'مجموعات «اسم + صفة»' },
                { id: 'S3.5', text: 'يستخدم حرف الجر المناسب مع اسم المكان في جملة بدقة 80%.', where: 'مجموعات «حرف جر + اسم مكان»' },
                { id: 'S3.6', text: 'يربط اسمين أو فعلين بحرف العطف «و» في جملة بدقة 80%.', where: 'مجموعات «حرف عطف»' },
                { id: 'S3.7', text: 'يعبّر عن الملكية بالإضافة أو الضمير (كتاب الولد، كتابي) بدقة 80%.', where: 'مجموعات «مضاف + مضاف إليه» و«ملكية»' },
                { id: 'S3.8', text: 'يكمل الجملة بالبطاقة الناقصة الصحيحة من بين 3 بطاقات بدقة 80%.', where: 'لعبة البطاقة الناقصة' }
            ]
        },
        {
            id: 'L4', title: 'الوعي بكلمات الجملة',
            text: 'سيعرف الطفل أن الجملة تتكوّن من كلمات منفصلة، فيعدّها بإيقاع.',
            sources: ['asha-ssd'],
            short: [
                { id: 'S4.1', text: 'يصفّق أو يضغط دائرة لكل كلمة في جملة من 2 أو 3 كلمات بدقة 80%.', where: 'لوحة بناء الجمل · صف الإيقاع' },
                { id: 'S4.2', text: 'يصفّق أو يضغط دائرة لكل كلمة في جملة من 4 إلى 6 كلمات بدقة 80%.', where: 'لوحة بناء الجمل · صف الإيقاع' }
            ]
        },
        {
            id: 'L5', title: 'الأسئلة',
            text: 'سيجيب الطفل عن أسئلة «مين، شو، وين، إيمتى» حول الصورة، ويطرح أسئلة بنفسه.',
            sources: ['asha-sld'],
            short: [
                { id: 'S5.1', text: 'يجيب عن «مين؟» و«شو عم يعمل؟» عن الصورة بكلمة أو جملة صحيحة بدقة 80%.', where: 'لوحة بناء الجمل' },
                { id: 'S5.2', text: 'يجيب عن «وين؟» و«إيمتى؟» عن الصورة باسم مكان أو زمان صحيح بدقة 80%.', where: 'مجموعات المكان والزمان' },
                { id: 'S5.3', text: 'يطرح سؤالاً بأداة استفهام (شو، وين، مين) عن صورة في 80% من الفرص.', where: 'فئة الأسئلة · لوحة بناء الجمل' }
            ]
        },
        {
            id: 'L6', title: 'التعميم والمحافظة',
            text: 'سيستخدم الطفل الجمل التي أتقنها في الكلام اليومي ويحافظ عليها مع الوقت.',
            sources: ['asha-sld', 'cleave-2015'],
            short: [
                { id: 'S6.1', text: 'يصف صوراً جديدة من خارج التطبيق (كتاب أو صورة عائلية) بالبنية المتقنة بدقة 80%.', where: 'خارج التطبيق' },
                { id: 'S6.2', text: 'يستخدم البنية المتقنة في اللعب أو الحديث في البيت، حسب ملاحظة الأهل، في 80% من الفرص.', where: 'رسالة الأهل' },
                { id: 'S6.3', text: 'يحافظ على فهم وقول الجمل المتقنة بعد أسبوعين دون تدريب بدقة 80%.', where: 'اختبار الطفل' }
            ]
        }
    ];

    const LEVELS = [20, 40, 60, 80];
    const ACHIEVED = 80;
    const byId = new Map(GOALS.flatMap(goal => goal.short.map(item => [item.id, { ...item, long: goal }])));
    const api = { APP, SOURCES, GOALS, LEVELS, ACHIEVED, short: id => byId.get(id) || null };
    if (typeof module !== 'undefined') module.exports = api;
    root.InterventionGoals = api;
})(globalThis);
