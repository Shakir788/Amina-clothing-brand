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
      title: 'Price (e.g., 450 DHS)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: {
        hotspot: true, // Photo crop karne ke liye
      },
      validation: (rule) => rule.required(),
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
        ],
      },
      initialValue: 'Collection 2024',
    }),
    // Extra languages support ke liye fields
    defineField({
      name: 'name_ar',
      title: 'Product Name (Arabic)',
      type: 'string',
    }),
    defineField({
      name: 'name_fr',
      title: 'Product Name (French)',
      type: 'string',
    }),
  ],
})