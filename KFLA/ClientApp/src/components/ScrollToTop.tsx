import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";

const ScrollToTop: React.FunctionComponent<RouteComponentProps> = props => {
    const { children, location: { pathname } } = props;

    React.useEffect(() => {
        try {
            // trying to use new API - https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });
        } catch (error) {
            // just a fallback for older browsers
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    return <>{children || null}</>;
};

export default withRouter(ScrollToTop);