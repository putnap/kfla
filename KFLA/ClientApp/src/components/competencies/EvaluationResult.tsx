import * as React from 'react';
import * as jQuery from 'jquery';
import { RouteComponentProps } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NavMenu from '../NavMenu';
import { FactorList } from '../FactorList';
import { Loader } from '../Loader';
import { LandscapeOrientation } from '../orientations';
import { VideoModal } from '../VideoModal';
import { LanguageParam } from '../../@types/types';
import { useStore } from '../../stores/hook';
import { observer } from 'mobx-react-lite';
import { FloatingButtonProps, FloatingActionButtons } from '../FloatingButtons';

const EvaluatedCompetency = ({ competency }) => {

    return <div className='row competencyItem' >
        <div className='col-1 text-right p-0'>
            <span>{competency.ID}.</span>
        </div>
        <div className='col'>
            <FontAwesomeIcon icon={competency.Evaluation.Icon} style={{ color: competency.Evaluation.Color }} />
            <span className='ml-2 font-weight-bold' style={{ color: competency.Evaluation.Color }}>{competency.Name}</span>
            <p>{competency.Description}</p>
        </div>
    </div>
}

const LegendEvaluation = ({ evaluation }) => {
    return <div className='col-12 align-self-center my-2' style={{ color: evaluation.Color }} data-toggle='tooltip' title={evaluation.Tooltip}>
        <FontAwesomeIcon icon={evaluation.Icon} className='mx-2' />
        <span className='font-weight-bold text-uppercase'>{evaluation.Name}</span>
    </div>
}

export const EvaluationResultContainer: React.FC<RouteComponentProps<LanguageParam>> = observer(props => {

    const competencyStore = useStore(stores => stores.competencyStore);
    const localizationStore = useStore(stores => stores.localizationStore);

    const navigateToCompetencies = () => {
        const { language } = props.match.params;
        props.history.push(`/${language}/competencies`);
    }

    const resetEvaluation = () => {
        if (window.confirm(localizationStore.getString('Evaluation.Reset'))) {
            competencyStore.resetEvaluation();
            navigateToCompetencies();
        }
    }

    React.useEffect(() => {
        if (!competencyStore.evaluationReady) {
            competencyStore.resetEvaluation();
            setTimeout(() => {
                navigateToCompetencies();
            }, 2000)
        }
    });

    const floatingButtons: FloatingButtonProps[] = [
        { label: localizationStore.getString('Buttons.Info'), icon: "info", onClick: () => jQuery('#competenciesVideo').modal() },
        { label: localizationStore.getString('Buttons.Print'), icon: "print", onClick: window.print },
        { label: localizationStore.getString('Buttons.Reset'), icon: "redo", onClick: resetEvaluation },
    ]

    return <section>
        <div className='row background-light react-no-print'>
            <NavMenu />
        </div>
        <div className='row background-light contentContainer height-100 px-5'>
            <LandscapeOrientation />
            <div className='col evaluations'>
                {
                    competencyStore.evaluationReady ?
                        <div>
                            <FactorList factors={competencyStore.factors} renderCompetency={competency => <EvaluatedCompetency competency={competency} key={competency.ID} />} animate={true} />
                            <div className='row bg-white mb-2 py-2'>
                                <div className='col-12'>
                                    <span className='font-weight-bold'>{localizationStore.getString('EvaluationResult.Legend')}:</span>
                                </div>
                                {
                                    competencyStore.evaluations.map((evaluation, i) => <LegendEvaluation evaluation={evaluation} key={i} />)
                                }
                            </div>
                        </div>
                        :
                        <Loader text={localizationStore.getString('EvaluationResult.Empty')} />
                }
            </div>
            <FloatingActionButtons floatingButtons={floatingButtons} />
            <VideoModal id='competenciesVideo' videoId='2yT0gqnKb-A' />
        </div>
    </section>
})