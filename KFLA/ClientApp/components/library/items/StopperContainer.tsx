import * as React from "react";
import { observer, inject } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { LocalizationStore } from "../../../stores/LocalizationStore";
import { NavMenu } from '../../NavMenu';
import { Loader } from '../../Loader';
import { Stopper } from "../../../models/Stopper";
import { StopperItem } from "./StopperItem";
import { autorun } from "mobx";

interface StopperContainerState {
    isLoading: boolean,
    language: string,
    stopper?: Stopper
}

interface StopperArgumentProps {
    stopperId: string
}

interface StopperContainerProps extends RouteComponentProps<StopperArgumentProps> {
    localizationStore?: LocalizationStore
}

@inject("localizationStore")
@observer
export class StopperContainer extends React.Component<StopperContainerProps, StopperContainerState> {

    constructor(props: StopperContainerProps) {
        super(props);

        this.state = {
            isLoading: true,
            language: props.localizationStore.language
        };
    }

    componentDidMount() {
        const { stopperId } = this.props.match.params;
        autorun(() => {
            if (!this.state.stopper || stopperId != this.state.stopper.ID.toString() || this.state.language != this.props.localizationStore.language)
                this.fetchLocalizedStopper(this.props.localizationStore.language, stopperId);
        });
    }

    fetchLocalizedStopper(lang: string, stopperId: string) {
        this.setState({ isLoading: true, language: this.props.localizationStore.language });
        fetch(`api/stoppers/${stopperId}`, { headers: { 'Accept-Language': lang } })
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then(json => {
                this.setState({ stopper: Stopper.fromJSON(json), isLoading: false, language: this.props.localizationStore.language })
            })
            .catch(_ => this.setState({ isLoading: false, language: this.props.localizationStore.language }));
    }

    public render() {
        const { isLoading, stopper } = this.state;
        const localizationStore = this.props.localizationStore;
        return <div className='row background-lib height-100 '>
            <NavMenu />
            <div className='mx-2 mx-md-5 w-100 main-content'>
                <div className='row card mb-2'>
                    <div className='col card-body'>
                        {
                            isLoading ?
                                <Loader text={localizationStore.getString('Questionaire.Loading')} /> :
                                <StopperItem stopper={stopper} {...this.props} />
                        }
                    </div>
                </div>
            </div>
        </div>

    }
}