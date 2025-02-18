import { useParams } from "react-router-dom";

import useUserName from "~/hooks/useUserName";
import { SheetBuilderApp } from "~/tools/js";

export default function Builder() {
  const { characterId } = useParams();
  const username = useUserName();
  let parsedId: number | null = null;
  try {
    if (characterId) {
      parsedId = parseInt(characterId, 10);
    }
  } catch (e) {}

  return <SheetBuilderApp characterId={parsedId} readOnly={!username} />;
}
