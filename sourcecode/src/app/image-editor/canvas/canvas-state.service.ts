import {fabric} from 'fabric';
import {BehaviorSubject, ReplaySubject} from 'rxjs';
import {Settings} from 'common/core/config/settings.service';
import {Injectable, NgZone} from '@angular/core';
import {IEvent} from 'fabric/fabric-impl';

export enum ContentLoadingStateDisplayName {
    blank = 'Loading Canvas',
    overlayImage = 'Loading Image',
    mainImage = 'Loading Image',
    state = 'Loading State',
    merge = 'Processing Image'
}

export type ContentLoadingStateName = 'blank'|'overlayImage'|'mainImage'|'state'|'merge'|'filter';

export interface CanvasSizeChangedEvent {
    width: number;
    height: number;
    fromZoom?: boolean; // whether original size actually changed or canvas was just zoomed
}

export interface ContentLoadingState {
    name?: ContentLoadingStateName;
    loading?: boolean;
}

@Injectable()
export class CanvasStateService {
    public original: {
        width: number;
        height: number;
    } = {width: 0, height: 0};

    /**
     * Fired when canvas and fabric.js are fully loaded and ready for interaction.
     */
    public loaded = new ReplaySubject(1);
    public contentLoadingState$ = new ReplaySubject<ContentLoadingState>(1);
    public sizeChanged$ = new ReplaySubject<CanvasSizeChangedEvent>(1);
    public wrapperRectsCached$ = new ReplaySubject(1);

    /**
     * Canvas wrapper el, centers the canvas vertically and horizontally.
     */
    public wrapperEl: HTMLElement;
    public wrapperElRect: DOMRect;

    /**
     * Inner canvas wrapper el, same size as canvas itself.
     */
    public maskWrapperEl: HTMLElement;
    public maskWrapperElRect: DOMRect;
    public rootEl: HTMLElement;

    public fabric: fabric.Canvas;

    constructor(private config: Settings, private zone: NgZone) {}

    /**
     * Check if nothing to open was specified via config.
     */
    public isEmpty(): boolean {
        return !this.config.get('pixie.image') &&
            !this.config.get('pixie.blankCanvasSize') &&
            (!this.fabric || this.fabric.getObjects().length === 0);
    }

    public cacheWrapperRects() {
        this.wrapperElRect = this.wrapperEl.getBoundingClientRect();
        this.maskWrapperElRect = this.maskWrapperEl.getBoundingClientRect();
        this.wrapperRectsCached$.next();
    }

    public on(event: string, callback: (e: IEvent) => void) {
        return this.zone.runOutsideAngular(() => {
            return this.fabric.on(event, callback);
        });
    }
}
