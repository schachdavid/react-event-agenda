import hexRgb from 'hex-rgb';



export const getPalette = () => {
  return {
    themePrimary: '#038387',
    themeLighterAlt: '#f0fafa',
    themeLighter: '#c7ebec',
    themeLight: '#9bd9db',
    themeTertiary: '#4bb4b7',
    themeSecondary: '#159196',
    themeDarkAlt: '#02767a',
    themeDark: '#026367',
    themeDarker: '#02494c',
    neutralLighterAlt: '#f8f8f8',
    neutralLighter: '#f4f4f4',
    neutralLight: '#eaeaea',
    neutralQuaternaryAlt: '#dadada',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c8c8',
    neutralTertiary: '#bab8b7',
    neutralSecondary: '#a3a2a0',
    neutralPrimaryAlt: '#8d8b8a',
    neutralPrimary: '#323130',
    neutralDark: '#605e5d',
    black: '#494847',
    white: '#ffffff',
  }
}

export const getRGBPalette = () => {
  let palette = getPalette();
  Object.values(palette).forEach(value => {
    let rgb = hexRgb(value);
    value = `${rgb.red}, ${rgb.blue}, ${rgb.green}`
  });
  return palette;
}
