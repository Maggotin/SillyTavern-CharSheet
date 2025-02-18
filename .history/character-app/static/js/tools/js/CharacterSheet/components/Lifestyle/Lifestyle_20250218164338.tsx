import {
  Collapsible,
  TypeScriptUtils,
} from "../../character-components/es";
import {
  HtmlSelectOption,
  RuleDataUtils,
} from "../../character-rules-engine/es";

import CurrencyPaneSelectEditor from "../../../Shared/containers/panes/CurrencyPane/CurrencyPaneSelectEditor";

const Lifestyle = ({
  lifestyle,
  ruleData,
  isReadonly,
  handleLifestyleUpdate,
}) => {
  const lifestyleData = RuleDataUtils.getLifestyles(ruleData);
  const lifestyleOptions: Array<HtmlSelectOption> = lifestyleData
    .map((lifestyle) => {
      if (lifestyle.id === null) {
        return null;
      }
      return {
        label: `${lifestyle.name} ${
          lifestyle.cost === "-" ? "" : `(${lifestyle.cost})`
        }`,
        value: lifestyle.id,
      };
    })
    .filter(TypeScriptUtils.isNotNullOrUndefined);

  let lifestyleDescriptionNode: React.ReactNode;
  if (lifestyle !== null) {
    lifestyleDescriptionNode = lifestyle.description;
  }

  return (
    <div className="ct-currency-pane__lifestyle">
      <CurrencyPaneSelectEditor
        label="Lifestyle Expenses"
        options={lifestyleOptions}
        defaultValue={lifestyle === null ? null : lifestyle.id}
        propertyKey="lifestyleId"
        onUpdate={handleLifestyleUpdate}
        isReadonly={isReadonly}
      />
      {lifestyleDescriptionNode && (
        <Collapsible
          className={"ct-currency-pane__lifestyle-detail"}
          header={
            <span className="ct-currency-pane__lifestyle-detail-header">
              {lifestyle?.name ?? "Lifestyle"} Details
            </span>
          }
          layoutType="minimal"
        >
          <div className="ct-currency-pane__lifestyle-description">
            {lifestyleDescriptionNode}
          </div>
        </Collapsible>
      )}
    </div>
  );
};

export default Lifestyle;
