import React from "react";
import { connect, DispatchProp } from "react-redux";

import { confirmModalActions } from "../../../Shared/actions";
import { ConfirmModal as ConfirmModalComponent } from "../../../Shared/components/common/ConfirmModal";
import { confirmModalSelectors } from "../../../Shared/selectors";
import { ConfirmModal } from "../../../Shared/stores/typings";

interface Props extends DispatchProp {
  modal: ConfirmModal | null;
}
class ConfirmModalManager extends React.PureComponent<Props> {
  handleConfirm = (): void => {
    const { dispatch, modal } = this.props;

    if (modal) {
      dispatch(confirmModalActions.remove(modal.id));
      if (modal.onConfirm) {
        modal.onConfirm();
      }
    }
  };

  handleCancel = () => {
    const { dispatch, modal } = this.props;

    if (modal) {
      dispatch(confirmModalActions.remove(modal.id));
      if (modal.onCancel) {
        modal.onCancel();
      }
    }
  };

  render() {
    const { modal } = this.props;

    if (!modal) {
      return null;
    }

    return (
      <ConfirmModalComponent
        heading={modal.heading}
        conClsNames={modal.conClsNames}
        acceptBtnClsNames={modal.acceptBtnClsNames}
        cancelBtnClsNames={modal.cancelBtnClsNames}
        onConfirm={this.handleConfirm}
        onCancel={this.handleCancel}
      >
        {modal.content}
      </ConfirmModalComponent>
    );
  }
}

function mapStateToProps(state) {
  return {
    modal: confirmModalSelectors.getActiveConfirmModal(state),
  };
}

export default connect(mapStateToProps)(ConfirmModalManager);
