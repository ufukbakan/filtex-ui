import * as React from "react";

import './Editor.css';
import { TextArea } from "../Tappable/Elements";

export interface OnChangeOptions {
    value: string;
    cursor: OnChangeCursorOptions;
}

export interface OnChangeCursorOptions {
    start: number;
    end: number;
}

export interface EditorProps {
    label?: string;
    value: string;
    onChange: (opts: OnChangeOptions) => void;
    onSubmit: () => void;
    selectionFn: (position: number) => { start: number, end: number };
    coloringFn: (value: string) => string;
    inputRef: React.RefObject<HTMLTextAreaElement>;
}

const Editor = (props: EditorProps) => {
    const preRef = React.useRef<HTMLPreElement>() as React.MutableRefObject<HTMLPreElement>;
    const {
        label,
        value,
        onChange,
        onSubmit,
        selectionFn,
        coloringFn
    } = props;

    const handleChange = (e: any) => {
        if (onChange) {
            onChange({
                value: e.target.value,
                cursor: {
                    start: e.target.selectionStart,
                    end: e.target.selectionEnd
                }
            });
        }
    };

    const handleKeyUp = (e: any) => {
        const { key } = e;

        switch (key) {
            case 'ArrowLeft':
                if (onChange) {
                    onChange({
                        value: e.target.value,
                        cursor: {
                            start: e.target.selectionStart,
                            end: e.target.selectionEnd
                        }
                    });
                }
                break;
            case 'ArrowRight':
                if (onChange) {
                    onChange({
                        value: e.target.value,
                        cursor: {
                            start: e.target.selectionStart,
                            end: e.target.selectionEnd
                        }
                    });
                }
                break;
        }
    };

    const handleKeyDown = (e: any) => {
        const { key, ctrlKey } = e;

        switch (key) {
            case 'Enter':
                e.preventDefault();
                if (ctrlKey) {
                    if (onSubmit) {
                        onSubmit();
                    }
                }
                break;
        }
    };

    const handleFocus = (e: any) => {
        if (onChange) {
            onChange({
                value: e.target.value,
                cursor: {
                    start: e.target.selectionStart,
                    end: e.target.selectionEnd
                }
            });
        }
    };

    const handleBlur = (e: any) => {
        if (onChange) {
            onChange({
                value: e.target.value,
                cursor: {
                    start: -1,
                    end: -1
                }
            });
        }
    };

    const handleClick = (e: any) => {
        setTimeout(() => {
            if (onChange) {
                onChange({
                    value: e.target.value,
                    cursor: {
                        start: e.target.selectionStart,
                        end: e.target.selectionEnd
                    }
                });
            }
        }, 100);
    };

    const handleDoubleClick = (e: any) => {
        const position = e.target.selectionStart;
        const { start, end } = selectionFn(position);

        e.target.selectionStart = start;
        e.target.selectionEnd = end;
    };

    const handleScrollCapture = (e: any) => {
        preRef.current.scrollLeft = e.target.scrollLeft;
    };

    const html = coloringFn(value);

    return (
        <div className="editor">
            <TextArea
                ref={props.inputRef}
                value={value}
                onChange={handleChange}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onTap={handleClick}
                onDoubleClick={handleDoubleClick}
                onScrollCapture={handleScrollCapture}
                placeholder={label}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                rows={1} />
            <pre
                ref={preRef}
                hidden={true}
                dangerouslySetInnerHTML={{ __html: html + '<br />' }} />
        </div>
    );
};

export default Editor;
