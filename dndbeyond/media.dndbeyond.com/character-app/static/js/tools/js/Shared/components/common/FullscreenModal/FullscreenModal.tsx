import React from "react";
import Modal from "react-modal";

import { Button } from "@dndbeyond/character-components/es";

import styles from "./styles.module.css";

interface Props extends Modal.Props {
  clsNames: Array<string>;
  acceptBtnClsNames: Array<string>;
  cancelBtnClsNames: Array<string>;
  heading: string;
  onAccept?: () => void;
  onCancel?: () => void;
  onRequestClose?: () => void;
  updateCallback?: () => void;
  doubleConfirm?: boolean;
  hideActions?: boolean;
  acceptChangesText: string;
  cancelText: string;
}
interface State {
  isOpen: boolean;
}
export class FullscreenModal extends React.PureComponent<Props, State> {
  static defaultProps = {
    clsNames: [],
    acceptBtnClsNames: [],
    cancelBtnClsNames: [],
    acceptChangesText: "Apply",
    cancelText: "Cancel",
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  componentDidUpdate() {
    const { updateCallback } = this.props;
    if (updateCallback) {
      updateCallback();
    }
  }

  handleAccept = (): void => {
    const { onAccept } = this.props;

    if (onAccept) {
      onAccept();
    }
  };

  handleCancel = (): void => {
    const { onCancel } = this.props;

    if (onCancel) {
      onCancel();
    }
  };

  handleClose = (): void => {
    const { onCancel, onRequestClose } = this.props;

    if (onCancel) {
      onCancel();
    } else if (onRequestClose) {
      onRequestClose();
    }
  };

  render() {
    const {
      isOpen,
      children,
      clsNames,
      acceptBtnClsNames,
      cancelBtnClsNames,
      heading,
      hideActions,
      acceptChangesText,
      cancelText,
    } = this.props;

    if (!isOpen) {
      return null;
    }

    let modalClsNames: Array<string> = [
      "fullscreen-modal",
      styles.builderModalOverride,
    ];
    if (hideActions) {
      modalClsNames.push("fullscreen-modal-noactions");
    }
    if (clsNames) {
      modalClsNames = [...modalClsNames, ...clsNames];
    }

    return (
      <Modal
        role="dialog"
        className={modalClsNames.join(" ")}
        overlayClassName="fullscreen-modal-overlay"
        {...this.props}
        aria={{ labelledby: "fullscreen-modal-heading" }}
      >
        <div className="fullscreen-modal-header">
          <div
            className="fullscreen-modal-heading"
            id="fullscreen-modal-heading"
          >
            {heading}
          </div>
          <div className="fullscreen-modal-close">
            <span
              className="fullscreen-modal-close-btn"
              onClick={this.handleClose}
            />
          </div>
        </div>
        <div className="fullscreen-modal-content">{children}</div>
        {!hideActions && (
          <div className="fullscreen-modal-footer">
            <div className="fullscreen-modal-cancel fullscreen-modal-action">
              <Button
                style="modal-cancel"
                clsNames={cancelBtnClsNames}
                onClick={this.handleCancel}
              >
                {cancelText}
              </Button>
            </div>
            <div className="fullscreen-modal-accept fullscreen-modal-action">
              <Button
                style="modal"
                clsNames={acceptBtnClsNames}
                onClick={this.handleAccept}
              >
                {acceptChangesText}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    );
  }
}

export default FullscreenModal;
