/**
 * Convert Hex code to RGB before getting ratio
 * Return whether or not the colors meet the
 * minimum requirements for Accessibility
 */
export const checkContrast = (color1, color2) => {
  let [luminance1, luminance2] = [color1, color2].map((color) => {
    /* Remove the last 2 characters if 8 digits */
    color = color.length > 7 ? color.slice(0, 6) : color;
    /* Remove the leading hash sign if it exists */
    color = color.startsWith("#") ? color.slice(1) : color;

    let r = parseInt(color.slice(0, 2), 16);
    let g = parseInt(color.slice(2, 4), 16);
    let b = parseInt(color.slice(4, 6), 16);

    return luminance(r, g, b);
  });

  const ratio = contrastRatio(luminance1, luminance2);

  const { didPass } = meetsMinimumRequirements(ratio);
  return didPass;
};

export const contrastRatio = (luminance1, luminance2) => {
  let lighterLum = Math.max(luminance1, luminance2);
  let darkerLum = Math.min(luminance1, luminance2);

  return (lighterLum + 0.05) / (darkerLum + 0.05);
};

/**
 * Function to determine relative luminance from RGB values
 */
export const luminance = (r: number, g: number, b: number) => {
  let [lumR, lumG, lumB] = [r, g, b].map((component) => {
    let proportion = component / 255;

    return proportion <= 0.03928
      ? proportion / 12.92
      : Math.pow((proportion + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * lumR + 0.7152 * lumG + 0.0722 * lumB;
};

/**
 * Determine whether the given contrast ratio meets WCAG
 * requirements at any level (AA Large, AA, or AAA). In the return
 * value, `isPass` is true if the ratio meets or exceeds the minimum
 * of at least one level, and `maxLevel` is the strictest level that
 * the ratio passes.
 */
const WCAG_MINIMUM_RATIOS = [
  ["AA Large", 3],
  ["AA", 4.5],
  ["AAA", 7],
];

export const meetsMinimumRequirements = (ratio) => {
  let didPass = false;
  let maxLevel: string | number = "";

  for (const [level, minRatio] of WCAG_MINIMUM_RATIOS) {
    if (ratio < minRatio) break;

    didPass = true;
    maxLevel = level;
  }

  return { didPass, maxLevel };
};
