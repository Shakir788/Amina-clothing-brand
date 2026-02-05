import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  // 1. ✨ TABS (Groups) - Form ko clean rakhne ke liye
  groups: [
    {
      name: 'basic',
      title: '📝 Basic Info',
      default: true,
    },
    {
      name: 'media',
      title: '📸 Images & Colors',
    },
    {
      name: 'translations',
      title: '🌍 Translations',
    },
    {
      name: 'settings',
      title: '⚙️ Settings',
    },
  ],
  fields: [
    // --- GROUP 1: BASIC INFO ---
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
      title: 'Description',
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
          { title: 'Collection 2025', value: 'Collection 2025' },
          { title: 'Dresses', value: 'Dresses' },
          { title: 'Sets', value: 'Sets' },
          { title: 'Abayas', value: 'Abayas' },
        ],
      },
      initialValue: 'Collection 2025',
      group: 'basic',
    }),

    // --- GROUP 2: IMAGES & COLORS ---
    defineField({
      name: 'image',
      title: 'Main Cover Image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      group: 'media',
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      options: { layout: 'grid' }, // 👈 Grid layout se photos saaf dikhengi
      group: 'media',
    }),
    // 🎨 COLOR PICKER (Jo ab kaam karega!)
    defineField({
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'object',
          fields: [
            { 
              name: 'colorName', 
              title: 'Color Name', 
              type: 'string', 
              initialValue: 'Custom Color' 
            },
            { 
              name: 'colorHex', 
              title: 'Pick a Color', 
              type: 'color', // 👈 Plugin ka jaadu yahan chalega
              options: { disableAlpha: true }
            },
          ],
          preview: {
            select: {
              title: 'colorName',
              subtitle: 'colorHex.hex',
              media: 'colorHex' // Color ka dabba list mein dikhega
            }
          }
        }
      ]
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

    // --- GROUP 3: TRANSLATIONS ---
    defineField({ name: 'name_fr', title: 'French Name', type: 'string', group: 'translations' }),
    defineField({ name: 'name_ar', title: 'Arabic Name', type: 'string', group: 'translations' }),

    // --- GROUP 4: SETTINGS ---
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Live', value: 'approved' }
        ],
        layout: 'radio'
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
  
  // 👀 Live Preview in List
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title,
        subtitle: `${subtitle} DHS`,
        media: media,
      }
    },
  },
})