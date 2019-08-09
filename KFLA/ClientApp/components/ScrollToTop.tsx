import { withRouter, RouteComponentProps } from "react-router";
import { Component } from "react";

interface ScrollToTopProps extends RouteComponentProps<{}> {
    children?: React.ReactNode;
}

class ScrollToTop extends Component<ScrollToTopProps> {
    componentDidUpdate(prevProps: ScrollToTopProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return this.props.children;
    }
}

export default withRouter(ScrollToTop);