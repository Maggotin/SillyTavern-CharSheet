import React from "react";

import { FullscreenModal } from "../FullscreenModal";

interface Props {
  conClsNames: Array<string>;
  acceptBtnClsNames: Array<string>;
  cancelBtnClsNames: Array<string>;
  heading: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmText: string;
  cancelText: string;
}
export class ConfirmModal extends React.PureComponent<Props, {}> {
  static defaultProps = {
    conClsNames: [],
    acceptBtnClsNames: [],
    cancelBtnClsNames: [],
    heading: "Confirm",
    confirmText: "Confirm",
    cancelText: "Cancel",
  };

  handleAccept = (): void => {
    const { onConfirm } = this.props;

    if (onConfirm) {
      onConfirm();
    }
  };

  handleCloseModal = (): void => {
    const { onCancel } = this.props;

    if (onCancel) {
      onCancel();
    }
  };

  render() {
    const {
      conClsNames,
      acceptBtnClsNames,
      cancelBtnClsNames,
      heading,
      children,
      confirmText,
      cancelText,
    } = this.props;

    return (
      <FullscreenModal
        clsNames={["confirm-modal", ...conClsNames]}
        acceptBtnClsNames={acceptBtnClsNames}
        cancelBtnClsNames={cancelBtnClsNames}
        onAccept={this.handleAccept}
        onCancel={this.handleCloseModal}
        isOpen={true}
        heading={heading}
        acceptChangesText={confirmText}
        cancelText={cancelText}
      >
        {children}
      </FullscreenModal>
    );
  }
}

export default ConfirmModal;
