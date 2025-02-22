import clsx from "clsx";
import {
  forwardRef,
  HTMLAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import styles from "./styles.module.css";

export interface TextareaProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  value?: string;
  onInputBlur: (textValue: string) => void;
  onInputKeyUp: () => void;
}

/**
 * A component to be used as a text area with auto-resizing capabilities. This
 * is used in the panes for notes and traits and needs to support text entry as
 * well as programmatic updates.
 */
export const Textarea = forwardRef<HTMLDivElement, TextareaProps>(
  (
    { className, value, onInputBlur, onInputKeyUp, placeholder, ...props },
    forwardedRef
  ) => {
    const [currentValue, setCurrentValue] = useState(value);

    const ref = useRef<HTMLDivElement>(null);
    // Combine the local ref with the forwarded ref
    useImperativeHandle(forwardedRef, () => ref.current as HTMLDivElement);

    const handleChange = (e) => {
      const dataSet = e.target.parentNode.dataset;
      dataSet.value = e.target.value;
      setCurrentValue(e.target.value);
    };

    const handleBlur = (e) => onInputBlur(e.target.value);
    const handleKeyUp = () => onInputKeyUp();

    useEffect(() => {
      if (ref.current) {
        const wrapper = ref.current as HTMLDivElement;
        const textarea = wrapper.children[0] as HTMLTextAreaElement;
        // Set the data-value attribute to the value
        wrapper.dataset.value = value;
        // Set the textarea value to the value
        textarea.value = value || "";
        setCurrentValue(value);
      }
    }, [value]);

    return (
      <div
        className={clsx([styles.textarea, className])}
        ref={ref}
        data-value={currentValue}
        {...props}
      >
        <textarea
          rows={1}
          placeholder={placeholder}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
          value={currentValue}
        />
      </div>
    );
  }
);
