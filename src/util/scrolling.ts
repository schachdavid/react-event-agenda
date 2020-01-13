/**
 * DnD Scrolling fix.
 *
 * @file This file adds the auto scroll feature during dragging for
 *  Browsers like Safari which do not support this out of the box.
 * 
 * @license MIT
 */



import throttle from 'lodash/throttle';
import { getBrowser } from './util';

const offset = 50;
const pxDiff = 5;

let scrollIncrement = 0;
let isScrolling = false;
let isDragging = false;
let scrollContainer: HTMLElement | null = null;
let intervalId: number | undefined;


const scrollUp = () => {
    if (isScrolling && scrollIncrement >= 0) {
        scrollIncrement -= pxDiff;
        scrollContainer!.scrollTop = scrollIncrement;
    }
};


const scrollDown = () => {
    if (isScrolling && scrollIncrement <= scrollContainer!.scrollHeight) {
        scrollIncrement += pxDiff;
        scrollContainer!.scrollTop = scrollIncrement;
    }
};

const onDragOver = (event: any) => {
    const clientRect = scrollContainer!.getBoundingClientRect();

    const isMouseOnTop = (
        scrollIncrement >= 0
        && event.clientY > clientRect.top
        && event.clientY < (clientRect.top + offset)
    );
    const isMouseOnBottom = (
        scrollIncrement <= scrollContainer!.scrollHeight
        && event.clientY > (window.innerHeight - offset)
        && event.clientY <= window.innerHeight
    );

    if (!isScrolling && isDragging && (isMouseOnTop || isMouseOnBottom)) {
        isScrolling = true;
        scrollIncrement = scrollContainer!.scrollTop;

        if (isMouseOnTop) {
            intervalId = window.setInterval(function () {
                scrollUp()
            }, 15);

        }
        else {
            intervalId = window.setInterval(function () {
                scrollDown()
            }, 15);
        }
    }
    else if (!isMouseOnTop && !isMouseOnBottom) {
        isScrolling = false;
        if (intervalId !== undefined) {
            clearInterval(intervalId);
            intervalId = undefined;
        }

    }
};


const throttleOnDragOver = throttle(onDragOver, 300);

export const addScrollDragEventListener = () => {
    const browser = getBrowser();
    if (browser === 'safari' || browser === undefined) {
        isDragging = true;
        scrollContainer = document.getElementById('scrollContainer');
        scrollContainer!.addEventListener('dragover', throttleOnDragOver);
    };
}


export const removeScrollDragEventListener = () => {
    const browser = getBrowser();
    if (browser === 'safari' || browser === undefined) {
        scrollContainer!.removeEventListener('dragover', throttleOnDragOver);
        isDragging = false;
        isScrolling = false;
        if (intervalId !== undefined) {
            clearInterval(intervalId);
            intervalId = undefined;
        }
    };

};

