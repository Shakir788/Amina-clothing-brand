import { buildLegacyTheme } from 'sanity'

const props = {
  '--my-white': '#F4F1EA',
  '--my-black': '#111111',
  '--my-brand': '#C39977',
  '--my-red': '#8C3A3A',
  '--my-yellow': '#F4B400',
  '--my-green': '#25D366',
}

export const myTheme = buildLegacyTheme({
  '--black': props['--my-black'],
  '--white': props['--my-white'],
  '--gray': '#888',
  '--gray-base': '#888',
  '--component-bg': props['--my-white'],
  '--component-text-color': props['--my-black'],
  '--brand-primary': props['--my-brand'],
  '--default-button-color': '#666',
  '--default-button-primary-color': props['--my-brand'],
  '--default-button-success-color': props['--my-green'],
  '--default-button-warning-color': props['--my-yellow'],
  '--default-button-danger-color': props['--my-red'],
  '--state-info-color': props['--my-brand'],
  '--state-success-color': props['--my-green'],
  '--state-warning-color': props['--my-yellow'],
  '--state-danger-color': props['--my-red'],
  '--main-navigation-color': props['--my-black'],
  '--main-navigation-color--inverted': props['--my-white'],
  '--focus-color': props['--my-brand'],
})