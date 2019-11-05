import * as React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { NavLink, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RouteComponentProps } from "react-router";

export const safeReplace = (text: string, title: string) => {
    if (text)
        return text.replace('#COMP_TITLE#', title);
}

export const printList = (list: string[], classes?: string) => {
    return <ul>
        {list.map(i => {
            return <li key={i}><p className={`class-text ${classes}`}>{i}</p></li>;
        })}
    </ul>
}

interface DropRightButtonProps extends RouteComponentProps, DropRightMenuItemProps {
}

export interface DropRightMenuItemProps {
    link: string
    icon: IconProp
    linkText: string
}

const DropRightButtonComponent: React.FunctionComponent<DropRightButtonProps> = props => {
    const { link, icon, linkText, match: { url } } = props;

    return <NavLink to={`${url}/${link}`} activeClassName='active'>
        <div className='dropright'>
            <div className='btn rounded-0 background-lib'>
                <FontAwesomeIcon className='slideout-menu-icon' fixedWidth icon={icon} />
            </div>
            <div className='slideout-menu-dropdown dropdown-menu m-0 rounded-0 border-0 background-lib'>
                <p className='py-2 px-4 font-weight-bold text-nowrap'>{linkText}</p>
            </div>
        </div>
    </NavLink>
}

export const DroprightButton = withRouter(DropRightButtonComponent);

export const DropRightMenu = ({ menuItems }) => {
    return <div className='slideout-menu'>
        {
            menuItems
                .map((item, i) => <DroprightButton {...item} key={i} />)
                .map((item, i) => [i > 0 && <div className='divider' key={i + menuItems.length}></div>, item])
        }
    </div>
}

export const Quote = ({ quote, background = '#e2ddf2' }) => {
    return <div className='rounded ml-md-3 px-3 py-4 p-md-5 h-100 d-flex align-items-center w-100' style={{ background: background }}>
        <p className='h5' dangerouslySetInnerHTML={{ __html: quote }}>
        </p>
    </div>
}

export const ContextWithQuote = ({ context, quote })=> {
    return <div className='row py-3'>
        <div className='col-12 col-md-6 pr-md-2 text-justify' style={{ lineHeight: '1.5' }}><p className='mr-md-3'>{context}</p></div>
        <div className='col-12 col-md-6 pl-md-2'>
            <Quote quote={quote} />
        </div>
    </div>
}

export const CollapsableTip = ({ index, phrase, content, children = null }) => {
    return <div className='col-12 py-1'>
        <div className='rounded font-weight-bold pointer p-2' style={{ background: 'rgba(213,232,224,1)' }} data-toggle='collapse' data-target={`#collapseTip${index}`} aria-expanded='false' aria-controls={`collapseTip${index}`}>{index + 1}. {phrase}</div>
        <div className='collapse p-1' id={`collapseTip${index}`}>
            <p style={{ lineHeight: '1.5' }}>{content}</p>
            {children}
        </div>
    </div>
}