import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name (English)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (Unique ID)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    
    defineField({
      name: 'price',
      title: 'Price (Current Selling Price)', 
      type: 'number', // Changed to number for easier calculation
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'originalPrice',
      title: 'Original Price (For Sale Display)',
      description: 'Put original price (e.g., 2000). Leave blank if not on sale.',
      type: 'number',
    }),

    // 📸 MAIN IMAGE
    defineField({
      name: 'image',
      title: 'Main Product Image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),

    // 🎞️ IMAGE GALLERY
    defineField({
      name: 'gallery',
      title: 'Product Gallery',
      type: 'array',
      description: 'Add more photos (Back view, fabric zoom, etc.)',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

    // 📏 DYNAMIC SIZE SYSTEM
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      description: 'Select only the sizes that are in stock.',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'S', value: 'S' },
          { title: 'M', value: 'M' },
          { title: 'L', value: 'L' },
          { title: 'XL', value: 'XL' },
          { title: 'XXL', value: 'XXL' },
        ],
      },
    }),

    // 🎨 DYNAMIC COLOR SYSTEM (Ab asaan hai!)
    defineField({
      name: 'colors',
      title: 'Product Colors',
      type: 'array',
      description: 'Add colors. Use the name for label and picker for the actual color.',
      of: [
        {
          type: 'object',
          fields: [
            { 
              name: 'colorName', 
              title: 'Color Name (e.g. Onyx Black)', 
              type: 'string',
              validation: (rule) => rule.required(),
            },
            { 
              name: 'colorHex', 
              title: 'Pick Color', 
              type: 'color', // 👈 Ye magic hai! Ab dabba khulega select karne ke liye
              options: {
                disableAlpha: true // Transparency ki zaroorat nahi
              }
            },
          ],
          preview: {
            select: {
              title: 'colorName',
              subtitle: 'colorHex.hex'
            }
          }
        },
      ],
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Collection 2024', value: 'Collection 2024' },
          { title: 'Dresses', value: 'Dresses' },
          { title: 'Sets', value: 'Sets' },
          { title: 'Abayas', value: 'Abayas' },
        ],
      },
      initialValue: 'Collection 2024',
    }),

    // 🌐 Translations
    defineField({ name: 'name_ar', title: 'Product Name (Arabic)', type: 'string' }),
    defineField({ name: 'name_fr', title: 'Product Name (French)', type: 'string' }),

    // --- 👇 SELLER SYSTEM FIELDS ---
    defineField({
      name: 'status',
      title: 'Product Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft (Seller Uploaded)', value: 'draft' }, 
          { title: 'Approved (Live on Site)', value: 'approved' }, 
        ],
        layout: 'radio' 
      },
      initialValue: 'draft', 
    }),

    defineField({
      name: 'sellerEmail',
      title: 'Seller Email',
      type: 'string',
    }),
  ],
})