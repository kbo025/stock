import {Injectable} from '@angular/core';
import {fabric} from 'fabric';
import {VLineBrush} from './brushes/v-line-brush';
import {HLineBrush} from './brushes/h-line-brush';
import {SquareBrush} from './brushes/square-brush';
import {Object as IObject} from 'fabric/fabric-impl';
import {CanvasStateService} from '../../canvas/canvas-state.service';
import {BrushSizes} from './draw-defaults';
import {ObjectNames} from '../../objects/object-names.enum';
import {Settings} from '@common/core/config/settings.service';
import {DiamondBrush} from './brushes/diamond-brush';
import {MarkAsDirty} from '../../../image-editor-ui/state/draw/draw.actions';
import {Store} from '@ngxs/store';

@Injectable()
export class DrawToolService {
    private initiated: Boolean;
    private customBrushes = {
        VLineBrush: VLineBrush,
        HLineBrush: HLineBrush,
        DiamondBrush: DiamondBrush,
        SquareBrush: SquareBrush,
    };
    public currentBrush = {
        type: 'PencilBrush',
        color: this.config.get('pixie.objectDefaults.global.fill'),
        width: BrushSizes[1],
    };

    constructor(
        private config: Settings,
        private canvasState: CanvasStateService,
        private store: Store,
    ) {}

    /**
     * Enable drawing mode on canvas.
     */
    public enable() {
        if ( ! this.initiated) {
            this.canvasState.on('before:path:created', e => {
                const obj = (e as any as {path: IObject}).path;
                obj.name = ObjectNames.drawing.name;
                this.store.dispatch(new MarkAsDirty());
            });
            this.initiated = true;
        }

        this.canvasState.fabric.isDrawingMode = true;
        this.setBrushType(this.currentBrush.type);
        this.setBrushSize(this.currentBrush.width);
    }

    /**
     * Disable drawing mode on canvas.
     */
    public disable() {
        this.canvasState.fabric.isDrawingMode = false;
    }

    public getBrushType(): string {
        return this.currentBrush.type;
    }

    public setBrushType(type: string) {
        const canvas = this.canvasState.fabric;
        this.currentBrush.type = type;
        canvas.freeDrawingBrush = fabric[type] ?
            new fabric[type](this.canvasState.fabric) :
            this.customBrushes[type](this.canvasState.fabric);
        this.applyBrushStyles();
    }

    /**
     * Apply current brush styles to fabric.js FreeDrawingBrush instance.
     */
    private applyBrushStyles() {
        Object.keys(this.currentBrush)
            .forEach(key => {
                this.canvasState.fabric.freeDrawingBrush[key] = this.currentBrush[key];
            });
        const brush = this.canvasState.fabric.freeDrawingBrush as any;
        if (brush.getPatternSrc) {
            brush.source = brush.getPatternSrc.call(brush);
        }
    }

    public setBrushSize(size: number) {
        this.currentBrush.width = size;
        this.applyBrushStyles();
    }

    public getBrushSize(): number {
        return this.currentBrush.width;
    }

    /**
     * Change color of drawing brush.
     */
    public setBrushColor(color: string) {
        this.currentBrush.color = color;
        this.applyBrushStyles();
    }

    /**
     * Get color of drawing brush.
     */
    public getBrushColor(): string {
        return this.currentBrush.color;
    }
}
