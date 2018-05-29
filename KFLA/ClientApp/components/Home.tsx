import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

export class Home extends React.Component<RouteComponentProps<{}>, {}> {
    componentDidMount() {
        document.title = 'Korn Ferry Leadership Architect™';
    }

    public render() {
        return <div className='row vertical-center' role='navigation'>
            <div className='col background-dark'>
                <div className='row vertical-center'>
                    <div className='col text-center'>
                        <NavLink to={'/questions'} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold'>Behavior-based questions for interviewer</NavLink>
                    </div>
                </div>
            </div>
            <div className='col background-light'>
                <div className='row vertical-center'>
                    <div className='col text-center'>
                        <NavLink to={'/competencies'} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold'>Competency assessment</NavLink>
                    </div>
                </div>
            </div>
        </div>;
    }
}
