import * as React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const safeReplace = (text: string, title: string) => {
    if (text)
        return text.replace('#COMP_TITLE#', title);
}

export const generateDroprightButton = (baseUrl: string, link: string, icon: IconProp, linkText: string) => {
    return <Link to={`${baseUrl}/${link}`}>
        <div className='dropright'>
            <div className='btn rounded-0 background-lib'>
                <FontAwesomeIcon className='slideout-menu-icon text-dark' fixedWidth icon={icon} />
            </div>
            <div className='slideout-menu-dropdown dropdown-menu m-0 rounded-0 border-0 background-lib'>
                <p className='text-dark py-2 px-4 font-weight-bold text-nowrap'>{linkText}</p>
            </div>
        </div>
    </Link>
}