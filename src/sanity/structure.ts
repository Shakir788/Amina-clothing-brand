import type { StructureResolver } from 'sanity/structure'
import { TagIcon } from '@sanity/icons' 
import LivePreview from './LivePreview'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('AMINA 👑') 
    .items([

      S.listItem()
        .title('👗 Dress Collection')
        .icon(TagIcon)
        .child(
          S.list()
            .title('Manage Collection')
            .items([

              // 🟢 LIVE PRODUCTS LIST
              S.listItem()
                .title('🟢 Live on Website')
                .child(
                  S.documentList()
                    .title('🟢 Live Products')
                    .id('liveProducts')
                    .schemaType('product')
                    .filter('_type == "product" && status == "approved"')
                    .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
                    
                    .child((documentId) =>
                      S.document()
                        .documentId(documentId)
                        .schemaType('product')
                        .views([
                          S.view.form().id('editor').title('✏️ Editor'),
                          S.view.component(LivePreview).id('live-preview').title('👀 Live Website'),
                        ])
                    )
                ),

              
              S.listItem()
                .title('📝 Drafts (In Progress)')
                .child(
                  S.documentList()
                    .title('📝 Draft Products')
                    .id('draftProducts')
                    .schemaType('product')
                    .filter('_type == "product" && status == "draft"')
                    .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
                    
                    .child((documentId) =>
                      S.document()
                        .documentId(documentId)
                        .schemaType('product')
                        .views([
                          S.view.form().id('editor').title('✏️ Editor'),
                          S.view.component(LivePreview).id('live-preview').title('👀 Live Website'),
                        ])
                    )
                ),

              S.divider(),

              // 📂 ALL PRODUCTS LIST
              S.listItem()
                .title('📂 All Products (Master List)')
                .child(
                  S.documentTypeList('product')
                    .title('All Products')
                    .child((documentId) =>
                      S.document()
                        .documentId(documentId)
                        .schemaType('product')
                        .views([
                          S.view.form().id('editor').title('✏️ Editor'),
                          S.view.component(LivePreview).id('live-preview').title('👀 Live Website'),
                        ])
                    )
                ),
            ])
        ),

      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => listItem.getId() !== 'product'
      ),
    ])