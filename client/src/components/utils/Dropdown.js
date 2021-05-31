import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Transition } from 'react-transition-group';
import { isEmpty } from '../../utils/utils';
import PropTypes from 'prop-types';

const DropDown = ({
    children,
    contentRef,
    contentClass,
    allowsRef,
    isOpen,
    setIsOpen,
    isResponsive = false,
    maxWidthResponsive = 600,
    isVertical = true,
    title,
    description,
    top,
    right,
    bottom,
    left,
    topResponsive,
    rightResponsive,
    bottomResponsive,
    leftResponsive,
}) => {
    const dropdownContentRef = useRef();
    const currentRef = isVertical ? dropdownContentRef : contentRef;
    const isBreakPoint = useMediaQuery({ query: `(max-width: ${maxWidthResponsive}px)` });
    const [contentSize, setContentSize] = useState(null);
    const heightOrWidth = isVertical ? 'maxHeight' : 'maxWidth';
    const duration = 300;
    const defaultStyle = {
        transition: `${duration}ms ease`,
        [heightOrWidth]: '0',
        // padding: '8px',
        overflow: 'hidden',
    };
    const transitionStyles = {
        entering: {
            [heightOrWidth]: `${contentSize}px`,
            overflow: 'hidden',
        },
        entered: {
            [heightOrWidth]: `${contentSize}px`,
            overflow: 'visible',
        },
        exiting: { [heightOrWidth]: '0', overflow: 'hidden' },
        exited: { [heightOrWidth]: '0', overflow: 'hidden' },
    };

    useEffect(() => {
        if (!isOpen) return;
        if (currentRef.current) {
            isVertical
                ? setContentSize(currentRef.current.getBoundingClientRect().height)
                : setContentSize(currentRef.current.getBoundingClientRect().width);
        }
        const handleCloseDropDown = (e) => {
            if (isEmpty(allowsRef)) {
                if (!currentRef.current) return setIsOpen(false);
                !currentRef.current.contains(e.target) && setIsOpen(false);
            } else {
                if (!currentRef.current || !allowsRef.current) return setIsOpen(false);
                if (
                    !currentRef.current.contains(e.target) &&
                    !allowsRef.current.contains(e.target)
                ) {
                    setIsOpen(false);
                }
            }
        };
        window.addEventListener('mousedown', handleCloseDropDown);
        if (!currentRef.current) return setIsOpen(false);
        if (!isOpen) {
            window.removeEventListener('mousedown', handleCloseDropDown);
        }
    }, [isOpen, setIsOpen, currentRef, isVertical, allowsRef]);

    return (
        <>
            <div
                className={`dropdown ${isResponsive && isBreakPoint ? 'dropdown-responsive' : ''}`}
                style={
                    isResponsive && isBreakPoint
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
                            className={`dropdown__content`}
                            style={{
                                ...defaultStyle,
                                ...transitionStyles[state],
                            }}>
                            <div
                                className={`${contentClass}`}
                                ref={isVertical && dropdownContentRef}>
                                {title && description && (
                                    <>
                                        <span className="dropdown__content__title">{title}</span>
                                        <span className="dropdown__content__description">
                                            {description}
                                        </span>
                                    </>
                                )}
                                {children}
                            </div>
                        </div>
                    )}
                </Transition>
            </div>
        </>
    );
};

DropDown.propTypes = {
    isOpen: PropTypes.bool,
    setIsOpen: PropTypes.func,
};

export default DropDown;
