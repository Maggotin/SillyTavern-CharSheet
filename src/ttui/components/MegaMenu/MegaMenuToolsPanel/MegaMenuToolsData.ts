import type { MegaMenuCardProps } from "../MegaMenuCard";

const ddbImageBase = "https://media.dndbeyond.com/mega-menu";

export const characterBuilder: MegaMenuCardProps = {
  label: "Character Builder",
  imageUrl: `${ddbImageBase}/323a928e32eff87dee85dfbe0793ce12.jpg`,
  link: "https://www.dndbeyond.com/characters/builder",
};

export const primaryItems: MegaMenuCardProps[] = [
  {
    label: "Maps",
    imageUrl: `${ddbImageBase}/049ddb9085342521d25c5230451cfd45.jpg`,
    link: "https://www.dndbeyond.com/games",
    flags: [{ label: "Beta", variant: "info" }],
  },
  {
    label: "Encounters",
    imageUrl: `${ddbImageBase}/e434a8385f9619f0d52480c3c3987059.jpg`,
    link: "https://www.dndbeyond.com/encounter-builder",
    flags: [{ label: "Beta", variant: "info" }],
  },
];

export const secondaryItems: MegaMenuCardProps[] = [
  {
    label: "Mobile App",
    imageUrl: `${ddbImageBase}/3aa58aac2d02bb52d62204e158b48ce6.jpg`,
    link: "https://www.dndbeyond.com/player-app",
  },
  {
    label: "Avrae Discord Bot",
    imageUrl: `${ddbImageBase}/28d923cd45ad209411ef1ff07993721b.jpg`,
    link: "https://avrae.io/",
  },
];
