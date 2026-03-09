'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import { colorInput } from '@sanity/color-input'
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'
import { myTheme } from './src/sanity/theme' 
import React from 'react' 

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  
  name: 'amina-studio', 
  title: 'AMINA | Luxury Moroccan Fashion', 
  
  theme: myTheme, 

  schema,
  plugins: [
    structureTool({structure}),
    colorInput(),
    visionTool({defaultApiVersion: apiVersion}),
  ],

  // 🔥 100% WORKING VIP BACKGROUND HACK 🔥
  studio: {
    components: {
      layout: (props: any) => {
        return React.createElement(
          React.Fragment,
          null,
          
          React.createElement(
            'style',
            null,
            `
              /* 1. Main Background & Wallpaper */
              div[data-ui="StudioLayout"] {
                background: linear-gradient(135deg, #f8f5f0 0%, #f4efe6 50%, #efe8dc 100%) !important;
              }
              div[data-ui="StudioLayout"]::before {
                content: "";
                position: absolute;
                inset: 0;
                background-image: url("https://images.unsplash.com/photo-1603570419880-0b8e0c7a5b74?q=80&w=2000");
                background-size: cover;
                background-position: center;
                opacity: 0.08; /* Wallpaper Opacity */
                pointer-events: none;
                z-index: 0;
              }

              /* 2. Glassmorphism Panels (Luxury Boxes) */
              div[data-ui="Pane"] {
                background-color: rgba(255, 255, 255, 0.75) !important;
                backdrop-filter: blur(12px) !important;
                -webkit-backdrop-filter: blur(12px) !important;
                border-radius: 16px !important;
                margin: 8px !important;
                box-shadow: 0 8px 30px rgba(195, 153, 119, 0.08) !important;
                border: 1px solid rgba(255, 255, 255, 0.6) !important;
                transition: all 0.3s ease !important;
                z-index: 1;
              }

              /* 3. Panel Hover Glow */
              div[data-ui="Pane"]:hover {
                background-color: rgba(255, 255, 255, 0.95) !important;
                box-shadow: 0 12px 40px rgba(195, 153, 119, 0.15) !important;
                transform: translateY(-2px);
              }

              /* 4. Smooth Buttons */
              button[data-intent="primary"] {
                border-radius: 8px !important;
                transition: all 0.3s ease !important;
              }
              button[data-intent="primary"]:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 15px rgba(195, 153, 119, 0.4) !important;
              }
            `
          ),
      
          props.renderDefault(props)
        )
      }
    }
  }
})