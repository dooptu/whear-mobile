export const colorNames = [
  'black',
  'white',
  'gray',
  'navy',
  'blue',
  'red',
  'pink',
  'green',
  'yellow',
  'orange',
  'purple',
  'brown',
  'beige',
  'coral',
  'teal',
] as const;

export type ColorName = typeof colorNames[number];

export const colorHexMap: Record<ColorName, string> = {
  black: '#000000',
  white: '#FFFFFF',
  gray: '#808080',
  navy: '#000080',
  blue: '#0000FF',
  red: '#FF0000',
  pink: '#FFC0CB',
  green: '#008000',
  yellow: '#FFFF00',
  orange: '#FFA500',
  purple: '#800080',
  brown: '#A52A2A',
  beige: '#F5F5DC',
  coral: '#FF7F50',
  teal: '#008080',
};

export const getColorHex = (colorName: string): string => {
  return colorHexMap[colorName.toLowerCase() as ColorName] || '#808080';
};




