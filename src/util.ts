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
    palette: newPalette,
    defaultFontStyle: { fontFamily: 'Open Sans'},
  });

  return theme;
}


export const arraysMatch = (arr1: Array<string | number | boolean>, arr2: Array<string | number | boolean>) =>  {
	// Check if the arrays are the same length
	if (arr1.length !== arr2.length) return false;

	// Check if all items exist and are in the same order
	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) return false;
	}

	// Otherwise, return true
	return true;
};
