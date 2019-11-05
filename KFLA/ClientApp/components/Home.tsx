import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import LanguageBar from './LanguageBar';
import { isIE } from 'react-device-detect';
import { useStore } from '@Stores/hook';

const Home: React.FunctionComponent<RouteComponentProps<{}>> = props => {
    const localizationStore = useStore(stores => stores.localizationStore);
    React.useEffect(() => localizationStore.setTitle('Home.Title'), []);
    const { match } = props;
    let containerStyle: React.CSSProperties;
    let itemStyle: React.CSSProperties;

    if (isIE) {
        containerStyle = {
            display: 'table',
        };
        itemStyle = {
            display: 'table-cell',
            verticalAlign: 'middle'
        };
    }
    else {
        containerStyle = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        };
        itemStyle = {
            verticalAlign: 'middle'
        };
    }

    return <div role='navigation'>
        <div className='fixed-top m-1 m-md-3'>
            <img className='w-25' src={require('../logos/logo-korn-ferry.png')} alt='Korn Ferry' />
            <div className='float-right'>
                <LanguageBar />
            </div>
        </div>
        <div className='row height-100'>
            <div className='col-12 col-md-4 background-lib'>
                <div className='height-sm-33 height-100 text-center mx-auto' style={containerStyle}>
                    <NavLink to={`${match.url}/library`} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold' style={itemStyle}>{localizationStore.getString('PageTitles.LIBRARY')}</NavLink>
                </div>
            </div>
            <div className='d-none d-md-block col-md-4 background-light'>
                <div className='height-sm-33 height-100 text-center mx-auto' style={containerStyle} >
                    <NavLink to={`${match.url}/competencies`} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold' style={itemStyle}> {localizationStore.getString('PageTitles.COMPETENCIES')}</NavLink>
                </div>
            </div>
            <div className='col-12 col-md-4 background-dark'>
                <div className='height-sm-33 height-100 text-center mx-auto' style={containerStyle}>
                    <NavLink to={`${match.url}/questions`} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold' style={itemStyle} > {localizationStore.getString('PageTitles.QUESTIONS')}</NavLink>
                </div>
            </div>
        </div>
        <div className='fixed-bottom text-right m-3 font-weight-bold text-white'>
            <img src={require('../logos/Logo-White-Contrast.png')} alt='Littlefuse' style={{ width: '10%' }} />
            <br />
            <span>{localizationStore.getString('Home.Internal')}</span>
        </div>
    </div>;
}

export default withRouter(Home);

