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
    defaultFontStyle: { fontFamily: 'Open Sans' },
  });

  return theme;
}


export const arraysMatch = (arr1: Array<string | number | boolean>, arr2: Array<string | number | boolean>) => {
  // Check if the arrays are the same length
  if (arr1.length !== arr2.length) return false;

  // Check if all items exist and are in the same order
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  // Otherwise, return true
  return true;
};


export const getBrowser = () => {

  // Opera 8.0+
  if ((!!window["opr"] && !!["opr"]["addons"]) || !!window["opera"] || navigator.userAgent.indexOf(' OPR/') >= 0) {
    return 'opera';
  }

  // Firefox 1.0+
  if (typeof window["InstallTrigger"] !== 'undefined') {
    return 'firefox';
  }

  // Safari 3.0+ "[object HTMLElementConstructor]" 
  if (/constructor/i.test(window["HTMLElement"] as unknown as string) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof window["safari"] !== 'undefined' && window["safari"].pushNotification))) {
    return 'safari';
  }

  // Internet Explorer 6-11
  if (/*@cc_on!@*/false || !!document["documentMode"]) {
    return 'ie';
  }

  // Edge 20+
  if (!(/*@cc_on!@*/false || !!document["documentMode"]) && !!window["StyleMedia"]) {
    return 'edge';
  }

  // Chrome 1+
  if (!!window["chrome"] && !!window["chrome"].webstore) {
    return 'chrome';
  }

  // Blink engine detection
  if (((!!window["chrome"] && !!window["chrome"].webstore) || ((!!window["opr"] && !!["opr"]["addons"]) || !!window["opera"] || navigator.userAgent.indexOf(' OPR/') >= 0)) && !!window["CSS"]) {
    return 'blink';
  }

  return undefined;
}