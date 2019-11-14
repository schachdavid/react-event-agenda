import hexRgb from 'hex-rgb';
import { createTheme } from 'office-ui-fabric-react';



// export const getPalette = () => {
//   return {
//     themePrimary: '#29b59a',
//     themeLighterAlt: '#020706',
//     themeLighter: '#061d19',
//     themeLight: '#0c362e',
//     themeTertiary: '#186c5d',
//     themeSecondary: '#249f88',
//     themeDarkAlt: '#39bca3',
//     themeDark: '#51c7b0',
//     themeDarker: '#79d5c4',
//     neutralLighterAlt: '#082a35',
//     neutralLighter: '#0c313d',
//     neutralLight: '#123c4b',
//     neutralQuaternaryAlt: '#174453',
//     neutralQuaternary: '#1c4a5a',
//     neutralTertiaryAlt: '#326476',
//     neutralTertiary: '#c8c8c8',
//     neutralSecondary: '#d0d0d0',
//     neutralPrimaryAlt: '#dadada',
//     neutralPrimary: '#ffffff',
//     neutralDark: '#f4f4f4',
//     black: '#f8f8f8',
//     white: '#05222c',
//   }
// };


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

export const getInvertedTheme = () => {
  let palette = getPalette();

  const whiteTmp = palette.white;

  //background color
  palette.white = palette.themePrimary;

  //icon color
  palette.themePrimary = whiteTmp;

  //hover background color
  palette.neutralLighter = palette.themeDark;

  // font color
  palette.neutralPrimary = whiteTmp;

  //hover icon color
  palette.themeDarkAlt = whiteTmp;

  // hover font color
  palette.neutralDark = whiteTmp;

  const theme = createTheme({
    palette: palette
  });

  return theme;

}


