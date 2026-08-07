export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
    },
    {
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    },
    {
      name: 'city',
      title: 'City',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Full Address',
      type: 'text',
    },
    {
      name: 'cartItems',
      title: 'Cart Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'productName', type: 'string' },
            { name: 'price', type: 'number' },
            { name: 'quantity', type: 'number' },
            { name: 'image', type: 'string' }
          ]
        }
      ]
    },
    {
      name: 'totalPrice',
      title: 'Total Price',
      type: 'number',
    },
    {
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'radio'
      },
      initialValue: 'pending'
    },
    {
      name: 'orderDate',
      title: 'Order Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },

    // ===== NAYE FIELDS — Payment Verification =====
    {
      name: 'paymentMethod',
      title: 'Mode de Paiement',
      type: 'string',
      options: {
        list: [
          { title: 'Cash Plus QR (En ligne)', value: 'online_qr' },
          { title: 'WhatsApp / COD', value: 'whatsapp_cod' },
        ],
        layout: 'radio'
      },
      initialValue: 'whatsapp_cod'
    },
    {
      name: 'paymentStatus',
      title: 'Statut du Paiement',
      type: 'string',
      description: 'Uniquement pour les paiements en ligne. Vérifiez le montant reçu sur Cash Plus avant de confirmer.',
      options: {
        list: [
          { title: '⏳ En attente de vérification', value: 'pending_verification' },
          { title: '✅ Vérifié', value: 'verified' },
          { title: '❌ Rejeté (montant incorrect)', value: 'rejected' },
        ],
        layout: 'radio'
      },
      hidden: ({ document }: any) => document?.paymentMethod !== 'online_qr',
    },
    {
      name: 'transactionId',
      title: 'Référence Transaction (Cash Plus)',
      type: 'string',
      description: 'Fournie par le client, si disponible',
      hidden: ({ document }: any) => document?.paymentMethod !== 'online_qr',
    },
    {
      name: 'paymentScreenshot',
      title: 'Capture d\'écran du Paiement',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ document }: any) => document?.paymentMethod !== 'online_qr',
    },
  ]
}