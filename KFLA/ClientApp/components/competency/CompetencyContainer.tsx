import * as React from "react";
import { observer, inject } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { LocalizationStore } from "../../stores/LocalizationStore";
import { Competency } from "../../models/Competency";
import { NavMenu } from '../NavMenu';
import { Loader } from '../Loader';
import { CompetencyItem } from "./CompetencyItem";
import { autorun } from "mobx";

interface CompetencyContainerState {
    isLoading: boolean
    competency?: Competency
}

interface CompetencyArgumentProps {
    competencyId: string
}

interface CompetencyContainerProps extends RouteComponentProps<CompetencyArgumentProps> {
    localizationStore?: LocalizationStore
}

@inject("localizationStore")
@observer
export class CompetencyContainer extends React.Component<CompetencyContainerProps, CompetencyContainerState> {

    constructor(props: CompetencyContainerProps) {
        super(props);

        this.state = {
            isLoading: true
        };
    }

    componentDidMount() {
        const { competencyId } = this.props.match.params;
        autorun(() => {
            this.fetchLocalizedCompetency(this.props.localizationStore.language, competencyId);
        });
    }

    fetchLocalizedCompetency(lang: string, competencyId: string) {
        this.setState({ isLoading: true });
        fetch(`api/competencies/${competencyId}`, { headers: { 'Accept-Language': lang } })
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then(json => {
                this.setState({ competency: Competency.fromJSON(json), isLoading: false })
            })
            .catch(_ => this.setState({ isLoading: false }));
    }

    public render() {
        const { isLoading, competency } = this.state;
        const localizationStore = this.props.localizationStore;
        return <div className='row background-lib height-100 '>
            <NavMenu />
            <div className='mx-2 mx-md-5 w-100 main-content'>
                <div className='row card mb-2'>
                    <div className='col card-body'>
                        {
                            isLoading ?
                                <Loader text={localizationStore.getString('Questionaire.Loading')} /> :
                                <CompetencyItem competency={competency} {...this.props} />
                        }
                    </div>
                </div>
            </div>
        </div>

    }
}