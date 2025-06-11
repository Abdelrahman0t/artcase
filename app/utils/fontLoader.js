// utils/fontLoader.js
import WebFont from 'webfontloader';  // If using Web Font Loader

// Function to load fonts dynamically using Web Font Loader
export const loadFont = (fontFamily, weight  = '400', style  = 'normal') => {
    const fontKey = `${fontFamily}:${weight}:${style}`;
    if (document.fonts.check(`1em ${fontFamily}`)) {
      return; // Font is already loaded
    } 
  
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
      ' ',
      '+'
    )}:ital,wght@${style === 'italic' ? '1' : '0'},${weight}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  };
  

// Alternatively, if you're using the Google Fonts API directly:
// Function to load fonts dynamically using Google Fonts API
export const loadGoogleFont = (fontFamily) => {
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};
