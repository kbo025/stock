import {Injectable, NgZone} from '@angular/core';
import {CanvasService} from '../../canvas/canvas.service';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';
import {CanvasStateService} from '../../canvas/canvas-state.service';
import {Settings} from '@common/core/config/settings.service';
import {RectSizeAndPos} from '../../../image-editor-ui/utils/rect-size-and-pos';
import {CanvasZoomService} from '../../canvas/canvas-zoom.service';
import {Interactable} from '../../../image-editor-ui/utils/interactable';

@Injectable()
export class CropZoneService {
    private _minWidth = 50;
    private _minHeight = 50;
    public interactable: Interactable;
    private sub: Subscription;
    get minWidth() {
        return this._minWidth * this.zoom.getScaleFactor();
    }
    get minHeight() {
        return this._minHeight * this.zoom.getScaleFactor();
    }
    public els: {
        innerZone: HTMLDivElement,
        maskTop: HTMLDivElement,
        maskLeft: HTMLDivElement,
        maskRight: HTMLDivElement,
        maskBottom: HTMLDivElement,
        lineVer1: HTMLDivElement,
        lineVer2: HTMLDivElement,
        lineHor1: HTMLDivElement,
        lineHor2: HTMLDivElement,
    };
    public currentRectChanged$ = new Subject();
    public visible$ = new BehaviorSubject<boolean>(false);
    get moving$() {
        return this.interactable.moving$;
    }

    aspectRatioString$ = new BehaviorSubject<string>('1:1');
    private aspectRatioNumber: number;
    set aspectRatio(ratio: string) {
        this.aspectRatioString$.next(ratio);
        if (this.aspectRatioString$.value) {
            const parts = this.aspectRatioString$.value.split(':');
            this.aspectRatioNumber = parseInt(parts[0]) / parseInt(parts[1]);
        } else {
            this.aspectRatioNumber = null;
        }
        if (this.interactable) {
            this.interactable.setConfig({aspectRatio: this.aspectRatioNumber});
        }
    }

    constructor(
        private canvas: CanvasService,
        private canvasState: CanvasStateService,
        private config: Settings,
        private zoom: CanvasZoomService,
        private zone: NgZone,
    ) {}

    public init() {
        this.createInteractable();
        this.reset();
    }

    public hide() {
        this.visible$.next(false);
    }

    public getSize(): RectSizeAndPos {
        const rect = this.interactable.currentRect;
        return {
            width: Math.ceil(rect.width / this.zoom.getScaleFactor()),
            height: Math.ceil(rect.height / this.zoom.getScaleFactor()),
            left: Math.ceil(rect.left / this.zoom.getScaleFactor()),
            top: Math.ceil(rect.top / this.zoom.getScaleFactor()),
        };
    }

    public resize(width: number, height: number): {width: number, height: number} {
        const zoom = this.zoom.getScaleFactor();
        const newWidth = Math.min(this.canvasState.original.width, width) * zoom;
        const newHeight = Math.min(this.canvasState.original.height, height) * zoom;
        if (newWidth !== this.interactable.currentRect.width || newHeight !== this.interactable.currentRect.height) {
            this.interactable.resize({width: newWidth, height: newHeight});
        }
        return {
            width: Math.floor(this.interactable.currentRect.width / zoom),
            height: Math.floor(this.interactable.currentRect.height / zoom)
        };
    }

    private createInteractable() {
        this.interactable = new Interactable({
            el: this.els.innerZone,
            zone: this.zone,
            minWidth: this.minWidth,
            minHeight: this.minHeight,
            boundingBox: this.canvas.state.maskWrapperElRect, // TODO: see if it updates automatically on resize
            aspectRatio: this.aspectRatioNumber,
            onMove: e => {
                this.draw(e.rect);
            },
            onResize: e => {
                this.draw(e.rect);
            }
        });

        if ( ! this.sub) {
            this.sub = this.canvasState.wrapperRectsCached$.subscribe(() => {
                this.interactable.setConfig({boundingBox: this.canvas.state.maskWrapperElRect});
            });
        }
    }

    public reset(aspectRatio?: string) {
        if (aspectRatio !== undefined) {
            this.aspectRatio = aspectRatio;
        }
        this.interactable.centerWithinRect(this.canvas.state.maskWrapperElRect);
        this.draw(this.interactable.currentRect);
    }

    private draw(rect: RectSizeAndPos) {
        this.currentRectChanged$.next();
        this.drawInnerZone(rect);
        this.drawMask(rect);
        this.drawLines(rect);
    }

    private drawInnerZone(rect: RectSizeAndPos) {
        this.els.innerZone.style.width = rect.width + 'px';
        this.els.innerZone.style.height = rect.height + 'px';
        this.els.innerZone.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
    }

    private drawMask(rect: RectSizeAndPos) {
        const contWidth = this.canvas.state.maskWrapperElRect.width;
        const contHeight = this.canvas.state.maskWrapperElRect.height;
        // top
        this.els.maskTop.style.height = rect.top + 'px';
        this.els.maskTop.style.width = contWidth + 'px';
        // left
        this.els.maskLeft.style.top = rect.top + 'px';
        this.els.maskLeft.style.height = rect.height + 'px';
        this.els.maskLeft.style.width = rect.left + 'px';
        // right
        const rightLeft = rect.left + rect.width;
        this.els.maskRight.style.left = rightLeft + 'px';
        this.els.maskRight.style.top = rect.top + 'px';
        this.els.maskRight.style.height = rect.height + 'px';
        this.els.maskRight.style.width = (contWidth - rightLeft) + 'px';
        // bottom
        this.els.maskBottom.style.height = contHeight - (rect.top + rect.height) + 'px';
        this.els.maskBottom.style.width = contWidth + 'px';
    }

    private drawLines(rect: RectSizeAndPos) {
        const horSpace = (rect.width - 2) / 3;
        this.els.lineVer1.style.height = rect.height + 'px';
        this.els.lineVer1.style.transform = `translate(${horSpace}px, 0)`;
        this.els.lineVer2.style.height = rect.height + 'px';
        this.els.lineVer2.style.transform = `translate(${horSpace * 2}px, 0)`;
        const verSpace = (rect.height - 2) / 3;
        this.els.lineHor1.style.width = rect.width + 'px';
        this.els.lineHor1.style.transform = `translate(0, ${verSpace}px)`;
        this.els.lineHor2.style.width = rect.width + 'px';
        this.els.lineHor2.style.transform = `translate(0, ${verSpace * 2}px)`;
    }
}
