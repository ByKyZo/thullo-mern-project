import React from 'react';
import PageTemplate from '../components/templates/PageTemplate';
import { Link } from 'react-router-dom';

const BoardError = (props) => {
    return (
        <PageTemplate pageTitle="Board Error">
            <h1>Board not found or is Private</h1>
            <Link to="/allboards">Back to home</Link>
        </PageTemplate>
    );
};

export default BoardError;
