import type {StructureResolver} from 'sanity/structure'
import LivePreview from './LivePreview'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items(
      S.documentTypeListItems().map((item) => {
        
        if (item.getId() === 'product') {
          return item.child(
            S.documentTypeList('product')
              .title('Products')
              .child((documentId) => 
                S.document()
                  .documentId(documentId)
                  .schemaType('product')
                  .views([
                    // 👇 FIX: Maine yahan '.id()' add kar diya taaki Emoji error na de
                    S.view.form().id('editor').title('✏️ Editor'),
                    
                    S.view
                      .component(LivePreview)
                      .id('live-preview') // 👈 Ye ID safe hai (No Emojis)
                      .title('👀 Live Website')
                  ])
              )
          )
        }

        return item
      })
    )