import { twitchUrl, youtubeUrl } from "../../../shared/constants";

const ddbImageBase = "https://media.dndbeyond.com/mega-menu";

export const primaryItems = [
  {
    label: "Community Update",
    imageUrl: `${ddbImageBase}/c2979f81837d8ee7c113a874da2909db.png`,
    link: "https://www.dndbeyond.com/community-update",
  },
  {
    label: "Twitch",
    imageUrl: `${ddbImageBase}/443085c3173d345e90d29881d8442a59.png`,
    link: twitchUrl,
  },
  {
    label: "Youtube",
    imageUrl: `${ddbImageBase}/d5e1b6d07482834ebfcbc1f04bd6476d.png`,
    link: youtubeUrl,
  },
  {
    label: "Changelog",
    imageUrl: `${ddbImageBase}/4af3d4c196428ab0809cf71d332d540d.png`,
    link: "https://www.dndbeyond.com/changelog",
  },
];
