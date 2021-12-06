import {CornerHandlePosition} from '../corner-handle/corner-handle.component';
import {NgZone} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {RectSizeAndPos} from './rect-size-and-pos';

interface InteractableConfig {
    el: HTMLElement;
    boundingBox?: RectSizeAndPos;
    aspectRatio?: number|null;
    maintainInitialAspectRatio?: boolean;
    minWidth: number;
    minHeight: number;
    transformEl?: boolean;
    onInteractStart?: (e: RectSizeAndPos) => void;
    onInteractEnd?: (e: RectSizeAndPos) => void;
    onMove?: (e: {rect: RectSizeAndPos, prevRect: RectSizeAndPos}) => void;
    onRotate?: (e: {rect: RectSizeAndPos, prevRect: RectSizeAndPos}) => void;
    onResize?: (e: {rect: RectSizeAndPos, prevRect: RectSizeAndPos}) => void;
    onDoubleTap?: (e: HammerInput) => void;
    zone: NgZone;
}

export class Interactable {
    public moving$ = new BehaviorSubject(false);
    public currentRect: RectSizeAndPos = {width: 0, height: 0, left: 0, top: 0, angle: 0};

    private prevDeltaX = 0;
    private prevDeltaY = 0;
    private prevAngle = 0;
    private currentAction: 'move'|'resize'|'rotate';
    private resizeDirection: CornerHandlePosition;
    private initialAspectRatio = 0;

    private centerX = 0;
    private centerY = 0;
    private startAngle = 0;
    private raf: number;

    constructor(private config: InteractableConfig) {
        this.bindHammerEvents();
    }

    public setConfig(config: Partial<InteractableConfig>) {
        this.config = {
            ...this.config,
            ...config,
        };
    }

    public centerWithinRect(rect: RectSizeAndPos) {
        this.currentRect = {
            width: rect.width,
            height: rect.height,
            top: 0,
            left: 0,
        };
        if (this.config.aspectRatio) {
            const newSize = Interactable.calculateNewSizeFromAspectRatio(this.config.aspectRatio, this.currentRect.width, this.currentRect.height);
            this.currentRect.width = newSize.width;
            this.currentRect.height = newSize.height;
        }
        this.currentRect.left = (rect.width - this.currentRect.width) / 2;
        this.currentRect.top = (rect.height - this.currentRect.height) / 2;
    }

    private syncCurrentRectWithEl() {
        const translateVal = this.config.el.style.transform.match(/translate\((.+?)\)/)[1];
        const [left = '0', top = '0'] = translateVal.split(',');
        const rotateVal = this.config.el.style.transform.match(/rotate\((.+?)\)/)?.[1];
        const [rotation = '0'] = rotateVal ? rotateVal.split(',') : [];

        this.currentRect = {
            // use clientHeight to rotation transform is ignored, it does not include margin
            width: this.config.el.offsetWidth,
            height: this.config.el.offsetHeight,
            left: parseInt(left),
            top: parseInt(top),
            angle: parseFloat(rotation),
        };
        this.startAngle = this.currentRect.angle;
        this.initialAspectRatio = this.currentRect.width / this.currentRect.height;
    }

    private bindHammerEvents() {
        this.config.zone.runOutsideAngular(() => {
            const hammer = new Hammer.Manager(this.config.el);
            const pan = new Hammer.Pan({threshold: 0});
            const recognizers: Recognizer[] = [pan];
            if (this.config.onDoubleTap) {
                const doubletap = new Hammer.Tap({taps: 2, event: 'doubletap'});
                recognizers.push(doubletap);
            }
            hammer.add(recognizers);

           if (this.config.onDoubleTap) {
               hammer.on('doubletap', (e: HammerInput) => {
                   this.config.onDoubleTap(e);
               });
           }

            hammer.on('panstart', (e: HammerInput) => {
                this.syncCurrentRectWithEl();
                this.moving$.next(true);
                if (e.target === this.config.el) {
                    this.currentAction = 'move';
                } else if (e.target.className.includes('rotation-handle')) {
                    this.currentAction = 'rotate';
                } else {
                    this.currentAction = 'resize';
                    this.resizeDirection = e.target.getAttribute('position') as CornerHandlePosition;
                }

                const rect = this.config.el.getBoundingClientRect();
                // store the center as the element has css `transform-origin: center center`
                this.centerX = rect.left + rect.width / 2;
                this.centerY = rect.top + rect.height / 2;
                // get the angle of the element when the drag starts
                this.startAngle = this.getDragAngle(e.srcEvent);
                this.config.onInteractStart && this.config.onInteractStart(this.currentRect);
            });
            hammer.on('panmove', (e: HammerInput) => {
                if (this.currentAction === 'move') {
                    this.onMove(e);
                } else if (this.currentAction === 'rotate') {
                   this.onRotate(e);
                } else {
                    this.onResize(e);
                }
                this.prevDeltaX = e.deltaX;
                this.prevDeltaY = e.deltaY;
                this.prevAngle = e.angle;
                if ( ! this.raf && this.config.transformEl) {
                    this.raf = requestAnimationFrame(this.draw.bind(this));
                }
            });
            hammer.on('panend', () => {
                this.currentAction = null;
                this.resizeDirection = null;
                this.prevDeltaX = 0;
                this.prevDeltaY = 0;
                this.moving$.next(false);
                if (this.raf) {
                    cancelAnimationFrame(this.raf);
                }
                this.config.onInteractEnd && this.config.onInteractEnd(this.currentRect);
            });
        });
    }

    private getDragAngle(event) {
        const startAngle = this.startAngle || 0;
        const center = {
            x: this.centerX || 0,
            y: this.centerY || 0,
        };
        const angle = Math.atan2(center.y - event.clientY,
            center.x - event.clientX);

        return angle - startAngle;
    }

    private onRotate(e: HammerInput) {
        const prevRect = {...this.currentRect};
        this.currentRect.angle = this.getDragAngle(e.srcEvent);
        this.config.onRotate && this.config.onRotate({
            rect: {...this.currentRect},
            prevRect: prevRect,
        });
    }

    private onMove(e: HammerInput) {
        const prevRect = {...this.currentRect};
        this.currentRect.left = this.currentRect.left + (e.deltaX - this.prevDeltaX);
        this.currentRect.top = this.currentRect.top + (e.deltaY - this.prevDeltaY);
        this.currentRect = this.constrainRect(this.currentRect, prevRect);
        this.config.onMove && this.config.onMove({
            rect: {...this.currentRect},
            prevRect: prevRect,
        });
    }

    private getAspectRatio(): number {
        if (this.config.maintainInitialAspectRatio) {
            return this.initialAspectRatio;
        } else if (this.config.aspectRatio) {
            return this.config.aspectRatio;
        } else {
            return null;
        }
    }

    public resize(rect: Partial<RectSizeAndPos>) {
        const prevRect = {...this.currentRect};
        this.currentRect = {
            ...this.currentRect,
            ...rect,
        };
        const aspectRatio = this.getAspectRatio();
        if (aspectRatio) {
            const size = Interactable.calculateNewSizeFromAspectRatio(
                aspectRatio,
                this.currentRect.width,
                this.currentRect.height
            );
            this.currentRect.width = size.width;
            this.currentRect.height = size.height;
        }
        this.currentRect = this.constrainRect(this.currentRect, prevRect);
        this.config.onResize && this.config.onResize({
            rect: {...this.currentRect},
            prevRect: prevRect,
        });
    }

    private onResize(e: HammerInput) {
        const prevRect = {...this.currentRect};
        const ratio = this.getAspectRatio();

        if (this.resizeDirection === 'top-right') {
            this.currentRect.width = Math.floor(this.currentRect.width + (e.deltaX - this.prevDeltaX));
            if (ratio) {
                this.currentRect.height = Math.floor(this.currentRect.width / ratio);
            } else {
                this.currentRect.height = Math.floor(this.currentRect.height - (e.deltaY - this.prevDeltaY));
            }
            this.currentRect.top = Math.floor(this.currentRect.top + (prevRect.height - this.currentRect.height));
        } else if (this.resizeDirection === 'bottom-right') {
            this.currentRect.width = Math.floor(this.currentRect.width + (e.deltaX - this.prevDeltaX));
            if (ratio) {
                this.currentRect.height = Math.floor(this.currentRect.width / ratio);
            } else {
                this.currentRect.height = Math.floor(this.currentRect.height + (e.deltaY - this.prevDeltaY));
            }
        } else if (this.resizeDirection === 'top-left') {
            this.currentRect.width = Math.floor(this.currentRect.width - (e.deltaX - this.prevDeltaX));
            if (ratio) {
                this.currentRect.height = Math.floor(this.currentRect.width / ratio);
            } else {
                this.currentRect.height = Math.floor(this.currentRect.height - (e.deltaY - this.prevDeltaY));
            }
            this.currentRect.left = Math.floor(this.currentRect.left + (prevRect.width - this.currentRect.width));
            this.currentRect.top = Math.floor(this.currentRect.top + (prevRect.height - this.currentRect.height));
        } else if (this.resizeDirection === 'bottom-left') {
            this.currentRect.width = Math.floor(this.currentRect.width - (e.deltaX - this.prevDeltaX));
            if (ratio) {
                this.currentRect.height = Math.floor(this.currentRect.width / ratio);
            } else {
                this.currentRect.height = Math.floor(this.currentRect.height + (e.deltaY - this.prevDeltaY));
            }
            this.currentRect.left = Math.floor(this.currentRect.left + (prevRect.width - this.currentRect.width));
        }

        this.currentRect = this.constrainRect(this.currentRect, prevRect);
        this.config.onResize && this.config.onResize({
            rect: {...this.currentRect},
            prevRect: prevRect,
        });
    }

    public constrainRect(currentRect: RectSizeAndPos, prevRect: RectSizeAndPos): RectSizeAndPos {
        let cr = {...currentRect};
        const pr = {...prevRect};

        if (this.config.boundingBox) {
            // hit left boundary
            if (cr.left < 0) {
                cr = pr;
            }
            // hit top boundary
            if (cr.top < 0) {
                cr = pr;
            }
            // hit right boundary
            if (cr.left + cr.width > this.config.boundingBox.width) {
                cr = pr;
            }
            // hit bottom boundary
            if (cr.top + cr.height > this.config.boundingBox.height) {
                cr = pr;
            }
        }

       if (this.config.minWidth || this.config.minHeight) {
           let min: {width: number, height: number};
           const aspectRatio = this.getAspectRatio();
           if (aspectRatio) {
               min = Interactable.calculateNewSizeFromAspectRatio(aspectRatio, this.config.minWidth, this.config.minHeight);
           } else {
               min = {width: this.config.minWidth, height: this.config.minHeight};
           }

           // min width
           if (min.width && cr.width < min.width) {
               cr.left = pr.left;
               cr.width = min.width;
           }

           // min height
           if (min.height && cr.height < min.height) {
               cr.top = pr.top;
               cr.height = min.height;
           }
       }

        return cr;
    }

    private draw() {
        if (this.config.transformEl) {
            this.config.el.style.width = this.currentRect.width + 'px';
            this.config.el.style.height = this.currentRect.height + 'px';
            this.config.el.style.transform = `translate(${this.currentRect.left}px, ${this.currentRect.top}px) rotate(${this.currentRect.angle || 0}rad)`;
        }
        this.raf = null;
    }

    public static calculateNewSizeFromAspectRatio(aspectRatio: number|string, oldWidth: number, oldHeight: number) {
        let newWidth = oldWidth,
            newHeight = oldHeight;

        // convert ratio string to number
        if (aspectRatio) {
            if (typeof aspectRatio === 'string') {
                const parts = aspectRatio.split(':');
                aspectRatio = parseInt(parts[0]) / parseInt(parts[1]);
            }

            // calculate cropzone with and height based on aspect ratio and canvas size
            if (oldHeight * aspectRatio > oldWidth) {
                newHeight = oldWidth / aspectRatio;
            } else {
                newWidth = oldHeight * aspectRatio;
            }
        }

        return {width: Math.floor(newWidth), height: Math.floor(newHeight)};
    }
}
