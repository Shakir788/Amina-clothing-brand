// src/sanity/LivePreview.tsx

import { Box, Card, Text } from '@sanity/ui'

export default function LivePreview({ document }: any) {
  const { displayed } = document
  const slug = displayed?.slug?.current

  if (!slug) {
    return (
      <Card padding={4} tone="caution" shadow={1} radius={2}>
        <Text align="center" size={2}>
          🔴 Pehle "Slug" generate karo tab Preview dikhega.
        </Text>
      </Card>
    )
  }
  const url = `http://www.aminaclothing.shop/${slug}`

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