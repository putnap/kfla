import * as React from "react";
import { RouteComponentProps } from "react-router";

interface ScrollToTopProps extends RouteComponentProps<{}> {
    children?: React.ReactNode;
}

export class ScrollToTop extends React.Component<ScrollToTopProps, {}> {
    componentDidUpdate(prevProps: ScrollToTopProps & RouteComponentProps<{}>) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return this.props.children;
    }
}
