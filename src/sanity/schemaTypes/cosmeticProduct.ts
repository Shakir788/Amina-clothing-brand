import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'cosmeticProduct',
  title: 'Cosmetic Product',
  type: 'document',
  icon: () => '✨',

  groups: [
    { name: 'basic', title: '📝 Infos de base', default: true },
    { name: 'media', title: '📸 Photos & Vidéo' },
    { name: 'details', title: '🧴 Formule & Variantes' },
    { name: 'translations', title: '🌍 Traductions' },
    { name: 'settings', title: '⚙️ Paramètres' },
  ],

  fields: [
    // ================= BASIC INFO =================
    defineField({
      name: 'name',
      title: 'Nom du produit (Français)',
      description: 'Nom principal affiché sur le site',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'basic',
    }),

    defineField({
      name: 'slug',
      title: 'URL (générée automatiquement)',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
      group: 'basic',
    }),

    defineField({
      name: 'brand',
      title: 'Marque',
      description: 'Ex: Vichy, CeraVe, La Roche-Posay...',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'basic',
    }),

    defineField({
      name: 'price',
      title: 'Prix (MAD)',
      type: 'number',
      validation: (rule) => rule.required().positive(),
      group: 'basic',
    }),

    defineField({
      name: 'originalPrice',
      title: 'Ancien prix (barré) — optionnel',
      description: 'Remplir uniquement si le produit est en promotion',
      type: 'number',
      validation: (rule) => rule.positive(),
      group: 'basic',
    }),

    defineField({
      name: 'category',
      title: 'Catégorie',
      description: 'Sélectionnez une catégorie dans la liste',
      type: 'string',
      options: {
        list: [
          { title: '🧴 Nettoyant Visage', value: 'Nettoyant Visage' },
          { title: '💧 Hydratant', value: 'Hydratant' },
          { title: '☀️ Protection Solaire', value: 'Protection Solaire' },
          { title: '✨ Sérum Anti-Âge', value: 'Sérum Anti-Âge' },
          { title: '💦 Eau Micellaire', value: 'Eau Micellaire' },
          { title: '🌊 Eau Thermale', value: 'Eau Thermale' },
          { title: '🧴 Soin du Corps', value: 'Soin du Corps' },
          { title: '💇 Soin Capillaire', value: 'Soin Capillaire' },
          { title: '🩹 Soin de la Peau', value: 'Soin de la Peau' },
          { title: '⚪ Dépigmentation', value: 'Dépigmentation' },
          { title: '🧼 Savon', value: 'Savon' },
          { title: '💊 Compléments', value: 'Compléments' },
          { title: '🦷 Soin Bucco-dentaire', value: 'Soin Bucco-dentaire' },
          { title: '🌸 Hygiène Intime', value: 'Hygiène Intime' },
          { title: '🫒 Huile Visage', value: 'Huile Visage' },
          { title: '👶 Soin Bébé', value: 'Soin Bébé' },
          { title: '🧴 Antiseptique', value: 'Antiseptique' },
          { title: '👁️ Contour des Yeux', value: 'Contour des Yeux' },
          { title: '🧽 Déodorant', value: 'Déodorant' },
          { title: '💄 Maquillage', value: 'Maquillage' },
          { title: '🌺 Parfums', value: 'Parfums' },
        ],
        layout: 'dropdown', // clean dropdown, not radio buttons
      },
      validation: (rule) => rule.required(),
      initialValue: 'Soin de la Peau',
      group: 'basic',
    }),

    defineField({
      name: 'skinConcern',
      title: 'Préoccupation cutanée',
      description: 'À quel problème répond ce produit ? (sélection multiple possible)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Sécheresse', value: 'Sécheresse' },
          { title: 'Acné / Peau grasse', value: 'Acné' },
          { title: 'Anti-âge / Rides', value: 'Anti-âge' },
          { title: 'Taches pigmentaires', value: 'Pigmentation' },
          { title: 'Protection solaire', value: 'Protection solaire' },
          { title: 'Peau sensible', value: 'Sensibilité' },
          { title: 'Irritation / Rougeurs', value: 'Irritation' },
          { title: 'Chute de cheveux', value: 'Chute de cheveux' },
          { title: 'Pellicules', value: 'Pellicules' },
        ],
        layout: 'tags', // clean chip-style multi-select
      },
      group: 'basic',
    }),

    defineField({
      name: 'description',
      title: 'Description (Français)',
      type: 'text',
      rows: 4,
      group: 'basic',
    }),

    defineField({
      name: 'inStock',
      title: '📦 Disponible à la vente ?',
      description: 'Désactivez pour marquer le produit comme ÉPUISÉ',
      type: 'boolean',
      initialValue: true,
      group: 'basic',
    }),

    // ================= MEDIA =================
    defineField({
      name: 'image',
      title: 'Photo principale',
      description: 'Glissez-déposez ou cliquez pour recadrer (crop) l\'image',
      type: 'image',
      options: {
        hotspot: true, // crop/focus point tool
      },
      validation: (rule) => rule.required(),
      group: 'media',
    }),

    defineField({
      name: 'gallery',
      title: 'Galerie de photos supplémentaires',
      description: 'Vous pouvez glisser-déposer PLUSIEURS photos en même temps ici',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
      options: {
        layout: 'grid', // visual grid, easy to reorder by dragging
      },
      group: 'media',
    }),

    defineField({
      name: 'videoFile',
      title: '🎬 Vidéo (format portrait 9:16)',
      description: 'Pour l\'effet vidéo au survol de la souris sur le site. Format MP4 uniquement.',
      type: 'file',
      options: {
        accept: 'video/mp4,video/quicktime',
      },
      group: 'media',
    }),

    // ================= DETAILS =================
    defineField({
      name: 'volumes',
      title: 'Contenances disponibles',
      description: 'Tapez une taille puis Entrée (ex: 50ml) — répétez pour en ajouter plusieurs',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      group: 'details',
    }),

    defineField({
      name: 'ingredients',
      title: 'Ingrédients clés',
      description: 'Liste des principaux actifs (pour la fiche produit)',
      type: 'text',
      rows: 3,
      group: 'details',
    }),

    defineField({
      name: 'howToUse',
      title: 'Mode d\'emploi',
      type: 'text',
      rows: 3,
      group: 'details',
    }),

    // ================= TRANSLATIONS =================
    defineField({
      name: 'name_en',
      title: '🇬🇧 Nom (Anglais)',
      type: 'string',
      group: 'translations',
    }),
    defineField({
      name: 'name_ar',
      title: '🇲🇦 Nom (Arabe)',
      type: 'string',
      group: 'translations',
    }),
    defineField({
      name: 'desc_en',
      title: '🇬🇧 Description (Anglais)',
      type: 'text',
      rows: 3,
      group: 'translations',
    }),
    defineField({
      name: 'desc_ar',
      title: '🇲🇦 Description (Arabe)',
      type: 'text',
      rows: 3,
      group: 'translations',
    }),

    // ================= SETTINGS =================
    defineField({
      name: 'status',
      title: 'Statut de publication',
      type: 'string',
      options: {
        list: [
          { title: '🟠 Brouillon (invisible sur le site)', value: 'draft' },
          { title: '🟢 En ligne (visible sur le site)', value: 'approved' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      group: 'settings',
    }),

    defineField({
      name: 'featured',
      title: '⭐ Produit vedette',
      description: 'Mettre en avant sur la page d\'accueil',
      type: 'boolean',
      initialValue: false,
      group: 'settings',
    }),
  ],

  // Smart preview in the product list
  preview: {
    select: {
      title: 'name',
      brand: 'brand',
      price: 'price',
      status: 'status',
      inStock: 'inStock',
      media: 'image',
    },
    prepare({ title, brand, price, status, inStock, media }) {
      const stockText = inStock === false ? '🚫 Épuisé' : '✅ En stock'
      const statusText = status === 'approved' ? '🟢 En ligne' : '🟠 Brouillon'
      return {
        title: `${brand ? brand + ' — ' : ''}${title}`,
        subtitle: `${price ? price + ' MAD' : 'Pas de prix'} • ${stockText} • ${statusText}`,
        media,
      }
    },
  },
})