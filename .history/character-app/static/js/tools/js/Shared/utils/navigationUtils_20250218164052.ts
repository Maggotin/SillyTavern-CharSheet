import {
  CampaignDataContract,
  CampaignUtils,
} from "../../rules-engine/es";

export function getLaunchGameUrl(campaign: CampaignDataContract): string {
  return `/games/${CampaignUtils.getId(campaign)}`;
}
