export default {
  name: 'review',
  title: 'Avis Client',
  type: 'document',
  fields: [
    {
      name: 'productId',
      title: 'Produit',
      type: 'reference',
      to: [{ type: 'cosmeticProduct' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'customerName',
      title: 'Nom du client',
      type: 'string',
      validation: (Rule: any) => Rule.required().max(60),
    },
    {
      name: 'city',
      title: 'Ville',
      type: 'string',
    },
    {
      name: 'rating',
      title: 'Note (1-5)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1).max(5),
    },
    {
      name: 'comment',
      title: 'Commentaire',
      type: 'text',
      rows: 3,
    },
    {
      name: 'approved',
      title: 'Approuvé ?',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'createdAt',
      title: 'Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
}