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
import { VideoModal } from '../VideoModal';
import { StoppersList } from '../StoppersList';
import { Stopper } from '../../models/Stopper';
import { StopperItem } from './StopperItem';
import { CompetencyItem } from './CompetencyItem';
import { StoppersStore } from '../../stores/StoppersStore';
import { LocalizationStore } from '../../stores/LocalizationStore';
import { LanguageParam } from '../../@types/types';

interface QuestionsContainerState {
    loginFailed: boolean
    password?: string
}

interface QuestionsContainerProps extends RouteComponentProps<LanguageParam> {
    stoppersStore?: StoppersStore
    competencyStore?: CompetencyStore
    localizationStore?: LocalizationStore
}

@inject("stoppersStore", "competencyStore", "localizationStore")
@observer
export class QuestionsContainer extends React.Component<QuestionsContainerProps, QuestionsContainerState> {

    constructor(props: QuestionsContainerProps) {
        super(props);

        this.state = {
            loginFailed: false,
            password: null
        };
    }

    async componentDidMount() {
        this.props.localizationStore.setTitle('PageTitles.QUESTIONS');
        const { competencyStore } = this.props;
        if (!competencyStore.isLoaded)
            await competencyStore.fetchCompetencies();
    }

    resetQuestionaire() {
        if (window.confirm(this.props.localizationStore.getString('Questionaire.Reset')))
            this.props.competencyStore.resetQuestionaire();
    }

    submitQuestionaire() {
        const { language } = this.props.match.params;
        this.props.history.push(`/${language}/questionaire`);
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
        return <CompetencyItem competency={competency} key={competency.ID} />;
    }

    renderStopper(stopper: Stopper): JSX.Element {
        return <StopperItem stopper={stopper} key={stopper.ID} />;
    }

    public render() {
        const { competencyStore, stoppersStore, localizationStore }  = this.props;
        return <div className='row background-dark height-100 '>
            <NavMenu {...this.props} />
            {
                !competencyStore.isAuthenticated ?
                    <div className='mx-5 w-100 main-content'>
                        <div className='card mx-auto mt-5' style={{ width: '450px' }}>
                            <div className='card-body'>
                                <h5 className='card-title'>{localizationStore.getString('Questionaire.PasswordRequired')}</h5>
                                <div className='alert alert-danger' hidden={!this.state.loginFailed}>
                                    <span>{localizationStore.getString('Questionaire.PasswordIncorrect')}</span>
                                </div>
                                <form className='form-inline mt-3'>
                                    <div className='form-group'>
                                        <label htmlFor='inputPassword'>{localizationStore.getString('Questionaire.Password')}</label>
                                        <input type='password' id='inputPassword' value={this.state.password} disabled={competencyStore.isAuthenticating} className='form-control mx-sm-3' aria-describedby='passwordHelpInline' placeholder='Password' required onChange={(e) => this.onChange(e.target.value)} />
                                        {
                                            competencyStore.isAuthenticating ?
                                                <div className='form-loader'>
                                                    <div className='lds-roller'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                                                </div>
                                                :
                                                <button onClick={(e) => this.login()} disabled={!this.state.password || competencyStore.isAuthenticating} className='btn background-dark' title='Submit' onSubmit={(e) => this.login()}>
                                                    {localizationStore.getString('Questionaire.Login')}
                                                </button>
                                        }
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='mx-2 mx-md-5 w-100 main-content'>
                        {
                            competencyStore.isLoading ? <Loader text={localizationStore.getString('Questionaire.Loading')} /> : <FactorList factors={competencyStore.factors} renderCompetency={this.renderCompetency} animate={true} />
                        }
                        <StoppersList animate={true} renderStopper={this.renderStopper} />
                        <div className='btn-floating-container'>
                            <button onClick={(e) => this.showInfo()} className='btn rounded-circle' title={localizationStore.getString('Buttons.Info')}>
                                <FontAwesomeIcon icon='info' />
                            </button>
                            <button onClick={(e) => this.submitQuestionaire()} disabled={!competencyStore.questionaireReady && !stoppersStore.questionaireReady} className='btn rounded-circle background-dark' title={localizationStore.getString('Buttons.Submit')}>
                                <FontAwesomeIcon icon='check' />
                            </button>
                            <button onClick={(e) => this.resetQuestionaire()} className='btn rounded-circle background-dark' title={localizationStore.getString('Buttons.Reset')}>
                                <FontAwesomeIcon icon='redo' />
                            </button>
                        </div>
                        <VideoModal id='questionsVideo' videoId='F7Dv7Oxo4rc' />
                    </div>
            }

        </div>;

    }
}