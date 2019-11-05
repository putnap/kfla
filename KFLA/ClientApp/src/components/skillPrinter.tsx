import * as React from "react";

export const printList = (list: string[], classes?: string) => {
    return <ul>
        {list.map(i => {
            return <li key={i}><p className={`class-text ${classes}`} style={{ fontSize: '80%' }}>{i}</p></li>;
        })}
    </ul>
}