import clsx from "clsx";
import {
  ChangeEvent,
  FC,
  FocusEvent,
  HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

import { useMaxLengthErrorHandling } from "~/hooks/useErrorHandling/useMaxLengthErrorHandling";

export interface FormInputFieldProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "onChange" | "onBlur" | "onFocus"
  > {
  label: string;
  type?: string;
  placeholder?: string;
  initialValue?: string | number | null;
  inputAttributes?: HTMLAttributes<HTMLInputElement>;
  maxLength?: number;
  maxLengthErrorMsg?: string;
  variant?: "default" | "small";
  // Handlers
  onChange?: (value: string | number | null) => void;
  onBlur?: (value: string | number | null) => void;
  onFocus?: (value: string | number | null) => void;
  transformValueOnChange?: (value: string) => string | number | null;
  transformValueOnBlur?: (value: string) => string | number | null;
  transformValueOnFocus?: (value: string) => string | number | null;
}

export const FormInputField: FC<FormInputFieldProps> = ({
  label, // req
  type = "text",
  placeholder = "",
  initialValue = "",
  inputAttributes = {},
  maxLength,
  maxLengthErrorMsg = "",
  ...handlers
}) => {
  const prevInitialValue = useRef(initialValue);
  const initialLengthErrorState = maxLength
    ? (initialValue?.toString().length ?? 0) >= maxLength
    : false;
  const { MaxLengthErrorMessage, hideError, handleMaxLengthErrorMsg } =
    useMaxLengthErrorHandling(
      initialLengthErrorState,
      maxLength ?? null,
      maxLengthErrorMsg
    );
  const guid = `FIF_${uuidv4()}`;
  const [value, setValue] = useState(initialValue);

  const handleOnChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    const { onChange = null, transformValueOnChange = null } = handlers;
    const { value: targetElementValue } = evt.target;
    const value = transformValueOnChange
      ? transformValueOnChange?.(targetElementValue)
      : targetElementValue;

    onChange?.(value);
    setValue(value);
    if (value !== null) {
      handleMaxLengthErrorMsg(value.toString());
    }
  };

  const handleOnBlur = (evt: FocusEvent<HTMLInputElement>) => {
    const { onBlur = null, transformValueOnBlur = null } = handlers;
    const { value: targetElementValue } = evt.target;
    const value = transformValueOnBlur
      ? transformValueOnBlur?.(targetElementValue)
      : targetElementValue;

    onBlur?.(value);
    if (value !== targetElementValue) {
      setValue(value);
    }
    // Always hide any length warnings when leaving the field since you can't go over the limit anyways
    hideError();
  };

  const handleOnFocus = (evt: FocusEvent<HTMLInputElement>) => {
    const { onFocus = null, transformValueOnFocus = null } = handlers;
    const { value: targetElementValue } = evt.target;
    const value = transformValueOnFocus
      ? transformValueOnFocus?.(targetElementValue)
      : targetElementValue;

    onFocus?.(value);
    if (value !== targetElementValue) {
      setValue(value);
    }
    if (value !== null) {
      handleMaxLengthErrorMsg(value.toString());
    }
  };

  useEffect(() => {
    if (initialValue !== prevInitialValue.current) {
      setValue(initialValue ?? "");
      prevInitialValue.current = initialValue;
    }
  }, [initialValue]);

  return (
    <div className={clsx(["builder-field", "form-input-field"])}>
      <span className="builder-field-label">
        <label
          className="builder-field-heading form-input-field-label"
          htmlFor={guid}
        >
          {label}
        </label>
      </span>
      <span className="builder-field-input">
        <input
          className="builder-field-value"
          id={guid}
          type={type}
          placeholder={placeholder}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          onFocus={handleOnFocus}
          value={value ?? ""}
          maxLength={maxLength || undefined}
          {...inputAttributes}
        />
      </span>
      <MaxLengthErrorMessage />
    </div>
  );
};
