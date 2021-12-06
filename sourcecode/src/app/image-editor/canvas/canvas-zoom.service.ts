import {Injectable, NgZone} from '@angular/core';
import {CanvasPanService} from './canvas-pan.service';
import {CanvasStateService} from './canvas-state.service';
import {Settings} from 'common/core/config/settings.service';
import {Store} from '@ngxs/store';
import {SetZoom} from '../state/editor-state-actions';

@Injectable()
export class CanvasZoomService {
    protected maxZoom = 200;
    protected minZoom = 100;
    protected zoomStep = 5;
    protected currentZoom = 100;

    constructor(
        private state: CanvasStateService,
        private pan: CanvasPanService,
        private config: Settings,
        private store: Store,
        private zone: NgZone,
    ) {}

    public get() {
        return this.currentZoom;
    }

    public getScaleFactor() {
        return this.state.fabric.getZoom();
    }

    public zoomIn(amount = this.zoomStep) {
        this.set(this.currentZoom + amount);
    }

    public canZoomIn(amount = this.zoomStep): boolean {
        return (this.currentZoom + amount) <= this.maxZoom;
    }

    public canZoomOut(amount = this.zoomStep): boolean {
        return (this.currentZoom - amount) >= this.minZoom;
    }

    public zoomOut(amount = this.zoomStep) {
        this.set(this.currentZoom - amount);
    }

    /**
     * Zoom canvas to specified scale.
     */
    public set(zoomPercentage: number, resize: boolean = true) {
        zoomPercentage = Math.trunc(zoomPercentage); // remove any decimals integer might have
        if (zoomPercentage < this.minZoom || zoomPercentage > this.maxZoom) return;
        const fabricZoomFactor = zoomPercentage / 100;

        const width = Math.round(this.state.original.width * fabricZoomFactor),
            height = Math.round(this.state.original.height * fabricZoomFactor);

        this.state.fabric.setZoom(fabricZoomFactor);

        if (resize) {
            this.state.fabric.setHeight(height);
            this.state.fabric.setWidth(width);
            this.state.sizeChanged$.next({width, height, fromZoom: true});
        }

        this.currentZoom = zoomPercentage;
        this.store.dispatch(new SetZoom(this.currentZoom));
    }

    /**
     * Resize canvas to fit available screen space.
     */
    public fitToScreen() {
        if ( ! this.config.get('pixie.tools.zoom.fitImageToScreen')) return;
        this.state.cacheWrapperRects();
        const size = this.state.wrapperElRect;

        const wrapperHeight = Math.max(size.height, 1);
        const wrapperWidth = Math.max(size.width, 1);

        const gutterSize = 40;
        let maxWidth = wrapperWidth - gutterSize;
        if ( ! maxWidth) maxWidth = wrapperWidth;
        let maxHeight = wrapperHeight - gutterSize;
        if ( ! maxHeight) maxHeight = wrapperHeight;

        // image won't fit into current space available to canvas
        if (this.state.original.height > maxHeight || this.state.original.width > maxWidth) {
            const scale = Math.min(maxHeight / this.state.original.height, maxWidth / this.state.original.width);
            // no need to allow zooming out beyond maximum size that fits into canvas
            const fittedZoom = Math.trunc(scale * 100);
            // round to nearest zoom step
            let roundedToStep = fittedZoom / this.zoomStep;
            // make sure we don't get to zero
            roundedToStep = Math.floor(roundedToStep) < 0 ? roundedToStep : Math.floor(roundedToStep);
            this.minZoom = Math.max(roundedToStep * this.zoomStep, 1);
        // image will fit, so we can just load it in original size
        } else {
            this.minZoom = 100;
        }

        this.set(this.minZoom);
    }

    public init() {
        if ( ! this.config.get('pixie.tools.zoom.allowUserZoom')) return;
        this.bindMouseWheel();
        this.bindToPinchZoom();
    }

    private bindMouseWheel() {
        this.state.on('mouse:wheel', opt => {
            opt.e.preventDefault();
            opt.e.stopPropagation();

            if ((opt.e as WheelEvent).deltaY < 0) {
                this.zoomIn();
            } else {
                this.zoomOut();
            }

            this.pan.set();
            this.state.fabric.requestRenderAll();
        });
    }

    /**
     * Resize canvas when pinch zooming on mobile.
     */
    private bindToPinchZoom() {
        this.zone.runOutsideAngular(() => {
            const mc = new Hammer.Manager(this.state.maskWrapperEl);
            const pinch = new Hammer.Pinch({});
            mc.add([pinch]);

            mc.on('pinch', (e: HammerInput) => {
                const step = Math.abs(e['overallVelocity']) * 100;

                if (e['additionalEvent'] === 'pinchout') {
                    this.zoomIn(step);
                } else {
                    this.zoomOut(step);
                }

                this.pan.set();
                this.state.fabric.requestRenderAll();
            });
        });
    }
}
