import {Injectable} from '@angular/core';
import {Rect} from 'fabric/fabric-impl';
import {Frame} from './frame';
import {CanvasService} from '../../canvas/canvas.service';

@Injectable()
export class ActiveFrameService {

    /**
     * List of frame corner names.
     */
    public readonly corners = [
        'topLeft', 'topRight', 'bottomLeft', 'bottomRight'
    ];

    /**
     * List of frame side names.
     */
    public readonly sides = [
        'top', 'right', 'bottom', 'left'
    ];

    public parts: {
        topLeft?: Rect;
        top?: Rect;
        topRight?: Rect;
        right?: Rect;
        bottomRight?: Rect;
        bottom?: Rect;
        bottomLeft?: Rect;
        left?: Rect;
    } = {};

    /**
     * Configuration for currently active frame.
     */
    public config: Frame;

    /**
     * Current size of frame in percents relative to canvas size.
     */
    public currentSizeInPercent: number;

    constructor(
        private canvas: CanvasService,
    ) {}

    public getPartNames() {
        return this.corners.concat(this.sides);
    }

    public hide() {
        Object.values(this.parts).forEach(part => part.set({visible: false}));
        this.canvas.render();
    }

    public show() {
        Object.values(this.parts).forEach(part => part.set({visible: true}));
        this.canvas.render();
    }

    /**
     * Check if frame is added to canvas.
     */
    public exists(): boolean {
        return this.config != null;
    }

    /**
     * Remove currently active frame.
     */
    public remove() {
        if ( ! this.exists()) return;

        // delete all fabric object references
        this.config = null;
        Object.values(this.parts).forEach(part => {
            this.canvas.fabric().remove(part);
        });
        this.parts = {};
        this.canvas.render();
    }

    /**
     * Check if specified frame is active.
     */
    public is(frame: Frame): boolean {
        if ( ! this.config) return false;
        return this.config.name === frame.name;
    }

    /**
     * Change color of basic frame.
     */
    public changeColor(value: string) {
        if (this.config.mode !== 'basic') return;

        Object.values(this.parts).forEach(part => {
            part.set('fill', value);
        });

        this.canvas.render();
    }

    /**
     * Check if current frame is "basic".
     */
    public isBasic() {
        return this.config && this.config.mode === 'basic';
    }

    public getMinSize() {
        if ( ! this.exists()) return;
        return this.config.size.min || 1;
    }

    public getMaxSize() {
        if ( ! this.exists()) return;
        return this.config.size.max || 35;
    }

    public getDefaultSize() {
        if ( ! this.exists()) return;
        return this.config.size.default || 15;
    }

    public getFabricObject() {
        return this.canvas.fabric().getObjects().find(o => o.name === 'frame.group');
    }
}
