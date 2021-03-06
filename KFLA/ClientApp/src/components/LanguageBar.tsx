import * as React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { compile } from 'path-to-regexp';
import { useStore } from '../stores/hook';

const getUrl = (language, match) => {
    const toPath = compile(match.path);
    const newPath = toPath({ ...match.params, language: language });

    if (newPath.endsWith("/"))
        return newPath.substring(0, newPath.length - 1);

    return newPath;
}

const LanguageBar: React.FC<RouteComponentProps<{}>> = props => {
    const localizationStore = useStore(stores => stores.localizationStore);

    return <div className='lang' >
        {
            localizationStore.languages.map(language => {
                return <NavLink to={getUrl(language, props.match)} activeClassName='active' className='btn' key={language}>
                    {language.toUpperCase()}
                </NavLink>
            })
        }
    </div>
}

export default withRouter(LanguageBar);
