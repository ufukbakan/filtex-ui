import React, { useState } from "react";

import './Years.css';
import { Button } from "../../Tappable/Elements";

export interface YearsProps {
    hidden?: boolean;
    year?: number;
    onValueChange?: (year: number) => void;
}

const Years = (props: YearsProps) => {
    const [year, setYear] = useState(props.year || new Date().getFullYear());

    const [years, setYears] = useState(() => {
        const mod = year % 12 > 6 ? (year % 12 + 1) : year % 12;
        const list = [];
        for (let i = year - mod; i <= year + (12 - mod - 1); i++) {
            list.push(i)
        }
        return list;
    });

    const onYearSelect = (value: number) => {
        if (props.onValueChange) {
            props.onValueChange(value);
        }
        setYear(value);
    };

    const increaseYears = () => {
        setYears(() => {
            const list = [];
            const start = years[years.length - 1] + 1;
            for (let i = start; i < start + 12; i++) {
                list.push(i)
            }
            return list;
        })
    };

    const decreaseYears = () => {
        setYears(() => {
            const list = [];
            const start = years[0] - 12;
            for (let i = start; i < start + 12; i++) {
                list.push(i)
            }
            return list;
        })
    };

    return (
        <div className="years" hidden={props.hidden}>
            <div className="years-header">
                <Button onTap={decreaseYears}><span className="arrow-left"></span><span className="arrow-left"></span></Button>
                <Button>{((years.at(0) ?? 0) + 1) + ' - ' + ((years.at(-1) ?? 0) + 1)}</Button>
                <Button onTap={increaseYears}><span className="arrow-right"></span><span className="arrow-right"></span></Button>
            </div>
            <div className="years-content">
                {
                    years.filter(i => i % 3 === 0).map(i => {
                        return (
                            <div key={'years_' + (i) + '_' + (i + 2)}>
                                <Button
                                    key={'year_' + (i)}
                                    onTap={_ => onYearSelect(i)}>{i}</Button>
                                <Button
                                    key={'year_' + (i + 1)}
                                    onTap={_ => onYearSelect(i + 1)}>{i + 1}</Button>
                                <Button
                                    key={'year_' + (i + 2)}
                                    onTap={_ => onYearSelect(i + 2)}>{i + 2}</Button>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default Years;
