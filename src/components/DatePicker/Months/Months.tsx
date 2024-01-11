import React, { useState } from "react";

import './Months.css';
import { Button } from "../../Tappable/Elements";

export interface MonthsProps {
    hidden?: boolean;
    year?: number;
    onYearRequested?: () => void;
    onValueChange?: (year: number, month: number) => void;
}

const Months = (props: MonthsProps) => {
    const [year, setYear] = useState(props.year || new Date().getFullYear());

    const [months] = useState(() => {
        const list = [];
        for (let i = 0; i <= 11; i++) {
            list.push(i)
        }
        return list;
    });

    const onMonthSelect = (value: number) => {
        if (props.onValueChange) {
            props.onValueChange(year, value - 1);
        }
    };

    const decreaseYear = () => {
        setYear(year - 1);
    };

    const increaseYear = () => {
        setYear(year + 1);
    };

    const handleYearClick = () => {
        if (props.onYearRequested) {
            props.onYearRequested();
        }
    };

    const getMonthName = (value: number) => {
        return new Date(new Date().getFullYear(), value - 1, 1).toLocaleString('default', { month: 'short' });
    };

    return (
        <div className="months" hidden={props.hidden}>
            <div className="months-header">
                <Button onTap={decreaseYear}><span className="arrow-left"></span><span className="arrow-left"></span></Button>
                <Button onTap={handleYearClick}>{year}</Button>
                <Button onTap={increaseYear}><span className="arrow-right"></span><span className="arrow-right"></span></Button>
            </div>
            <div className="months-content">
                {
                    months.filter(i => i % 3 === 0).map(i => {
                        return (
                            <div key={'months_' + (i) + '_' + (i + 2)}>
                                <Button
                                    key={'month_' + (i + 1)}
                                    onTap={_ => onMonthSelect(i + 1)}>{getMonthName(i + 1)}</Button>
                                <Button
                                    key={'month_' + (i + 2)}
                                    onTap={_ => onMonthSelect(i + 2)}>{getMonthName(i + 2)}</Button>
                                <Button
                                    key={'month_' + (i + 3)}
                                    onTap={_ => onMonthSelect(i + 3)}>{getMonthName(i + 3)}</Button>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
};

export default Months;
