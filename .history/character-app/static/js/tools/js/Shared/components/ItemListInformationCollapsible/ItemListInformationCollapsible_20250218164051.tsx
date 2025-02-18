import {
  Constants,
  DefinitionUtils,
  Item,
  ItemUtils,
  RuleData,
  RuleDataUtils,
} from "../../rules-engine/es";

import { HelperTextAccordion } from "~/components/HelperTextAccordion";

interface Props {
  ruleData: RuleData;
  item: Item;
}

export const ItemListInformationCollapsible = ({ ruleData, item }: Props) => {
  const definitionKey = DefinitionUtils.hack__generateDefinitionKey(
    ItemUtils.getEntityTypeId(item),
    ItemUtils.getId(item)
  );
  const builderText = RuleDataUtils.getBuilderHelperTextByDefinitionKeys(
    [definitionKey],
    ruleData,
    Constants.DisplayConfigurationTypeEnum.ITEM
  );

  return (
    <div className="ct-item-list-information-collapsible">
      <HelperTextAccordion builderHelperText={builderText} />
    </div>
  );
};
