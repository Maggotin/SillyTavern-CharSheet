import { HTMLAttributes } from "react";
import { useErrorHandling } from "./useErrorHandling";

export interface MaxLengthErrorHandler {
    handleMaxLengthErrorMsg: (value: string) => void;
    hideError: () => void;
    MaxLengthErrorMessage: () => JSX.Element;
};

export const useMaxLengthErrorHandling = (
    initialState: boolean,
    maxLength: number | null,
    errMsg: string = "",
    errorMessageAttributes?: HTMLAttributes<HTMLDivElement>
): MaxLengthErrorHandler => {
    errMsg ||= `The max length is ${maxLength} characters.`;

    const {
        showError,
        setShowError,
        ErrorMessage,
    } = useErrorHandling(initialState, errMsg, errorMessageAttributes);

    const handleMaxLengthErrorMsg = (value: string): void => {
        if (!maxLength) {
            // Skip if maxLength is 0 or not set.
            return;
        }

        const isTooLong = (value?.length ?? 0) >= (maxLength ?? 0);
        if (isTooLong !== showError) {
            setShowError(isTooLong);
        }
    };

    const hideError = () => {
        setShowError(false);
    }

    const MaxLengthErrorMessage = (): JSX.Element => showError && errMsg
        ? (<ErrorMessage />)
        : <></>;

    return {
        handleMaxLengthErrorMsg,
        MaxLengthErrorMessage,
        hideError
    };
}
