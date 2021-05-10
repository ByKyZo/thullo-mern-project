import React from 'react';
import Loader from '../utils/Loader';

const PageLoader = (props) => {
    return (
        <div className="pageloader">
            <Loader radius="280" />
        </div>
    );
};

export default PageLoader;
