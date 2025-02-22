import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";

import { useSidebar } from "~/contexts/Sidebar";

import { toastMessageActions } from "../../../../../../tools/js/Shared/actions";

interface Props {
  errorMessage?: string;
}
export const PaneInitFailureContent: FC<Props> = ({ errorMessage }) => {
  const dispatch = useDispatch();
  const {
    sidebar: { setIsVisible },
  } = useSidebar();

  useEffect(() => {
    setIsVisible(false);
    dispatch(
      toastMessageActions.toastError(
        "Content Error",
        errorMessage ?? "We couldn't find that content! Please try again."
      )
    );
  }, [errorMessage, dispatch]);

  return null;
};
