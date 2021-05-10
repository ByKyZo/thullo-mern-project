import React, { useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import { CSSTransition } from 'react-transition-group';

const DropDown = ({
    children,
    isOpen,
    setIsOpen,
    isReponsive = false,
    maxWidthResponsive = 600,
    top,
    right,
    bottom,
    left,
    topResponsive,
    rightResponsive,
    bottomResponsive,
    leftResponsive,
}) => {
    const dropDownRef = useRef();

    const isBreakPoint = useMediaQuery({ query: `(max-width: ${maxWidthResponsive}px)` });

    useEffect(() => {
        const handleCloseDropDown = (e) => {
            if (!dropDownRef.current) return () => setIsOpen(false);

            !dropDownRef.current.contains(e.target) && setIsOpen(false);
        };
        window.addEventListener('mousedown', handleCloseDropDown);
        return () => {
            window.removeEventListener('mousedown', handleCloseDropDown);
        };
    }, [setIsOpen]);

    return (
        <>
            <div
                className={`dropdown ${isReponsive && isBreakPoint ? 'dropdown-responsive' : ''}`}
                style={
                    isReponsive && isBreakPoint
                        ? {
                              top: topResponsive,
                              right: rightResponsive,
                              bottom: bottomResponsive,
                              left: leftResponsive,
                          }
                        : { top, right, bottom, left }
                }>
                <CSSTransition
                    unmountOnExit
                    in={isOpen}
                    appear={true}
                    timeout={300}
                    classNames="dropdown"
                    onExited={() => setIsOpen(false)}>
                    <div ref={dropDownRef}>{children}</div>
                </CSSTransition>
            </div>
        </>
    );
};

export default DropDown;
