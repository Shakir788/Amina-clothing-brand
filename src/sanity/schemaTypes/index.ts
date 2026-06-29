import { type SchemaTypeDefinition } from 'sanity'
import product from './product'
import order from './order'
import cosmeticProduct from './cosmeticProduct' 

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    product, 
    order, 
    cosmeticProduct 
  ],
}