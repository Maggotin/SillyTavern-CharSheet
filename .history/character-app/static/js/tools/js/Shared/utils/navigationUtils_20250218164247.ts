import {
  CampaignDataContract,
  CampaignUtils,
} from "../../character-rules-engine/es";

export function getLaunchGameUrl(campaign: CampaignDataContract): string {
  return `/games/${CampaignUtils.getId(campaign)}`;
}
