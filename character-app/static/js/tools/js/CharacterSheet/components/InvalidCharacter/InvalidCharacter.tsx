import { FC } from "react";

import { BuilderLinkButton } from "../../../Shared/components/common/LinkButton";

interface InvalidCharacterProps {
  builderUrl: string;
  isReadonly: boolean;
}

export const InvalidCharacter: FC<InvalidCharacterProps> = ({
  builderUrl,
  isReadonly,
}) => {
  return (
    <div className="ct-invalid-character">
      <h2>Character Not Ready!</h2>

      <p>
        The current character is not accessible because it is missing either a{" "}
        <strong>Species</strong>, <strong>Class</strong> or{" "}
        <strong>Ability Scores</strong>.
      </p>

      {!isReadonly && (
        <>
          <p>
            Return to the character builder to complete the character creation
            process.
          </p>

          <p>
            <BuilderLinkButton
              url={builderUrl}
              className="ct-invalid-character__button"
              size="oversized"
            >
              Character Builder
            </BuilderLinkButton>
          </p>
        </>
      )}
    </div>
  );
};
