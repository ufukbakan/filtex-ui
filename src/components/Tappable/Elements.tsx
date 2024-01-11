import React, { AllHTMLAttributes, EventHandler, HTMLAttributes, HtmlHTMLAttributes, ReactElement, SyntheticEvent } from "react";

type TappableAttributes<T, E> = Omit<T, "onClick"> & {
    onTap?: EventHandler<SyntheticEvent<E, Event>>
}

const ConvertToTappable = <H extends HTMLElement>(element: ReactElement<React.HTMLAttributes<H>>) => {
    type NativePropsType = typeof element.props;
    return function TappableComponent(props:
        TappableAttributes<NativePropsType, H>
        & React.DetailedHTMLProps<AllHTMLAttributes<H>, H>
    ) {
        const nativeAttributes: HTMLAttributes<any> = props;
        if (props.onTap && nativeAttributes.onClick) {
            nativeAttributes.onClick = props.onTap;
        }
        if (props.onTap && nativeAttributes.onTouchEnd) {
            nativeAttributes.onTouchEnd = props.onTap;
        }
        return (
            <element.type {...nativeAttributes} />
        )
    }
}

export const Button = ConvertToTappable(<div />);
export const TextArea = ConvertToTappable(<textarea />);
export const InputElement = ConvertToTappable(<input />);
export const Span = ConvertToTappable(<span />);
