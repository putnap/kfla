import * as React from 'react';
import * as jQuery from 'jquery';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Competency } from '../../models/Competency';
import { NavMenu } from '../NavMenu';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { Loader } from '../Loader';
import { FactorList } from '../FactorList';
import { Factor } from '../../models/Factor';
import { PageTitles } from '../../@types/types';
import { VideoModal } from '../VideoModal';

interface QuestionsContainerState {
    loginFailed: boolean
    password?: string
}

interface QuestionsContainerProps extends RouteComponentProps<{}> {
    competencyStore?: CompetencyStore
}

@inject("competencyStore")
@observer
export class QuestionsContainer extends React.Component<QuestionsContainerProps, QuestionsContainerState> {

    constructor(props: QuestionsContainerProps) {
        super(props);

        this.state = {
            loginFailed: false,
            password: null
        };
    }

    componentDidMount() {
        document.title = PageTitles.QUESTIONS;
        const store = this.props.competencyStore;
        if (!store!.isLoaded)
            store!.fetchCompetencies();
    }

    resetQuestionaire() {
        if (window.confirm('Are you sure you wish to reset questionaire?'))
            this.props.competencyStore.resetQuestionaire();
    }

    submitQuestionaire() {
        this.props.history.push("/questionaire");
    }

    login() {
        this.props.competencyStore.login(this.state.password, this.loginFailed.bind(this))
    }

    loginFailed() {
        this.setState({ loginFailed: true, password: null });
        jQuery('#inputPassword').val('');
    }

    onChange(password: string) {
        this.setState({ loginFailed: false, password: password });
    }

    showInfo() {
        jQuery('#questionsVideo').modal();
    }

    renderCompetency(competency: Competency): JSX.Element {
        return <div className='row'>
            <div className='col-1 p-0 align-self-center'>
                <label className='check-container'>
                    <input type='checkbox' checked={competency.IsSelected} onClick={(e) => competency.toggleSelection()} />
                    <span className='checkmark'></span>
                </label>
            </div>
            <div className='col-1 p-0 text-right'>
                <span>{competency.ID}.</span>
            </div>
            <div className='col'>
                <div className='font-weight-bold'>{competency.Name}</div>
                <div>{competency.Description}</div>
            </div>
        </div>;
    }

    public render() {
        const store = this.props.competencyStore;
        return <div className='row background-dark height-100 '>
            <NavMenu />
            {
                !store!.isAuthenticated ?
                    <div className='mx-5 w-100' style={{ padding: '65px 15px 0px 15px' }}>
                        <div className='card mx-auto mt-5' style={{ width: '450px' }}>
                            <div className='card-body'>
                                <h5 className='card-title'>Password is required to continue</h5>
                                <div className='alert alert-danger' hidden={!this.state.loginFailed}>
                                    <span>Password is incorrect</span>
                                </div>
                                <form className='form-inline mt-3'>
                                    <div className='form-group'>
                                        <label htmlFor='inputPassword'>Password</label>
                                        <input type='password' id='inputPassword' value={this.state.password} disabled={store!.isAuthenticating} className='form-control mx-sm-3' aria-describedby='passwordHelpInline' placeholder='Password' required onChange={(e) => this.onChange(e.target.value)} />
                                        {
                                            store!.isAuthenticating ?
                                                <div className='form-loader'>
                                                    <div className='lds-roller'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                                                </div>
                                                :
                                                <button onClick={(e) => this.login()} disabled={!this.state.password || store!.isAuthenticating} className='btn background-dark' title='Submit' onSubmit={(e) => this.login()}>
                                                    Login
                                                </button>
                                        }
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='mx-5 w-100' style={{ padding: '65px 15px 0px 15px' }}>
                        {
                            store!.isLoading ? <Loader text='Loading competencies...' /> : <FactorList factors={store.factors} renderCompetency={this.renderCompetency} animate={true} />
                        }
                        <div className='btn-floating-container'>
                            <button onClick={(e) => this.showInfo()} className='btn rounded-circle' title='Info'>
                                <FontAwesomeIcon icon='info' />
                            </button>
                            <button onClick={(e) => this.submitQuestionaire()} disabled={!store.questionaireReady} className='btn rounded-circle background-dark' title='Submit'>
                                <FontAwesomeIcon icon='check' />
                            </button>
                            <button onClick={(e) => this.resetQuestionaire()} className='btn rounded-circle background-dark' title='Reset'>
                                <FontAwesomeIcon icon='redo' />
                            </button>
                        </div>
                        <VideoModal id='questionsVideo' url='Videos/questions.mp4' />
                    </div>
            }
            
        </div>;

    }
}