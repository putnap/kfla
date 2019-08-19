import * as React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { NavLink, withRouter, RouteComponentProps } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

interface DropRightButtonProps extends RouteComponentProps<{}> {
    link: string
    icon: IconProp
}

export interface DropRightMenuItemProps {
    link: string
    icon: IconProp
    linkText: string
}

const DropRightButtonFunction: React.FunctionComponent<DropRightButtonProps> = props => {

    const { link, icon, match, children } = props;

    return <NavLink to={`${match.url}/${link}`} activeClassName='active'>
        <div className='dropright'>
            <div className='btn rounded-0 background-lib'>
                <FontAwesomeIcon className='slideout-menu-icon' fixedWidth icon={icon} />
            </div>
            <div className='slideout-menu-dropdown dropdown-menu m-0 rounded-0 border-0 background-lib'>
                <p className='py-2 px-4 font-weight-bold text-nowrap'>{children}</p>
            </div>
        </div>
    </NavLink>
}

export const DroprightButton = withRouter(DropRightButtonFunction);

export const DropRightMenu: React.FunctionComponent<{ menuItems: DropRightMenuItemProps[] }> = props => {
    const { menuItems } = props;

    return <div className='slideout-menu'>
        {
            menuItems
                .map((item, i) => <DroprightButton link={item.link} icon={item.icon} key={i}>{item.linkText}</DroprightButton>)
                .map((item, i) => [i > 0 && <div className='divider' key={i + menuItems.length}></div>, item])
        }
    </div>
}

export const Quote: React.FunctionComponent<{ quote: string, background?: string }> = props => {
    const { quote, background } = props;

    return <div className='rounded ml-md-3 px-3 py-4 p-md-5 h-100 d-flex align-items-center w-100' style={{ background: `#${background || 'e2ddf2'}` }}>
        <p className='h5 font-italic'>
            {quote}
        </p>
    </div>
}

export const ContextWithQuote: React.FunctionComponent<{ context: string, quote: string }> = props => {
    const { context, quote } = props;

    return <div className='row py-3'>
        <div className='col-12 col-md-6 pr-md-2 text-justify' style={{ lineHeight: '1.5' }}><p className='mr-md-3'>{context}</p></div>
        <div className='col-12 col-md-6 pl-md-2'>
            <Quote quote={quote} />
        </div>
    </div>
}

export const CollapsableTip: React.FunctionComponent<{ index: number, phrase: string, content: string }> = props => {
    const { index, phrase, content, children } = props;

    return <div className='col-12 py-1' key={index}>
        <div className='font-weight-bold pointer py-1' data-toggle='collapse' data-target={`#collapseTip${index}`} aria-expanded='false' aria-controls={`collapseTip${index}`}>{index + 1}. {phrase}</div>
        <div className='collapse' id={`collapseTip${index}`}>
            <p>{content}</p>
            {children}
        </div>
    </div>
}