import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'cosmeticProduct',
  title: 'Cosmetic Product',
  type: 'document',
  icon: () => '✨', // Luxury spark icon instead of dress

  groups: [
    { name: 'basic', title: '📝 Basic Info', default: true },
    { name: 'media', title: '📸 Media & Video' },
    { name: 'details', title: '🧴 Formula & Variants' },
    { name: 'translations', title: '🌍 Translations' },
    { name: 'settings', title: '⚙️ Settings' },
  ],

  fields: [
    // ---------------- BASIC INFO ----------------
    defineField({
      name: 'name',
      title: 'Product Name (English)',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'basic',
    }),

    defineField({
      name: 'slug',
      title: 'Slug (Unique URL)',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
      group: 'basic',
    }),

    defineField({
      name: 'price',
      title: 'Price (MAD)',
      type: 'number',
      validation: (rule) => rule.required(),
      group: 'basic',
    }),

    defineField({
      name: 'originalPrice',
      title: 'Original Price (Crossed Out)',
      description: 'Optional: Use this to show a discount (e.g. 500)',
      type: 'number',
      group: 'basic',
    }),

    defineField({
      name: 'description',
      title: 'General Description (Default)',
      type: 'text',
      rows: 3,
      group: 'basic',
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Soins du Visage (Skincare)', value: 'Soins' },
          { title: 'Parfums (Perfumes)', value: 'Parfums' },
          { title: 'Cheveux (Haircare)', value: 'Cheveux' },
          { title: 'Maquillage (Makeup)', value: 'Maquillage' },
        ],
      },
      initialValue: 'Soins',
      group: 'basic',
    }),

    defineField({
      name: 'inStock',
      title: '📦 In Stock (Available for Sale?)',
      description: 'Turn this OFF to mark the product as SOLD OUT on the website.',
      type: 'boolean',
      initialValue: true, 
      group: 'basic',
    }),

    // ---------------- MEDIA ----------------
    defineField({
      name: 'image',
      title: 'Main Cover Image (Default)',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      group: 'media',
    }),

    defineField({
      name: 'gallery',
      title: 'General Image Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      options: { layout: 'grid' },
      group: 'media',
    }),

    defineField({
      name: 'videoUrl',
      title: '🎬 Cinematic Video URL (9:16)',
      description: 'Paste your portrait video link here (Pexels, AWS, etc.) for the luxury hover effect.',
      type: 'url',
      group: 'media',
    }),

    // ---------------- FORMULA & VARIANTS (Replaced Colors/Sizes) ----------------
    defineField({
      name: 'volumes',
      title: '🧴 Available Volumes / Sizes',
      description: 'e.g., 30ml, 50ml, 100ml',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      group: 'details',
    }),

    defineField({
      name: 'ingredients',
      title: 'Key Ingredients',
      description: 'Main active ingredients for the product details page.',
      type: 'text',
      rows: 3,
      group: 'details',
    }),

    // ---------------- TRANSLATIONS ----------------
    defineField({ name: 'name_fr', title: 'Product Name (French)', type: 'string', group: 'translations' }),
    defineField({ name: 'name_ar', title: 'Product Name (Arabic)', type: 'string', group: 'translations' }),
    defineField({ name: 'desc_fr', title: 'Description (French)', type: 'text', rows: 3, group: 'translations' }),
    defineField({ name: 'desc_ar', title: 'Description (Arabic)', type: 'text', rows: 3, group: 'translations' }),

    // ---------------- SETTINGS ----------------
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Live', value: 'approved' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      group: 'settings',
    }),
  ],

  // ✨ Smart Preview (Exact same as your clothing standard)
  preview: {
    select: {
      title: 'name',
      price: 'price',
      status: 'status',
      inStock: 'inStock', 
      media: 'image',
    },
    prepare({ title, price, status, inStock, media }) {
      const stockText = inStock === false ? '🚫 Sold Out' : '✅ In Stock';
      return {
        title,
        subtitle: `${price ? price + ' MAD' : 'No Price'} • ${stockText} • ${status === 'approved' ? '🟢 Live' : '🟠 Draft'}`,
        media,
      }
    },
  },
})