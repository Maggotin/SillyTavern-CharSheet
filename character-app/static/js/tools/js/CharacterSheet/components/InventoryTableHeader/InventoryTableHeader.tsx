import React from "react";

interface Props {
  showNotes?: boolean;
}
export const InventoryTableHeader: React.FC<Props> = ({ showNotes = true }) => {
  return (
    <div className="ct-inventory__row-header">
      <div className="ct-inventory__colstcs-inventory__col--active">Active</div>
      <div className="ct-inventory__colstcs-inventory__col--name">Name</div>
      <div className="ct-inventory__colstcs-inventory__col--weight">Weight</div>
      <div className="ct-inventory__colstcs-inventory__col--qty">Qty</div>
      <div className="ct-inventory__colstcs-inventory__col--cost">Cost (gp)</div>
      {showNotes && (
        <div className="ct-inventory__colstcs-inventory__col--notes">Notes</div>
      )}
    </div>
  );
};

export default InventoryTableHeader;
