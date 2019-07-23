import * as React from "react";

export const printSkills = (skills: string[], classes?: string) => {
    return <ul>
        {skills.map(i => {
            return <li key={i}><p className={`class-text ${classes}`} style={{ fontSize: '80%' }}>{i}</p></li>;
        })}
    </ul>
}