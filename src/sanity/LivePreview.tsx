import { Box, Card, Text } from '@sanity/ui'

export default function LivePreview({ document }: any) {
  const { displayed } = document
  const slug = displayed?.slug?.current

  if (!slug) {
    return (
      <Card padding={4} tone="caution" shadow={1} radius={2}>
        <Text align="center" size={2}>
          Please add a slug to the product to see the live preview.
        </Text>
      </Card>
    )
  }

  const websiteUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://www.aminaclothing.shop'

  
  const url = `${websiteUrl}/en/product/${slug}`

  return (
    <Box style={{ width: '100%', height: '100%' }}>
      <iframe
        src={url}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Live Preview"
      />
    </Box>
  )
}