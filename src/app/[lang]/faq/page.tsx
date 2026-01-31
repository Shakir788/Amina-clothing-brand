'use client'

import { useState } from 'react'
import { Plus, Minus, MessageCircle, ChevronRight } from 'lucide-react'

// 👇 FULL DATA UPDATED (ENGLISH, FRENCH, ARABIC)
const faqData = {
  en: [
    // --- SECTION 1: PRODUCT ---
    { q: "Are these authentic Moroccan designs?", a: "Yes, our collection is carefully curated to reflect the latest trends and Moroccan elegance, sourced from the best local artisans." },
    { q: "How do you ensure product quality?", a: "Quality is our top priority. Every piece goes through a strict quality check by our team before it is packed and shipped to you." },
    { q: "What fabrics are used?", a: "We use high-quality fabrics such as Wool, Cotton, and premium blends to ensure elegance and comfort." },
    { q: "Do the colors look exactly like the photos?", a: "We try our best to show the exact color in natural light. However, slight variations may occur due to studio lighting or mobile screen settings." },
    { q: "Do you restock sold-out items?", a: "To maintain exclusivity, most of our collections are limited edition. However, we sometimes bring back bestsellers. Follow us on Instagram for updates." },
    
    // --- SECTION 2: SIZING ---
    { q: "How do I know my size?", a: "Most of our pieces are designed to fit various body types elegantly. Please check the size guide on the product page." },
    { q: "Do you offer Plus Sizes?", a: "Yes, all sizes are available." },
    { q: "Can I request custom measurements?", a: "Currently, we only offer Ready-to-Wear collections. We do not provide custom tailoring services at the moment." },
    { q: "Can I alter the length?", a: "We deliver standard lengths. We recommend visiting your local tailor for precise hem alterations to match your height." },

    // --- SECTION 3: ORDERING ---
    { q: "How do I place an order?", a: "Browse our collection, add items to your cart, and click 'Order on WhatsApp.' You will be redirected to chat with our team to finalize details." },
    { q: "Do I need an account to order?", a: "No, you can browse and order as a guest. We keep it simple for you." },
    { q: "Can I cancel or change my order?", a: "You can modify your order within 2 hours of confirmation. Once the package is dispatched, we cannot make changes." },
    { q: "Do you offer gift wrapping?", a: "Absolutely. Every AMINA order comes in our signature packaging, making it perfect for gifting." },
    { q: "Can I reserve an item?", a: "Items are sold on a first-come, first-served basis. We can only reserve items after a partial deposit is made." },

    // --- SECTION 4: SHIPPING ---
    { q: "Cities available for shipping?", a: "All Moroccan cities." },
    { q: "How long does delivery take?", a: "Casablanca & Suburbs: Within 24 hours. Other cities: 2 to 4 business days." },
    { q: "What are the shipping costs?", a: "Enjoy free standard delivery on every order. Our gift to you" },
    { q: "How can I track my order?", a: "Once dispatched, we will send you the tracking number or the delivery driver’s phone number via WhatsApp." },
    { q: "Do I have to pay customs fees (International)?", a: "For international orders, customs duties are the responsibility of the customer depending on their country's regulations." },

    // --- SECTION 5: RETURNS ---
    { q: "What is your return policy?", a: "We accept returns or exchanges within 3 days of delivery, provided the item is unworn, unwashed, and tags are attached." },
    { q: "How do I initiate a return?", a: "Simply contact us on WhatsApp with your order details. Our team will guide you." },
    { q: "Are discount items refundable?", a: "Items purchased during a 'Sale' or 'Discount' period are final sale unless there is a manufacturing defect." },
    { q: "Who pays for return shipping?", a: "If the return is due to our error, we cover it. If it is a change of preference, the customer covers the fees." },
    { q: "When will I get my refund?", a: "Refunds are processed within 5-7 business days after we receive and inspect the item." },

    // --- SECTION 6: PAYMENT ---
    { q: "What payment methods do you accept?", a: "We primarily accept Cash on Delivery (COD) for orders within Morocco. Bank Transfers are available for larger orders." },
    { q: "Is my payment secure?", a: "Yes, since orders are finalized manually via WhatsApp, you do not need to enter credit card details on the website." },

    // --- SECTION 7: CARE ---
    { q: "How should I wash my clothes?", a: "We recommend checking the care label on each piece. Generally, gentle wash or dry clean is preferred for premium fabrics." },
    { q: "Can I iron my items?", a: "Use a steamer or iron on low heat (inside out). Do not iron directly over prints or embroidery." },
    { q: "How should I store them?", a: "Hang your clothes in a cool, dry place to maintain their shape." },
    { q: "Where is your physical store?", a: "We are currently an Online-Exclusive Brand based in Casablanca to keep prices accessible." },
  ],

  fr: [
    // --- SECTION 1: PRODUCT (FR) ---
    { q: "S'agit-il de créations marocaines authentiques ?", a: "Oui, notre collection est soigneusement sélectionnée pour refléter les dernières tendances et l'élégance marocaine, sourcée auprès des meilleurs artisans." },
    { q: "Comment garantissez-vous la qualité ?", a: "La qualité est notre priorité. Chaque pièce subit un contrôle rigoureux par notre équipe avant d'être expédiée." },
    { q: "Quels tissus utilisez-vous ?", a: "Nous utilisons des tissus de haute qualité tels que la Laine, le Coton et des mélanges premium pour garantir élégance et confort." },
    { q: "Les couleurs sont-elles exactes aux photos ?", a: "Nous essayons de montrer la couleur exacte. Cependant, de légères variations peuvent survenir selon l'éclairage." },
    { q: "Réapprovisionnez-vous les articles épuisés ?", a: "Pour maintenir l'exclusivité, nos collections sont souvent en édition limitée. Suivez-nous sur Instagram pour les mises à jour." },

    // --- SECTION 2: SIZING (FR) ---
    { q: "Comment connaître ma taille ?", a: "La plupart de nos pièces sont conçues pour s'adapter élégamment à différentes morphologies. Veuillez consulter le guide des tailles." },
    { q: "Proposez-vous des grandes tailles ?", a: "Oui, toutes les tailles sont disponibles." },
    { q: "Puis-je demander du sur-mesure ?", a: "Actuellement, nous proposons uniquement du Prêt-à-Porter. Nous ne faisons pas de retouches personnalisées." },
    { q: "Puis-je modifier la longueur ?", a: "Nous livrons des longueurs standard. Nous recommandons de visiter votre tailleur local pour un ourlet précis." },

    // --- SECTION 3: ORDERING (FR) ---
    { q: "Comment passer commande ?", a: "Ajoutez des articles au panier et cliquez sur 'Commander sur WhatsApp'. Vous discuterez avec notre équipe pour finaliser." },
    { q: "Dois-je créer un compte ?", a: "Non, vous pouvez commander en tant qu'invité." },
    { q: "Puis-je annuler ou modifier ma commande ?", a: "Modification possible sous 2 heures. Une fois expédiée, aucune modification n'est possible." },
    { q: "Proposez-vous un emballage cadeau ?", a: "Absolument. Chaque commande AMINA arrive dans notre emballage signature." },
    { q: "Puis-je réserver un article ?", a: "Premier arrivé, premier servi. La réservation n'est possible qu'après un acompte." },

    // --- SECTION 4: SHIPPING (FR) ---
    { q: "Villes disponibles pour la livraison ?", a: "Toutes les villes marocaines." },
    { q: "Quels sont les délais de livraison ?", a: "Casablanca et environs : Sous 24 heures. Autres villes : 2 à 4 jours ouvrables." },
    { q: "Quels sont les frais de livraison ?", a: "Profitez de la livraison standard gratuite sur chaque commande. Notre cadeau pour vous." },
    { q: "Comment suivre ma commande ?", a: "Une fois expédiée, nous vous envoyons le numéro de suivi ou le contact du livreur via WhatsApp." },
    { q: "Y a-t-il des frais de douane (International) ?", a: "Pour l'international, les frais de douane sont à la charge du client selon son pays." },

    // --- SECTION 5: RETURNS (FR) ---
    { q: "Quelle est votre politique de retour ?", a: "Retours/échanges acceptés sous 3 jours, si l'article n'est pas porté et avec étiquettes." },
    { q: "Comment faire un retour ?", a: "Contactez-nous simplement sur WhatsApp avec les détails de votre commande." },
    { q: "Les articles en promotion sont-ils remboursables ?", a: "Les articles achetés en 'Soldes' ou 'Remise' sont en vente finale, sauf défaut de fabrication." },
    { q: "Qui paie les frais de retour ?", a: "Si c'est notre erreur, nous payons. Si c'est un changement d'avis, le client paie les frais." },
    { q: "Quand serai-je remboursé ?", a: "Remboursement sous 5-7 jours ouvrables après réception et inspection." },

    // --- SECTION 6: PAYMENT (FR) ---
    { q: "Quels moyens de paiement acceptez-vous ?", a: "Principalement le Paiement à la Livraison (COD) au Maroc. Virement bancaire pour les grosses commandes." },
    { q: "Le paiement est-il sécurisé ?", a: "Oui, tout se finalise manuellement via WhatsApp, aucune carte bancaire requise sur le site." },

    // --- SECTION 7: CARE (FR) ---
    { q: "Comment laver mes vêtements ?", a: "Nous recommandons de vérifier l'étiquette d'entretien. En général, un lavage doux ou à sec est préférable." },
    { q: "Puis-je repasser mes articles ?", a: "Utilisez un défroisseur ou un fer doux (à l'envers). Ne repassez pas directement sur les imprimés ou broderies." },
    { q: "Comment les ranger ?", a: "Suspendez vos vêtements dans un endroit frais et sec." },
    { q: "Où est votre boutique physique ?", a: "Nous sommes une marque 100% en ligne basée à Casablanca pour garder des prix accessibles." },
  ],

  ar: [
    // --- SECTION 1: PRODUCT (AR) ---
    { q: "هل هذه تصاميم مغربية أصلية؟", a: "نعم، مجموعتنا مختارة بعناية لتعكس أحدث الصيحات والأناقة المغربية، ومصنوعة بأيدي أمهر الحرفيين المحليين." },
    { q: "كيف تضمنون جودة المنتجات؟", a: "الجودة هي أولويتنا. كل قطعة تخضع لفحص دقيق من قبل فريقنا قبل شحنها إليك." },
    { q: "ما هي الأقمشة المستخدمة؟", a: "نستخدم أقمشة عالية الجودة مثل الصوف والقطن لضمان الراحة والأناقة." },
    { q: "هل الألوان مطابقة للصور؟", a: "نحاول إظهار اللون الدقيق. ومع ذلك، قد تحدث اختلافات طفيفة بسبب الإضاءة أو إعدادات الشاشة." },
    { q: "هل تعيدون توفير القطع النافدة؟", a: "للحفاظ على التميز، معظم مجموعاتنا محدودة الإصدار. لكننا نعيد أحياناً القطع الأكثر مبيعاً. تابعونا على إنستغرام." },

    // --- SECTION 2: SIZING (AR) ---
    { q: "كيف أعرف مقاسي؟", a: "معظم قطعنا مصممة لتناسب مختلف الأجسام بأناقة. يرجى التحقق من دليل المقاسات في صفحة المنتج." },
    { q: "هل تتوفر مقاسات كبيرة؟", a: "نعم جميع المقاسات متوفرة." },
    { q: "هل يمكن طلب مقاسات خاصة؟", a: "حالياً، نقدم فقط مجموعات جاهزة للارتداء. لا نوفر خدمة التفصيل الخاص." },
    { q: "هل يمكن تعديل طول القطعة؟", a: "نسلم الأطوال القياسية. ننصح بزيارة خياطك المحلي لتقصير الطول بدقة إذا لزم الأمر." },

    // --- SECTION 3: ORDERING (AR) ---
    { q: "كيف يمكنني الطلب؟", a: "تصفحي الموقع، أضيفي المنتجات للسلة، واضغطي 'الطلب عبر واتساب'. سيتم تحويلك لمحادثة فريقنا لإتمام الطلب." },
    { q: "هل أحتاج لإنشاء حساب؟", a: "لا، يمكنك الطلب كضيف." },
    { q: "هل يمكن إلغاء أو تعديل الطلب؟", a: "يمكن التعديل خلال ساعتين من التأكيد. بمجرد خروج الطلب للتوصيل، لا يمكن التعديل." },
    { q: "هل توفرون تغليف الهدايا؟", a: "بالتأكيد. كل طلبات AMINA تصل في تغليفنا المميز، مما يجعلها مثالية للإهداء." },
    { q: "هل يمكن حجز قطعة؟", a: "البيع بأسبقية الطلب. لا يمكننا حجز القطع إلا بعد دفع عربون جزئي." },

    // --- SECTION 4: SHIPPING (AR) ---
    { q: "المدن المتوفرة للشحن؟", a: "كل المدن المغربية." },
    { q: "كم يستغرق التوصيل؟", a: "الدار البيضاء وضواحيها: خلال 24 ساعة. المدن الأخرى: من 2 إلى 4 أيام عمل." },
    { q: "ما هي تكاليف الشحن؟", a: "استمتعوا بتوصيل مجاني لجميع الطلبات. هديتنا لكم" },
    { q: "كيف أتتبع طلبي؟", a: "بمجرد الشحن، سنرسل لك رقم التتبع أو رقم هاتف الموزع عبر واتساب." },
    { q: "هل توجد رسوم جمركية (دولي)؟", a: "للطلبات الدولية، الرسوم الجمركية هي مسؤولية الزبون حسب قوانين بلده." },

    // --- SECTION 5: RETURNS (AR) ---
    { q: "ما هي سياسة الاسترجاع؟", a: "نقبل الاسترجاع أو الاستبدال خلال 3 أيام، بشرط أن تكون القطعة غير ملبوسة وبالتيكيت." },
    { q: "كيف أطلب الاسترجاع؟", a: "تواصلي معنا عبر واتساب مع تفاصيل طلبك." },
    { q: "هل سلع التخفيضات قابلة للاسترجاع؟", a: "سلع 'التخفيض' هي بيع نهائي ولا تسترجع إلا في حال وجود عيب مصنعي." },
    { q: "من يدفع رسوم الشحن للاسترجاع؟", a: "إذا كان الخطأ منا، نحن ندفع. إذا كان تغيير رأي، الزبون يدفع الرسوم." },
    { q: "متى سأسترد مالي؟", a: "يتم الاسترداد خلال 5-7 أيام عمل بعد استلامنا للقطعة وفحصها." },

    // --- SECTION 6: PAYMENT (AR) ---
    { q: "ما هي طرق الدفع؟", a: "نقبل الدفع عند الاستلام داخل المغرب. والتحويل البنكي للطلبات الكبيرة." },
    { q: "هل الدفع آمن؟", a: "نعم، لأن إتمام الطلب يتم يدوياً عبر واتساب، لا داعي لإدخال معلومات بنكية في الموقع." },

    // --- SECTION 7: CARE (AR) ---
    { q: "كيف أغسل ملابسي؟", a: "نوصي بالتحقق من ملصق العناية على كل قطعة. عموماً، يفضل الغسيل اللطيف أو التنظيف الجاف للأقمشة الفاخرة." },
    { q: "هل يمكن كوي الملابس؟", a: "استخدمي البخار أو مكواة حرارة منخفضة (بالمقلوب). لا تكوي فوق الزخارف مباشرة." },
    { q: "كيف أقوم بتخزينها؟", a: "علقي ملابسك في مكان بارد وجاف للحفاظ على شكلها." },
    { q: "أين محلكم؟", a: "نحن حالياً علامة تجارية إلكترونية فقط مقرنا الدار البيضاء للحفاظ على أسعار مناسبة." },
  ]
}

export default function FAQPage({ params }: { params: { lang: string } }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  
  // Logic: Language Selection with Fallback
  const currentLang = ['en', 'fr', 'ar'].includes(params.lang) ? params.lang : 'en'
  // @ts-ignore
  const questions = faqData[currentLang] || faqData.en
  const isArabic = currentLang === 'ar'

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Titles
  const title = {
    en: "Frequently Asked Questions",
    fr: "Questions Fréquentes",
    ar: "الأسئلة الشائعة"
  }

  const contactText = {
    en: "Still have questions?",
    fr: "Vous avez d'autres questions ?",
    ar: "هل لديك أسئلة أخرى؟"
  }

  const contactBtn = {
    en: "Chat on WhatsApp",
    fr: "Discuter sur WhatsApp",
    ar: "تحدث معنا عبر واتساب"
  }

  return (
    <div className={`min-h-screen bg-[#F4F1EA] pt-40 pb-20 px-6 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-[#D4A373] text-xs font-bold uppercase tracking-[0.3em] mb-4">Support</p>
          {/* @ts-ignore */}
          <h1 className="text-3xl md:text-5xl font-serif text-[#2C2C2C] mb-6 leading-tight">{title[currentLang]}</h1>
          <div className="w-24 h-[1.5px] bg-[#D4A373] mx-auto opacity-60"></div>
        </div>

        {/* FAQ LIST */}
        <div className="space-y-4">
          {questions.map((item: any, index: number) => (
            <div 
              key={index} 
              className={`group bg-white border transition-all duration-500 rounded-xl overflow-hidden ${openIndex === index ? 'border-[#D4A373] shadow-lg ring-1 ring-[#D4A373]/20' : 'border-[#D4A373]/10 hover:border-[#D4A373]/40 hover:shadow-sm'}`}
            >
              <button 
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-serif text-[#D4A373] opacity-50`}>0{index + 1}</span>
                  <h3 className={`text-lg font-serif font-medium transition-colors duration-300 ${openIndex === index ? 'text-[#D4A373]' : 'text-[#2C2C2C]'}`}>
                    {item.q}
                  </h3>
                </div>
                
                <span className={`text-[#D4A373] transition-transform duration-500 ease-in-out bg-[#F4F1EA] p-2 rounded-full ${openIndex === index ? 'rotate-180 bg-[#D4A373] text-white' : 'rotate-0'}`}>
                  {openIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>

              <div 
                className={`grid transition-all duration-500 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <p className="p-6 pt-0 text-gray-500 font-light leading-relaxed border-t border-dashed border-[#D4A373]/20 mt-2">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-20 text-center bg-white border border-[#D4A373]/20 p-10 rounded-2xl shadow-sm">
          <MessageCircle size={40} className="mx-auto text-[#D4A373] mb-4 opacity-80" />
          {/* @ts-ignore */}
          <h3 className="text-xl font-serif text-[#2C2C2C] mb-2">{contactText[currentLang]}</h3>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            {isArabic 
             ? "نحن هنا لمساعدتك في أي وقت. تواصلي معنا للحصول على مساعدة فورية."
             : "We are here to help you anytime. Reach out to us for instant assistance."}
          </p>
          
          <a 
            href="https://wa.me/212723908603" 
            target="_blank"
            className="inline-flex items-center gap-3 bg-[#1a1a1a] text-white px-8 py-4 rounded-full uppercase text-xs font-bold tracking-[0.2em] hover:bg-[#D4A373] transition-all duration-300 group"
          >
            {/* @ts-ignore */}
            <span>{contactBtn[currentLang]}</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

      </div>
    </div>
  )
}