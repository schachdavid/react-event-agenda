import { IPalette, createTheme } from 'office-ui-fabric-react';


export const invertTheme = (palette: Partial<IPalette>) => {

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