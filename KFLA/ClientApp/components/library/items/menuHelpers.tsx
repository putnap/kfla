import * as React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LocalizationStore } from "../../../stores/LocalizationStore";


const generateLink = (link: string, localizationStore: LocalizationStore) => {
    return <div className='my-auto'>
        <span className='text-dark pl-2'>{localizationStore.getString(`Library.Items.Links.${link}`)}</span>
    </div>
}

export const generateButton = (baseUrl: string, link: string, icon: IconProp, localizationStore: LocalizationStore) => {
    return <Link to={`${baseUrl}/${link}`}>
        <div className='dropright'>
            <div className='btn rounded-0 background-lib'>
                <FontAwesomeIcon className='slideout-menu-icon text-dark' fixedWidth icon={icon} />
            </div>
            <div className='dropdown-menu m-0 rounded-0 border-0 background-lib' style={{ height: '54px' }}>
                {generateLink(link, localizationStore)}
            </div>
        </div>
    </Link>
}