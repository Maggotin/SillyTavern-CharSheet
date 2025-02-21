/**
 *
 * @param armorClassSources
 * @param initialValue
 */
export function deriveArmorClassSupplierTotal(armorClassSources, initialValue = 0) {
    return armorClassSources.reduce((acc, armorClassSource) => {
        if (armorClassSource.amount) {
            acc += armorClassSource.amount;
        }
        return acc;
    }, initialValue);
}
