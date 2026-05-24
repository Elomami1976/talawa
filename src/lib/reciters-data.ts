/**
 * Static data for reciter profile pages.
 * Used to generate SEO-friendly static pages with no API calls.
 */

export interface ReciterProfile {
  slug: string;
  identifier: string; // matches DEFAULT_RECITERS identifier in constants.ts
  nameEn: string;
  nameAr: string;
  countryEn: string;
  countryAr: string;
  bornEn: string;
  bornAr: string;
  styleEn: string;
  styleAr: string;
  taglineEn: string;
  taglineAr: string;
  /** Paragraphs in English. */
  bioEn: string[];
  /** Paragraphs in Arabic. */
  bioAr: string[];
}

export const RECITER_PROFILES: ReciterProfile[] = [
  {
    slug: "yasser-al-dosari",
    identifier: "ar.yasseraldossari",
    nameEn: "Yasser Al-Dosari",
    nameAr: "ياسر الدوسري",
    countryEn: "Saudi Arabia",
    countryAr: "المملكة العربية السعودية",
    bornEn: "Born 1980, Riyadh",
    bornAr: "وُلد عام 1980م في الرياض",
    styleEn: "Murattal",
    styleAr: "مرتّل",
    taglineEn:
      "Imam at the Grand Mosque in Makkah, celebrated for his deeply emotional and melodious recitation.",
    taglineAr:
      "إمامٌ بالمسجد الحرام في مكة المكرمة، اشتُهر بصوته العذب وتلاوته الخاشعة المؤثّرة.",
    bioEn: [
      "Sheikh Yasser bin Rashid Al-Dosari is a Saudi imam, reciter and scholar of Sharia. He was born in Riyadh in 1980 and grew up in a family devoted to learning and worship.",
      "He memorized the Holy Quran at a young age and went on to study at the Imam Muhammad ibn Saud Islamic University in Riyadh, where he earned his PhD in Sharia. He has served as an imam in several major mosques in the Kingdom of Saudi Arabia.",
      "In 2020, he was officially appointed as one of the imams of the Grand Mosque (Al-Masjid Al-Haram) in Makkah, where his Tarawih and Witr prayers during Ramadan are followed by millions of Muslims around the world.",
      "His recitation is recognized for its gentle tone, perfect tajweed, and the heartfelt humility it carries, often moving listeners to tears.",
    ],
    bioAr: [
      "الشيخ ياسر بن راشد الدوسري إمامٌ وقارئٌ سعوديٌّ وعالمٌ شرعي، وُلد بمدينة الرياض عام 1980م، ونشأ في بيتٍ يحبّ العلم والعبادة.",
      "حفظ القرآن الكريم في سنٍّ مبكرة، ثم التحق بجامعة الإمام محمد بن سعود الإسلامية في الرياض حيث نال درجة الدكتوراه في الشريعة، وقد أَمَّ المصلين في عددٍ من كبرى المساجد بالمملكة العربية السعودية.",
      "في عام 2020م صدر الأمر الملكي بتعيينه إماماً للمسجد الحرام بمكة المكرمة، فأصبحت صلاتاه التراويح والقيام في رمضان يتابعها الملايين من المسلمين حول العالم.",
      "يتميّز صوته برِقّةٍ نادرة، وإتقانٍ تامٍّ لأحكام التجويد، وخشوعٍ صادقٍ يَنفُذ إلى القلوب ويُحرّك المشاعر.",
    ],
  },
  {
    slug: "maher-al-muaiqly",
    identifier: "ar.mahermuaiqly",
    nameEn: "Maher Al-Muaiqly",
    nameAr: "ماهر المعيقلي",
    countryEn: "Saudi Arabia",
    countryAr: "المملكة العربية السعودية",
    bornEn: "Born 1969, Medina",
    bornAr: "وُلد عام 1969م في المدينة المنورة",
    styleEn: "Murattal",
    styleAr: "مرتّل",
    taglineEn:
      "Imam at the Grand Mosque in Makkah and professor of Quranic Studies, known for his calm and refined recitation.",
    taglineAr:
      "إمامٌ بالمسجد الحرام وأستاذٌ جامعيٌّ في علوم القرآن، اشتُهر بهدوء صوته ودقّة تلاوته.",
    bioEn: [
      "Sheikh Maher bin Hamad Al-Muaiqly is a renowned Saudi reciter, scholar and university professor. He was born in Medina in 1969 and memorized the Quran in his youth.",
      "He earned a PhD in Quranic Studies from Umm Al-Qura University in Makkah, where he serves as a faculty member. He has also taught and led prayers in several historic mosques in Medina and Makkah.",
      "He was appointed as an imam of the Grand Mosque in Makkah in 2007, and later also as an imam of the Prophet's Mosque (Al-Masjid An-Nabawi) in Medina, a rare honor of leading prayers in both holy sanctuaries.",
      "His recitation is characterized by clarity, composure, precise tajweed and a remarkable spiritual presence that has made him one of the most beloved voices of the Quran today.",
    ],
    bioAr: [
      "الشيخ ماهر بن حمد المعيقلي قارئٌ وعالمٌ وأستاذٌ جامعيٌّ سعودي، وُلد بالمدينة المنورة عام 1969م، وحفظ القرآن الكريم في صِغره.",
      "نال درجة الدكتوراه في الدراسات القرآنية من جامعة أم القرى بمكة المكرمة، حيث يعمل عضواً في هيئة التدريس، وقد أَمَّ المصلين ودرَّس في عددٍ من المساجد العريقة بمكة والمدينة.",
      "عُيّن إماماً للمسجد الحرام بمكة المكرمة عام 1428هـ (2007م)، ثم اختير لاحقاً إماماً للمسجد النبوي الشريف بالمدينة المنورة، فجمع له شرف الإمامة في الحرمين الشريفين.",
      "يتميّز صوته بالوضوح والهدوء، وإتقانٍ بالغ في التجويد، وروحانيةٍ نادرة جعلت تلاوته من أحبّ تلاوات القرآن إلى قلوب المسلمين في عصرنا الحاضر.",
    ],
  },
  {
    slug: "saad-al-ghamdi",
    identifier: "ar.saadalghamdi",
    nameEn: "Saad Al-Ghamdi",
    nameAr: "سعد الغامدي",
    countryEn: "Saudi Arabia",
    countryAr: "المملكة العربية السعودية",
    bornEn: "Born 1967, Dammam",
    bornAr: "وُلد عام 1967م في الدمام",
    styleEn: "Murattal",
    styleAr: "مرتّل",
    taglineEn:
      "Beloved Saudi reciter whose complete Mushaf recording has become a household favorite around the world.",
    taglineAr:
      "قارئٌ سعوديٌّ محبوب، انتشرت تلاوته للمصحف كاملاً في بيوت المسلمين حول العالم.",
    bioEn: [
      "Sheikh Saad bin Saeed Al-Ghamdi is a celebrated Saudi reciter, born in Dammam in 1967. He memorized the Quran at an early age and pursued Islamic studies in Saudi Arabia.",
      "He has served as an imam and khatib in mosques in the Eastern Province of Saudi Arabia, and is known across the Muslim world primarily through his complete Mushaf recording in Hafs an Asim.",
      "His Murattal recitation is gentle, deliberate and easy to follow, which has made it a favorite for memorizers (huffaz) and learners of the Quran of all ages.",
      "Sheikh Saad Al-Ghamdi is also known for his recordings of supplications, especially the Qunoot of Witr in Ramadan, which are widely shared each year.",
    ],
    bioAr: [
      "الشيخ سعد بن سعيد الغامدي قارئٌ سعوديٌّ شهير، وُلد بمدينة الدمام عام 1967م، وحفظ القرآن الكريم في سنٍّ مبكرة، ثم درس العلوم الشرعية في المملكة العربية السعودية.",
      "أَمَّ المصلين وخطب الجمعة في عددٍ من مساجد المنطقة الشرقية، وذاع صيته في العالم الإسلامي خاصةً بعد تسجيله للمصحف الشريف كاملاً برواية حفصٍ عن عاصم.",
      "تمتاز تلاوته المرتّلة بالرِّقّة والهدوء وسهولة المتابعة، فأصبحت من أحبّ التلاوات لدى حُفّاظ القرآن والمبتدئين في تعلّمه على حدٍّ سواء.",
      "اشتُهر الشيخ سعد الغامدي أيضاً بأدعيته المسجَّلة، خصوصاً دعاء القنوت في رمضان، الذي يتداوله الناس في شتى أنحاء العالم الإسلامي كلّ عام.",
    ],
  },
  {
    slug: "abu-baker-ash-shaatree",
    identifier: "ar.shaatree",
    nameEn: "Abu Baker Ash-Shaatree",
    nameAr: "أبو بكر الشاطري",
    countryEn: "Saudi Arabia",
    countryAr: "المملكة العربية السعودية",
    bornEn: "Born 1970, Jeddah",
    bornAr: "وُلد عام 1970م في جدة",
    styleEn: "Murattal",
    styleAr: "مرتّل",
    taglineEn:
      "Saudi imam and reciter from Jeddah, admired for his moving and tender voice.",
    taglineAr:
      "إمامٌ وقارئٌ سعوديٌّ من مدينة جدة، اشتُهر بصوته المؤثّر العذب.",
    bioEn: [
      "Sheikh Abu Bakr bin Ali Ash-Shatri (often spelled Ash-Shaatree) is a Saudi imam and Quran reciter, born in Jeddah in 1970 to a family with deep roots in Quranic learning.",
      "He memorized the Quran at a young age and went on to study Islamic sciences. He has led prayers as imam in several mosques, including during Tarawih and Qiyam in Ramadan, in Saudi Arabia and abroad.",
      "His recitation is known for its rich melody, deep emotional weight, and excellent observance of tajweed rules, which earned him a global audience early in his career.",
      "Sheikh Abu Bakr Ash-Shaatree has recorded the complete Mushaf and many supplications, and his voice remains among the most recognized in modern Quran recitation.",
    ],
    bioAr: [
      "الشيخ أبو بكر بن علي الشاطري إمامٌ وقارئٌ سعودي، وُلد بمدينة جدة عام 1970م في أسرةٍ ذات جذورٍ راسخةٍ في تعليم القرآن الكريم.",
      "حفظ القرآن الكريم منذ صغره، ثم تابع دراسة العلوم الشرعية، وأَمَّ المصلين في عددٍ من المساجد بالمملكة العربية السعودية وخارجها، خاصةً في صلاتي التراويح والقيام برمضان.",
      "تتميّز تلاوته بحلاوة اللحن وعمق التأثير ودقّة تطبيق أحكام التجويد، فاكتسب جمهوراً عريضاً في مختلف أنحاء العالم الإسلامي منذ بداياته.",
      "سجّل الشيخ أبو بكر الشاطري المصحف الشريف كاملاً، إضافةً إلى عددٍ من الأدعية والمناجاة، وما زال صوته من أكثر الأصوات تأثيراً وانتشاراً في تلاوات هذا العصر.",
    ],
  },
  {
    slug: "mohamed-siddiq-al-minshawi",
    identifier: "ar.minshawi",
    nameEn: "Mohamed Siddiq Al-Minshawi",
    nameAr: "محمد صديق المنشاوي",
    countryEn: "Egypt",
    countryAr: "جمهورية مصر العربية",
    bornEn: "1920 – 1969, Al-Minshah, Sohag",
    bornAr: "1920م – 1969م، المنشاة، سوهاج",
    styleEn: "Murattal & Mujawwad",
    styleAr: "مرتّل ومجوّد",
    taglineEn:
      "Egyptian master of Quran recitation, an icon of khushū' (humility) whose voice has touched generations of Muslims.",
    taglineAr:
      "إمامٌ من أئمة قُرّاء القرآن في مصر، ورمزٌ من رموز الخشوع، يَنفُذ صوته إلى قلوب المسلمين جيلاً بعد جيل.",
    bioEn: [
      "Sheikh Mohamed Siddiq Al-Minshawi was born in 1920 in the village of Al-Minshah in Sohag Governorate, Upper Egypt, into a family famous for Quranic recitation. His father, Sheikh Siddiq Al-Minshawi, was himself a respected reciter.",
      "He memorized the Quran by the age of eight and studied the ten Qira'at (modes of recitation). He began his public recitation career in the 1950s and quickly rose to prominence in Egypt and across the Arab and Muslim world.",
      "He recorded the complete Mushaf in both Murattal and Mujawwad styles. His Mujawwad recitations, in particular, are widely considered to be among the most spiritually moving ever recorded.",
      "Sheikh Al-Minshawi passed away in 1969 at the age of 49, but his recordings continue to be cherished as a timeless treasure of the Islamic world.",
    ],
    bioAr: [
      "وُلد الشيخ محمد صديق المنشاوي عام 1920م بقرية المنشاة في محافظة سوهاج بصعيد مصر، في أسرةٍ مشهورةٍ بتلاوة القرآن الكريم، فوالده الشيخ صديق المنشاوي كان قارئاً ذائع الصِّيت.",
      "حفظ القرآن الكريم وهو في الثامنة من عمره، ودرس القراءات العشر، وبدأ مسيرته الإذاعية في خمسينيات القرن الماضي، فذاع صيته في مصر والعالمَين العربي والإسلامي.",
      "سجّل المصحف الشريف كاملاً بالروايتين المرتّلة والمجوّدة، ويُعدّ مصحفه المجوّد من أعظم تسجيلات القرآن الكريم على الإطلاق لما يحمله من خشوعٍ وروحانية.",
      "انتقل الشيخ المنشاوي إلى رحمة الله عام 1969م عن عمرٍ يناهز التاسعة والأربعين، وما تزال تلاواته كنزاً خالداً في وجدان الأمّة الإسلامية إلى يومنا هذا.",
    ],
  },
  {
    slug: "mishary-rashid-alafasy",
    identifier: "ar.alafasy",
    nameEn: "Mishary Rashid Alafasy",
    nameAr: "مشاري بن راشد العفاسي",
    countryEn: "Kuwait",
    countryAr: "دولة الكويت",
    bornEn: "Born 1976, Kuwait City",
    bornAr: "وُلد عام 1976م في مدينة الكويت",
    styleEn: "Murattal",
    styleAr: "مرتّل",
    taglineEn:
      "Renowned Kuwaiti imam and reciter whose sweet, soulful voice has reached every corner of the Muslim world.",
    taglineAr:
      "إمامٌ وقارئٌ كويتيٌّ شهير، بلغ صوته الرقيق العذب أرجاء العالم الإسلامي كافة.",
    bioEn: [
      "Sheikh Mishary bin Rashid Al-Afasy is a celebrated Kuwaiti reciter, imam, and nasheed performer. He was born in Kuwait City in 1976 and grew up in a religious environment.",
      "He studied in the Faculty of the Holy Quran and Islamic Studies at the Islamic University of Madinah, specializing in the ten Qira'at under several distinguished scholars.",
      "He serves as the imam of the Grand Mosque of Kuwait and has led Tarawih and Qiyam prayers there for many years. His recordings of the Holy Quran are among the most listened to worldwide.",
      "Beyond recitation, he founded his own satellite channel and is widely known for his beautiful nasheeds and supplications, which have brought the message of the Quran to millions of listeners.",
    ],
    bioAr: [
      "الشيخ مشاري بن راشد العفاسي قارئٌ وإمامٌ ومنشدٌ كويتيٌّ ذائع الصِّيت، وُلد بمدينة الكويت عام 1976م، ونشأ في بيتٍ محافظٍ ملتزم.",
      "درس في كلية القرآن الكريم والدراسات الإسلامية بالجامعة الإسلامية بالمدينة المنورة، وتخصّص في القراءات العشر على يد عددٍ من كبار العلماء.",
      "يَؤمّ المصلين في المسجد الكبير بدولة الكويت، وقد أَمَّ صلاتَي التراويح والقيام فيه سنواتٍ طويلة، وأصبحت تلاواته للمصحف الشريف من أكثر التلاوات استماعاً حول العالم.",
      "إلى جانب التلاوة، أسّس قناةً فضائية باسمه، واشتُهر بأناشيده الإسلامية وأدعيته الخاشعة التي حملت رسالة القرآن إلى ملايين المستمعين.",
    ],
  },
  {
    slug: "mahmoud-al-husary",
    identifier: "ar.husary",
    nameEn: "Mahmoud Khalil Al-Husary",
    nameAr: "محمود خليل الحُصَري",
    countryEn: "Egypt",
    countryAr: "جمهورية مصر العربية",
    bornEn: "1917 – 1980, Shibin Al-Kawm, Tanta",
    bornAr: "1917م – 1980م، شُبرا النَّمَلة، طنطا",
    styleEn: "Murattal & Mujawwad",
    styleAr: "مرتّل ومجوّد",
    taglineEn:
      "Shaykh al-Maqari', the master of Quranic recitation whose precise tajweed set the global standard for learning the Quran.",
    taglineAr:
      "شيخ المقارئ المصرية وعميد قُرّاء القرآن الكريم، وضع معيار الإتقان والتجويد للأمة جمعاء.",
    bioEn: [
      "Sheikh Mahmoud Khalil Al-Husary was born in 1917 in the village of Shubra Al-Namla in Tanta, Egypt. He memorized the Quran at the age of eight and studied the ten Qira'at at Al-Azhar.",
      "He served as the official reciter of the Husayn Mosque in Cairo, and later as the head (Shaykh al-Maqari') of Egypt's Reciters Union, a position he held until his death.",
      "He is considered the first reciter to record the entire Holy Quran in the murattal style, and his recordings — both in Hafs and Warsh — became the benchmark for proper tajweed taught around the world.",
      "Sheikh Al-Husary passed away in 1980, leaving behind a vast legacy of recordings that remain the trusted reference for teachers and memorizers of the Quran everywhere.",
    ],
    bioAr: [
      "وُلد الشيخ محمود خليل الحُصَري عام 1917م في قرية شبرا النَّمَلة بمحافظة الغربية في مصر، وحفظ القرآن الكريم وهو ابن ثماني سنين، ثم درس القراءات العشر في الأزهر الشريف.",
      "عُيّن قارئاً رسمياً لمسجد الإمام الحسين بالقاهرة، ثم تولّى مشيخة المقارئ المصرية ونقابة قُرّاء مصر، وظلّ في هذا المنصب حتى وفاته.",
      "يُعدّ أوّل من سجّل المصحف الشريف كاملاً مرتّلاً، كما سجّله بروايتَي حفصٍ وورش، وأصبحت تسجيلاته المرجعَ الأوّل لتعليم التجويد وضبط التلاوة في مشارق الأرض ومغاربها.",
      "انتقل الشيخ الحُصَري إلى رحمة الله عام 1980م، تاركاً إرثاً عظيماً من التسجيلات التي ما تزال المرجعَ الموثوق لمعلمي القرآن وحفّاظه في كل مكان.",
    ],
  },
  {
    slug: "abdul-basit-abdul-samad",
    identifier: "ar.abdulsamad",
    nameEn: "Abdul Basit Abdul Samad",
    nameAr: "عبد الباسط عبد الصمد",
    countryEn: "Egypt",
    countryAr: "جمهورية مصر العربية",
    bornEn: "1927 – 1988, Al-Maraza, Qena",
    bornAr: "1927م – 1988م، قرية المراعزة، قنا",
    styleEn: "Mujawwad",
    styleAr: "مجوّد",
    taglineEn:
      "Egypt's «Voice from Heaven» — a global legend of Quranic recitation whose mujawwad has no equal.",
    taglineAr:
      "«صوتٌ من السماء» — أسطورةٌ خالدةٌ من أساطين تلاوة القرآن الكريم، لا يُجارى في فن التجويد.",
    bioEn: [
      "Sheikh Abdul Basit Muhammad Abdul Samad was born in 1927 in the village of Al-Maraza in Qena Governorate, Upper Egypt, into a family with a long tradition of Quranic recitation.",
      "He memorized the Quran at the age of ten and mastered the ten Qira'at. His public recitation career began in the early 1950s, and he quickly became one of the most beloved reciters in the Muslim world.",
      "He served as the first president of Egypt's Quran Reciters' Union and won several international Quran recitation competitions. He performed in dozens of countries and was decorated by numerous Muslim heads of state.",
      "Often called «Sawt min as-Sama'» (a Voice from Heaven), his unmatched mujawwad recitations remain among the most listened-to and cherished recordings of the Quran. He passed away in 1988.",
    ],
    bioAr: [
      "وُلد الشيخ عبد الباسط محمد عبد الصمد عام 1927م في قرية المراعزة بمحافظة قنا بصعيد مصر، في أسرةٍ عريقةٍ في تلاوة القرآن الكريم.",
      "حفظ القرآن الكريم وهو في العاشرة من عمره، وأتقن القراءات العشر، ثم بدأ مسيرته الإذاعية في مطلع الخمسينيات، فأصبح في وقتٍ قصير من أحبّ القرّاء إلى قلوب المسلمين.",
      "تولّى أوّل رئاسةٍ لنقابة قُرّاء القرآن الكريم في مصر، وفاز بعددٍ من المسابقات الدولية لتلاوة القرآن، وزار عشرات الدول، ونال أوسمةً من كبار حُكّام العالم الإسلامي.",
      "لُقِّب بـ«صوتٌ من السماء» لما تميّزت به تلاواته المجوّدة من جمالٍ خارقٍ لا يُجارى، وما تزال تسجيلاته من أكثر تلاوات القرآن استماعاً وحُبّاً عند الأمة. توفي رحمه الله عام 1988م.",
    ],
  },
  {
    slug: "abdul-rahman-al-sudais",
    identifier: "ar.abdurrahmaansudais",
    nameEn: "Abdul Rahman Al-Sudais",
    nameAr: "عبد الرحمن السديس",
    countryEn: "Saudi Arabia",
    countryAr: "المملكة العربية السعودية",
    bornEn: "Born 1960, Riyadh",
    bornAr: "وُلد عام 1960م في الرياض",
    styleEn: "Murattal",
    styleAr: "مرتّل",
    taglineEn:
      "Chief imam and khatib of the Grand Mosque in Makkah — one of the most recognized voices of the Holy Quran today.",
    taglineAr:
      "إمامٌ وخطيبٌ بالمسجد الحرام بمكة المكرمة، ومن أكثر أصوات القرآن الكريم انتشاراً في عصرنا الحاضر.",
    bioEn: [
      "Sheikh Abdul Rahman bin Abdulaziz Al-Sudais was born in Riyadh in 1960 and memorized the Quran at the age of twelve. He earned his PhD in Islamic Sharia from Umm Al-Qura University in Makkah.",
      "He was appointed as an imam and khatib of the Grand Mosque (Al-Masjid Al-Haram) in Makkah in 1984, and has led prayers there during Tarawih and Hajj seasons for decades.",
      "In 2012 he was appointed President of the General Presidency for the Affairs of the Two Holy Mosques in Makkah and Madinah, overseeing the religious, educational, and social services of both holy sites.",
      "Known for his powerful yet humble recitation, his voice has become inseparable from the experience of Hajj and Umrah for Muslims worldwide.",
    ],
    bioAr: [
      "الشيخ عبد الرحمن بن عبد العزيز السديس وُلد بمدينة الرياض عام 1960م، وحفظ القرآن الكريم وهو في الثانية عشرة من عمره، ونال درجة الدكتوراه في الشريعة الإسلامية من جامعة أم القرى بمكة المكرمة.",
      "عُيّن إماماً وخطيباً للمسجد الحرام بمكة المكرمة عام 1404هـ (1984م)، وأَمَّ المصلين في صلاتَي التراويح والقيام ومواسم الحج لعقودٍ متتالية.",
      "في عام 2012م صدر الأمر الملكي بتعيينه رئيساً عاماً لشؤون المسجد الحرام والمسجد النبوي، فتولّى الإشراف على الخدمات الدينية والتعليمية والاجتماعية في الحرمين الشريفين.",
      "تتميّز تلاوته بقوّةٍ ممزوجةٍ بخشوع، وقد ارتبط صوته بذكريات الحج والعمرة في وجدان المسلمين حول العالم.",
    ],
  },
  {
    slug: "ali-al-hudhaify",
    identifier: "ar.hudhaify",
    nameEn: "Ali Al-Hudhaify",
    nameAr: "علي بن عبد الرحمن الحُذيفي",
    countryEn: "Saudi Arabia",
    countryAr: "المملكة العربية السعودية",
    bornEn: "Born 1947, Al-Qara, Aseer",
    bornAr: "وُلد عام 1947م في القَرَى بمنطقة عسير",
    styleEn: "Murattal",
    styleAr: "مرتّل",
    taglineEn:
      "Veteran imam of the Prophet's Mosque in Madinah, beloved for his calm, measured tartil.",
    taglineAr:
      "إمامٌ بالمسجد النبوي الشريف في المدينة المنورة، اشتُهر بتلاوةٍ هادئةٍ متأنّيةٍ خاشعة.",
    bioEn: [
      "Sheikh Ali bin Abdurrahman Al-Hudhaify was born in the village of Al-Qara in the Aseer region of Saudi Arabia in 1947. He memorized the Quran in his youth and pursued advanced Islamic studies.",
      "He earned his PhD from the Islamic University of Madinah, where he later served as a professor in the Faculty of the Holy Quran and Islamic Studies.",
      "He was appointed as an imam at the Prophet's Mosque (Al-Masjid An-Nabawi) in Madinah, and also served for a period as an imam of the Grand Mosque in Makkah — a rare honor.",
      "His recitation is known for its slow, measured tartil and exemplary application of tajweed rules, making his recordings particularly valued by students of the Quran.",
    ],
    bioAr: [
      "الشيخ علي بن عبد الرحمن الحُذيفي وُلد بقرية القَرَى في منطقة عسير بالمملكة العربية السعودية عام 1947م، وحفظ القرآن الكريم في سنٍّ مبكرة، ثم تابع دراسته العلمية في العلوم الشرعية.",
      "نال درجة الدكتوراه من الجامعة الإسلامية بالمدينة المنورة، وعمل أستاذاً في كلية القرآن الكريم والدراسات الإسلامية بذات الجامعة.",
      "عُيّن إماماً للمسجد النبوي الشريف بالمدينة المنورة، كما أَمَّ المصلين في المسجد الحرام بمكة المكرمة لفترةٍ من الزمن، فجمع له شرف الإمامة في الحرمين الشريفين.",
      "تتميّز تلاوته بالهدوء والتأنّي وحُسن تطبيق أحكام التجويد، فجاءت تسجيلاته من أنفع التلاوات لطلاب علم القرآن وحُفّاظه.",
    ],
  },
];

export function getReciterBySlug(slug: string): ReciterProfile | undefined {
  return RECITER_PROFILES.find((r) => r.slug === slug);
}
