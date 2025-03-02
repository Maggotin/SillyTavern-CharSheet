// this implementation is temporary until we can natively dynamically import css files
// ref: https://react.dev/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#asset-loading
const darkTheme = /* css */ `
  :root {
    --ttui_color-primary--main: #374045;
    --ttui_color-primary--dark: #12181c;
    --ttui_color-primary--light: #75838b;
    --ttui_color-primary--contrast: #ffffff;

    --ttui_color-secondary--main: var(--ttui_red-500);
    --ttui_color-secondary--dark: var(--ttui_red-700);
    --ttui_color-secondary--light: var(--ttui_red-300);
    --ttui_color-secondary--contrast: var(--ttui_common-0);

    --ttui_color-error--main: #ed6c02;
    --ttui_color-error--dark: #c77700;
    --ttui_color-error--light: #ffb547;
    --ttui_color-error--contrast: #ffffff;

    --ttui_color-warning--main: #ed6c02;
    --ttui_color-warning--dark: #c77700;
    --ttui_color-warning--light: #ffb547;
    --ttui_color-warning--contrast: #ffffff;

    --ttui_color-info--main: #2196f3;
    --ttui_color-info--dark: #0b79d0;
    --ttui_color-info--light: #64b6f7;
    --ttui_color-info--contrast: #ffffff;

    --ttui_color-success--main: #4caf50;
    --ttui_color-success--dark: #3b873e;
    --ttui_color-success--light: #7bc67e;
    --ttui_color-success--contrast: #ffffff;

    --ttui_color-bg--paper: #ffffff;
    --ttui_color-bg--default: #f4f5f5;
    --ttui_color-bg--pane: #f9f6ef;
    --ttui_color-bg--scroll: #eee8db;

    --ttui_color-rarity--uncommon: #7ebe15;
    --ttui_color-rarity--rare: #41a9f2;
    --ttui_color-rarity--veryRare: #c364e7;
    --ttui_color-rarity--legendary: #ffb62a;
    --ttui_color-rarity--artifact: #f77558;
    --ttui_color-rarity--contrast: #000000;

    --ttui_color-reference--character: #ee8600;
    --ttui_color-reference--magicItem: #41a9f2;
    --ttui_color-reference--monster: #c60000;
    --ttui_color-reference--skill: #7ebe15;
    --ttui_color-reference--spell: #c364e7;
    --ttui_color-reference--contrast: #000000;

    --ttui_color-message--check: #c364e7;
    --ttui_color-message--custom: #ecedee;
    --ttui_color-message--damage: #f77558;
    --ttui_color-message--healSave: #7ebe15;
    --ttui_color-message--initiative: #ffb62a;
    --ttui_color-message--toHit: #41a9f2;

    --ttui_color-text--primary: #12181cff;
    --ttui_color-text--secondary: #12181ca3;
    --ttui_color-text--disabled: #12181c5c;

    --ttui_color-action--hover: var(--ttui_grey-100);
    --ttui_color-action--active: var(--ttui_grey-200);
    --ttui_color-action--selected: var(--ttui_grey-200);

    --ttui_color-megamenu--main: #26282a;
    --ttui_color-megamenu--dark: #1c1d1e;
    --ttui_color-megamenu--contrast: var(--ttui_common-0);
  }
`;

export default darkTheme;
