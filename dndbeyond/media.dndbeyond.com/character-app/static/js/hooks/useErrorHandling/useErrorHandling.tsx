import { HTMLAttributes, useState } from "react";
import styles from '../../styles/errors.module.css';

export interface ErrorHandlerOptions {
    initialState: boolean;
    errMsg: string;
    errorMessageAttributes?: HTMLAttributes<HTMLDivElement>;
};

export interface ErrorHandler {
    showError: boolean;
    setShowError: (value: boolean) => void;
    ErrorMessage: () => JSX.Element;
};

export const useErrorHandling = (
    initialState: boolean,
    errMsg: string,
    errorMessageAttributes: HTMLAttributes<HTMLDivElement> | null = null
): ErrorHandler => {
    const [showError, setShowError] = useState(initialState);
    const ErrorMessage = (): JSX.Element => (
        <div className={styles.inputError} {...errorMessageAttributes}>
            {errMsg}
        </div>
    );

    return {
        showError,
        setShowError,
        ErrorMessage,
    };
};
