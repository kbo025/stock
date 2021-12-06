import {Injectable} from '@angular/core';
import {fabric} from 'fabric';
import {staticObjectConfig} from '../../objects/static-object-config';
import {ActiveFrameService} from './active-frame.service';
import {CanvasService} from '../../canvas/canvas.service';
import {Settings} from 'common/core/config/settings.service';
import {FramePatternsService} from './frame-patterns.service';
import {Frame} from './frame';

@Injectable()
export class FrameBuilderService {
    constructor(
        private config: Settings,
        private activeFrame: ActiveFrameService,
        private canvas: CanvasService,
        private patterns: FramePatternsService,
    ) {}

    /**
     * Build a new canvas frame group.
     */
    public build(frame: Frame, size: number) {
        this.createParts(frame);
        this.resize(size);
        this.activeFrame.config = frame;

        // basic frame has no pattern fill
        if (frame.mode === 'basic') {
            return this.canvas.render();
        }

        this.patterns.load(frame).then(() => {
            this.patterns.scale(size);
            this.canvas.render();
        });
    }

    /**
     * Create rect object for each frame part.
     */
    private createParts(frame: Frame) {
        this.activeFrame.getPartNames().forEach(part => {
            const fill = frame.mode === 'basic' ? this.config.get('pixie.objectDefaults.global.fill') : null;
            this.activeFrame.parts[part] = new fabric.Rect({
                ...staticObjectConfig,
                fill: fill,
                originX: 'left',
                originY: 'top',
                name: 'frame.rect.' + part,
                objectCaching: false, // patterns are not redrawn correctly when resizing frame without this
                data: {pixieInternal: true},
            });
            this.canvas.fabric().add(this.activeFrame.parts[part]);
        });
    }

    /**
     * Position and resize all frame parts.
     */
    public resize(value: number) {
        const fullWidth = this.canvas.state.original.width,
            fullHeight = this.canvas.state.original.height,
            frame = this.activeFrame,
            cornerSize = value;

        this.activeFrame.parts.topLeft.set({
            width: cornerSize, height: cornerSize
        });

        this.activeFrame.parts.topRight.set({
            left: fullWidth - frame.parts.topLeft.getScaledWidth(),
            width: cornerSize, height: cornerSize,
        });

        this.activeFrame.parts.top.set({
            left: frame.parts.topLeft.getScaledWidth() - 1,
            width: (fullWidth - frame.parts.topLeft.getScaledWidth() - frame.parts.topRight.getScaledWidth()) + 3,
            height: cornerSize,
        });

        this.activeFrame.parts.bottomLeft.set({
            top: fullHeight - frame.parts.topLeft.getScaledHeight(),
            width: cornerSize, height: cornerSize,
        });

        this.activeFrame.parts.left.set({
            top: frame.parts.topLeft.getScaledHeight() - 1,
            width: cornerSize,
            height: (fullHeight - frame.parts.topLeft.getScaledHeight() - frame.parts.bottomLeft.getScaledHeight()) + 3,
        });

        this.activeFrame.parts.bottomRight.set({
            left: fullWidth - frame.parts.bottomLeft.getScaledWidth(),
            top: fullHeight - frame.parts.topRight.getScaledWidth(),
            width: cornerSize,
            height: cornerSize,
        });

        this.activeFrame.parts.bottom.set({
            left: frame.parts.top.left,
            top: fullHeight - frame.parts.top.getScaledHeight(),
            width: frame.parts.top.getScaledWidth(),
            height: cornerSize,
        });

        this.activeFrame.parts.right.set({
            left: fullWidth - frame.parts.left.getScaledWidth(),
            top: frame.parts.left.top,
            width: frame.parts.left.width,
            height: frame.parts.left.getScaledHeight(),
        });
    }
}
