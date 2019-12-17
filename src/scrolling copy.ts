
import throttle from 'lodash/throttle';

const OFFSET = 30;
const PX_DIFF = 5;

let scrollIncrement = 0;
let isScrolling = false;
let sidebarElement: HTMLElement | null = null;


/**
 * Scroll up.
 */
const goUp = () => {
    scrollIncrement -= PX_DIFF;
    sidebarElement!.scrollTop = scrollIncrement;

    if (isScrolling && scrollIncrement >= 0) {
        window.requestAnimationFrame(goUp);
    }
};

/**
 * Scroll down.
 */
const goDown = () => {
    scrollIncrement += PX_DIFF;
    sidebarElement!.scrollTop = scrollIncrement;

    if (isScrolling && scrollIncrement <= sidebarElement!.scrollHeight) {
        window.requestAnimationFrame(goDown);
    }
};

const onDragOver = (event: any) => {
    const clientRect = sidebarElement!.getBoundingClientRect();
    const isMouseOnTop = (
        scrollIncrement >= 0 && event.clientY > clientRect.top
        && event.clientY < (clientRect.top + OFFSET)
    );
    const isMouseOnBottom = (
        scrollIncrement <= sidebarElement!.scrollHeight
        && event.clientY > (window.innerHeight - OFFSET)
        && event.clientY <= window.innerHeight
    );

    if (!isScrolling && (isMouseOnTop || isMouseOnBottom)) {
        isScrolling = true;
        scrollIncrement = sidebarElement!.scrollTop;

        if (isMouseOnTop) {
            window.requestAnimationFrame(goUp);
        }
        else {
            window.requestAnimationFrame(goDown);
        }
    }
    else if (!isMouseOnTop && !isMouseOnBottom) {
        isScrolling = false;
    }
};


const throttleOnDragOver = throttle(onDragOver, 300);

export const addScrollDragEventListener = () => {
    sidebarElement = document.getElementById('scrollContainer');
    sidebarElement!.addEventListener('dragover', throttleOnDragOver);
};

export const removeScrollDragEventListener = () => {
    sidebarElement!.removeEventListener('dragover', throttleOnDragOver);
    isScrolling = false;
};

