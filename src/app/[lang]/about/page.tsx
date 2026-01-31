import React from 'react';

// 1. Translations (UPDATED: Removed 'Intention' & 'Heritage')
const translations = {
  en: {
    title: "OUR STORY",
    introItalic: "AMINA was born from a quiet desire —",
    // 👇 UPDATED: Removed "intention"
    introRest: "to bring calm and elegance into everyday fashion.", 
    p1: "In a world filled with noise and fast trends, we believe true luxury is subtle. It doesn’t shout. It whispers.",
    p2: "Each piece at AMINA is carefully curated, inspired by our signature elegance, soft textures, and timeless silhouettes made for the modern woman.",
    p3: "We don’t follow seasons blindly. We focus on balance, quality, and feeling — how a garment moves, how it feels on the skin, and how confidently it lets you be yourself.",
    valuesTitle: "What We Believe In",
    values: [
      "Thoughtful curation over mass production",
      "Timeless design over fast trends",
      "Confidence through comfort",
      "Luxury that feels personal, not loud"
    ],
    closing: <>Less, but better.<br />Quiet, yet powerful.</>
  },
  fr: {
    title: "NOTRE HISTOIRE",
    introItalic: "AMINA est née d'un désir silencieux —",
    // 👇 UPDATED: Removed "intention"
    introRest: "apporter calme et élégance à la mode quotidienne.", 
    p1: "Dans un monde rempli de bruit et de tendances rapides, nous croyons que le vrai luxe est subtil. Il ne crie pas. Il murmure.",
    p2: "Chaque pièce chez AMINA est soigneusement sélectionnée, inspirée par notre élégance signature, les textures douces et les silhouettes intemporelles pour la femme moderne.",
    p3: "Nous ne suivons pas les saisons aveuglément. Nous privilégions l'équilibre, la qualité et le ressenti — le mouvement du vêtement, sa sensation sur la peau et la confiance qu'il vous procure.",
    valuesTitle: "Nos Valeurs",
    values: [
      "Une sélection réfléchie plutôt que la production de masse",
      "Un design intemporel plutôt que des tendances éphémères",
      "La confiance par le confort",
      "Un luxe qui semble personnel, pas bruyant"
    ],
    closing: <>Moins, mais mieux.<br />Calme, mais puissant.</>
  },
  ar: {
    title: "قصتنا",
    introItalic: "ولدت أمينة من رغبة هادئة —",
    // 👇 UPDATED: Removed "القصد" (Intention)
    introRest: "لإضفاء الهدوء والأناقة على الأزياء اليومية.", 
    p1: "في عالم مليء بالضجيج والصيحات السريعة، نؤمن أن الفخامة الحقيقية تكمن في البساطة. إنها لا تصرخ، بل تهمس.",
    p2: "تم اختيار كل قطعة في أمينة بعناية، مستوحاة من أناقتنا الخاصة، والأقمشة الناعمة، والقصات الخالدة المصممة للمرأة العصرية.",
    p3: "نحن لا نتبع المواسم بشكل أعمى. نركز على التوازن والجودة والإحساس — كيف تتحرك القطعة، وكيف تشعرين بها على بشرتك، وكيف تمنحك الثقة لتكوني نفسك.",
    valuesTitle: "ما نؤمن به",
    values: [
      "اختيار مدروس بدلاً من الإنتاج الضخم",
      "تصميم خالد بدلاً من الصيحات السريعة",
      "الثقة من خلال الراحة",
      "فخامة شخصية، وليست صاخبة"
    ],
    closing: <>أقل، ولكن أفضل.<br />هادئة، لكنها قوية.</>
  }
};

// 🐦 Custom Styles for Birds (CSS Animation)
const styles = `
  @keyframes flyCycle {
    0% { transform: translateY(0); }
    50% { transform: translateY(5px); }
    100% { transform: translateY(0); }
  }
  @keyframes moveX {
    from { transform: translateX(-10vw); }
    to { transform: translateX(110vw); }
  }
  .bird-container {
    position: absolute;
    top: 20%;
    left: -10%;
    transform: scale(0) translateX(-10vw);
    will-change: transform;
    animation-name: moveX;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    z-index: 0; /* Behind text */
  }
  .bird {
    background-image: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/174479/bird-cells.svg");
    background-size: auto 100%;
    width: 88px;
    height: 125px;
    will-change: background-position;
    animation-name: fly-cycle;
    animation-timing-function: steps(10);
    animation-iteration-count: infinite;
  }
  @keyframes fly-cycle {
    100% { background-position: -900px 0; }
  }
  
  /* Bird 1 */
  .bird-1 { animation-duration: 35s; animation-delay: 0s; top: 10%; transform: scale(0.4); opacity: 0.6; }
  .bird-1 .bird { animation-duration: 1s; }
  
  /* Bird 2 */
  .bird-2 { animation-duration: 45s; animation-delay: 5s; top: 15%; transform: scale(0.3); opacity: 0.5; }
  .bird-2 .bird { animation-duration: 1.2s; animation-delay: -0.5s; }
  
  /* Bird 3 */
  .bird-3 { animation-duration: 40s; animation-delay: 15s; top: 25%; transform: scale(0.2); opacity: 0.4; }
  .bird-3 .bird { animation-duration: 1.1s; animation-delay: -1s; }
`;

export default function AboutPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || 'en';
  // @ts-ignore
  const t = translations[lang] || translations.en;
  const isArabic = lang === 'ar';

  return (
    <div 
      className={`min-h-screen relative overflow-hidden px-6 py-32 text-center ${isArabic ? 'font-sans' : ''}`} 
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Inject Styles */}
      <style>{styles}</style>

      {/* 🎨 BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#FCECDD] via-[#F8F3E6] to-[#FFFFFF] -z-20" />
      
      {/* 🦅 FLYING BIRDS ANIMATION */}
      <div className="bird-container bird-1">
        <div className="bird"></div>
      </div>
      <div className="bird-container bird-2">
        <div className="bird"></div>
      </div>
      <div className="bird-container bird-3">
        <div className="bird"></div>
      </div>

      {/* GLOW EFFECT */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#D4A373]/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* MAIN CONTENT */}
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 relative z-10">
        
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 text-[#2C2C2C] tracking-tight drop-shadow-sm">
          {t.title}
        </h1>

        <div className="w-24 h-[3px] bg-gradient-to-r from-transparent via-[#D4A373] to-transparent mx-auto mb-16" />

        <p className="text-xl md:text-2xl text-black leading-relaxed mb-16 font-light">
          <span className="italic font-serif text-[#B07D46] font-medium block mb-4 text-2xl md:text-4xl">
            {t.introItalic}
          </span>
          {t.introRest}
        </p>

        {/* Glassmorphism Card */}
        <div className="bg-white/60 backdrop-blur-xl p-8 md:p-14 rounded-[2.5rem] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6 text-lg text-gray-700 leading-relaxed font-light">
          <p>{t.p1}</p>
          <p>{t.p2}</p>
          <p>{t.p3}</p>
        </div>

        {/* Values */}
        <div className="mt-24">
          <h2 className="text-3xl font-serif font-medium mb-10 text-[#2C2C2C]">
            {t.valuesTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {t.values.map((val: string, index: number) => (
              <div 
                key={index} 
                className="group flex items-center justify-center gap-3 bg-white/80 hover:bg-white py-5 px-6 rounded-2xl shadow-sm hover:shadow-md border border-[#F0EBE0] transition-all duration-300"
              >
                <span className="text-[#D4A373] text-xl group-hover:scale-125 transition-transform duration-300">✦</span> 
                <span className="text-gray-600 text-sm tracking-widest uppercase font-medium group-hover:text-black transition-colors">
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Closing */}
        <div className="mt-28 relative inline-block">
           <span className="absolute -top-6 -left-6 text-6xl text-[#D4A373]/20 font-serif">“</span>
           <p className="text-2xl md:text-3xl font-serif text-[#8C6A48] italic relative z-10">
             {t.closing}
           </p>
           <span className="absolute -bottom-6 -right-6 text-6xl text-[#D4A373]/20 font-serif">”</span>
        </div>

      </div>
    </div>
  );
}