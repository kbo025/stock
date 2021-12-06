import {Injectable} from '@angular/core';
import {CanvasService} from '../../canvas/canvas.service';
import {Settings} from 'common/core/config/settings.service';
import {FramePatternsService} from './frame-patterns.service';
import {ActiveFrameService} from './active-frame.service';
import {FrameBuilderService} from './frame-builder.service';
import {Frame} from './frame';

@Injectable({
    providedIn: 'root'
})
export class FrameToolService {
    private frames: Frame[] = [];

    constructor(
        private config: Settings,
        private canvas: CanvasService,
        public patterns: FramePatternsService,
        public activeFrame: ActiveFrameService,
        private frameBuilder: FrameBuilderService,
    ) {
        this.config.all$().subscribe(() => {
            this.frames = this.config.get('pixie.tools.frame.items');
        });

        this.canvas.state.loaded.subscribe(() => {
            this.canvas.state.on('object:added', () => {
                Object.values(this.activeFrame.parts).forEach(part => part.moveTo(98));
            });
        });
    }

    /**
     * Add a new frame to canvas.
     */
    public add(frameName: string) {
        const frame = this.getByName(frameName);
        if (this.activeFrame.is(frame)) return;

        if (this.activeFrame.exists()) {
            this.activeFrame.remove();
        }

        this.activeFrame.currentSizeInPercent = frame.size.default;
        const size = this.calcFrameSizeInPixels(frame.size.default);
        this.frameBuilder.build(frame, size);
    }

    /**
     * Resize active frame to specified percentage relative to canvas size.
     */
    public resize(percentage?: number) {
        if (this.activeFrame.exists()) {
            if ( ! percentage) {
                percentage = this.activeFrame.currentSizeInPercent;
            } else {
                this.activeFrame.currentSizeInPercent = percentage;
            }
            const size = this.calcFrameSizeInPixels(percentage);
            this.frameBuilder.resize(size);
            this.patterns.scale(size);
            this.canvas.render();
        }
    }

    /**
     * Change active "basic" frame color.
     */
    public changeColor(value: string) {
        this.activeFrame.changeColor(value);
    }

    public remove() {
        this.activeFrame.remove();
    }

    /**
     * Get frame by specified name.
     */
    public getByName(frameName: string) {
        return this.getAll().find(frame => frame.name === frameName);
    }

    /**
     * Get config of currently active frame.
     */
    public getActive(): Frame|null {
        return this.activeFrame.config;
    }

    public getAll() {
        return this.frames;
    }

    /**
     * Calculate frame size in pixels based on specified percentage relative to canvas size.
     */
    private calcFrameSizeInPixels(percentage: number) {
        const min = Math.min(this.canvas.state.original.width, this.canvas.state.original.height);
        return Math.ceil(((percentage / 100) * min));
    }
}
