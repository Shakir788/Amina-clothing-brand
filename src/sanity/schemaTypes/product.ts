import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: () => '👗', 

  groups: [
    { name: 'basic', title: '📝 Basic Info', default: true },
    { name: 'media', title: '📸 Images & Colors' },
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
      title: 'Price (DHS)',
      type: 'number',
      validation: (rule) => rule.required(),
      group: 'basic',
    }),

    defineField({
      name: 'originalPrice',
      title: 'Original Price (Crossed Out)',
      description: 'Optional: Use this to show a discount (e.g. 1200)',
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
          { title: 'Collection 2026', value: 'Collection 2026' },
          { title: 'Dresses', value: 'Dresses' },
          { title: 'Sets', value: 'Sets' },
          { title: 'Abayas', value: 'Abayas' },
        ],
      },
      initialValue: 'Collection 2026',
      group: 'basic',
    }),

    // ✨ NAYA: OUT OF STOCK TOGGLE ✨
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

    // ---------------- COLORS (SMART VIP VERSION) ----------------
    defineField({
      name: 'colors',
      title: '🎨 Available Colors (With Photos & Details)',
      description: 'Add colors, upload specific angle photos, and custom descriptions here.',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'object',
          options: {
            collapsible: true, 
            collapsed: false,
          },
          fieldsets: [
            { name: 'names', title: 'Color Names', options: { collapsible: true } },
            { name: 'media', title: 'Images', options: { collapsible: true } },
            { name: 'desc', title: 'Descriptions', options: { collapsible: true } },
          ],
          fields: [
            // --- NAMES ---
            { name: 'colorName', title: 'Color Name (English)', type: 'string', fieldset: 'names' },
            { name: 'colorName_fr', title: 'Color Name (French)', type: 'string', fieldset: 'names' },
            { name: 'colorName_ar', title: 'Color Name (Arabic)', type: 'string', fieldset: 'names' },
            { 
              name: 'colorHex', 
              title: 'Pick a Color', 
              type: 'color', 
              options: { disableAlpha: true }, 
              fieldset: 'names' 
            },

            // --- IMAGES ---
            {
              name: 'colorImages',
              title: '📸 Images for this Color',
              type: 'array',
              of: [{ type: 'image', options: { hotspot: true } }],
              options: { layout: 'grid' },
              fieldset: 'media',
            },

            // --- DESCRIPTIONS ---
            { name: 'colorDescription', title: 'Description (English)', type: 'text', rows: 2, fieldset: 'desc' },
            { name: 'colorDescription_fr', title: 'Description (French)', type: 'text', rows: 2, fieldset: 'desc' },
            { name: 'colorDescription_ar', title: 'Description (Arabic)', type: 'text', rows: 2, fieldset: 'desc' },
          ],
          preview: {
            select: {
              title: 'colorName',
              subtitle: 'colorHex.hex',
              media: 'colorImages.0',
            }
          },
        },
      ],
    }),

    defineField({
      name: 'sizes',
      title: 'Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'XS', value: 'XS' }, { title: 'S', value: 'S' },
          { title: 'M', value: 'M' }, { title: 'L', value: 'L' },
          { title: 'XL', value: 'XL' }, { title: 'XXL', value: 'XXL' },
        ],
      },
      group: 'media',
    }),

    // ---------------- TRANSLATIONS ----------------
    defineField({ name: 'name_fr', title: 'Main Product French Name', type: 'string', group: 'translations' }),
    defineField({ name: 'name_ar', title: 'Main Product Arabic Name', type: 'string', group: 'translations' }),

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

    defineField({
      name: 'sellerEmail',
      title: 'Seller Email',
      type: 'string',
      readOnly: true,
      group: 'settings',
    }),
  ],

  // ✨ NAYA: Sanity list me hi dikhega ki product stock me hai ya nahi
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
        subtitle: `${price ? price + ' DHS' : 'No Price'} • ${stockText} • ${status === 'approved' ? '🟢 Live' : '🟠 Draft'}`,
        media,
      }
    },
  },
})