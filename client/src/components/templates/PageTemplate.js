import React from 'react';
import { useSelector } from 'react-redux';
import Header from './Header';

const PageTemplate = ({
    pageTitle,
    children,
    isHeaderBoard = false,
    boardName,
    hasHeader = true,
}) => {
    const isLoading = useSelector((state) => state.loaderReducer);
    document.title = `Thullo | ${isLoading ? 'Loading . . .' : pageTitle}`;

    return (
        <>
            {hasHeader && <Header isHeaderBoard={isHeaderBoard} boardName={boardName} />}

            {children}
        </>
    );
};

export default PageTemplate;
