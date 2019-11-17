import { IPalette, createTheme } from 'office-ui-fabric-react';


export const invertTheme = (palette: Partial<IPalette>) => {

  const newPalette = Object.assign({}, palette);

  const whiteTmp = newPalette.white;

  //background color
  newPalette.white = newPalette.themePrimary;

  //icon color
  newPalette.themePrimary = whiteTmp;

  //hover background color
  newPalette.neutralLighter = newPalette.themeDark;

  // font color
  newPalette.neutralPrimary = whiteTmp;

  //hover icon color
  newPalette.themeDarkAlt = whiteTmp;

  // hover font color
  newPalette.neutralDark = whiteTmp;

  const theme = createTheme({
    palette: newPalette
  });

  return theme;

}