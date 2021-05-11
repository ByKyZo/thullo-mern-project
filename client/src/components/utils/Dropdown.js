import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Transition } from 'react-transition-group';

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
    const [contentHeight, setContentHeight] = useState();
    const duration = 300;
    const defaultStyle = {
        transition: `${duration}ms ease`,
        maxHeight: '0px',
        overflow: 'hidden',
        padding: '6px',
    };
    const transitionStyles = {
        entering: { maxHeight: `${contentHeight}px`, overflow: 'hidden' },
        entered: { maxHeight: `${contentHeight}px`, overflow: 'visible' },
        exiting: { maxHeight: '0', overflow: 'hidden' },
        exited: { maxHeight: '0', overflow: 'hidden' },
    };

    useEffect(() => {
        if (dropDownRef.current)
            setContentHeight(dropDownRef.current.getBoundingClientRect().height);
        const handleCloseDropDown = (e) => {
            if (!dropDownRef.current) return setIsOpen(false);
            !dropDownRef.current.contains(e.target) && setIsOpen(false);
        };
        window.addEventListener('mousedown', handleCloseDropDown);
        if (!dropDownRef.current) return setIsOpen(false);
        if (!isOpen) {
            window.removeEventListener('mousedown', handleCloseDropDown);
            setContentHeight(null);
        }
    }, [isOpen, setIsOpen]);

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
                <Transition unmountOnExit in={isOpen} timeout={duration}>
                    {(state) => (
                        <div
                            style={{
                                ...defaultStyle,
                                ...transitionStyles[state],
                            }}>
                            <div className="dropdown__content" ref={dropDownRef}>
                                {children}
                            </div>
                        </div>
                    )}
                </Transition>
            </div>
        </>
    );
};

export default DropDown;
