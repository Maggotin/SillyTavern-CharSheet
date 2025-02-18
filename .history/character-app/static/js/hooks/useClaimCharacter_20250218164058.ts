import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { characterSelectors } from "../../rules-engine/es";

import { toastMessageActions } from "~/tools/js/Shared/actions";

import {
  claimCharacter as claimCharacterApi,
  joinCampaign as joinCampaignApi,
} from "../helpers/characterServiceApi";

interface UseClaimCharacterProps {
  campaignJoinCode: string | null;
  isAssigned: boolean;
}

export const useClaimCharacter = ({
  campaignJoinCode,
  isAssigned,
}: UseClaimCharacterProps) => {
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newCharacterId, setNewCharacterId] = useState<number | null>(null);
  const [campaignId, setCampaignId] = useState<number | null>(null);

  const characterId = useSelector(characterSelectors.getId);

  const dispatch = useDispatch();

  const claimCharacter = useCallback(async () => {
    try {
      setIsLoading(true);

      let clonedId;

      const claimResponse = await claimCharacterApi(characterId, isAssigned);
      if (claimResponse.ok) {
        const data = await claimResponse.json();
        clonedId = data.id;
        setNewCharacterId(clonedId);
      } else {
        throw new Error(`There was an error claiming character ${characterId}`);
      }

      if (campaignJoinCode) {
        const joinResponse = await joinCampaignApi(campaignJoinCode, clonedId);
        if (joinResponse.ok) {
          const data = await joinResponse.json();
          setCampaignId(data.campaignId);
        } else {
          throw new Error(
            `There was an error adding character ${clonedId} to campaign join code ${campaignJoinCode}`
          );
        }
      }
    } catch (error) {
      console.error(error);

      dispatch(
        toastMessageActions.toastError("Error", "An unexpected error occurred.")
      );
    } finally {
      setIsLoading(false);
      setIsFinished(true);
    }
  }, [campaignJoinCode, characterId, dispatch, isAssigned]);

  return [
    claimCharacter,
    isLoading,
    isFinished,
    newCharacterId,
    campaignId,
  ] as const;
};
