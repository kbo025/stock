import {Injectable} from '@angular/core';
import {CanvasService} from '../../canvas/canvas.service';
import {Object as IObject} from 'fabric/fabric-impl';
import {fabric} from 'fabric';
import {FrameToolService} from '../frame/frame-tool.service';
import {CanvasZoomService} from '../../canvas/canvas-zoom.service';
import {ObjectListService} from '../../objects/object-list.service';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class TransformToolService {
    public currentFreeAngle$ = new BehaviorSubject<number>(0);

    constructor(
        private canvas: CanvasService,
        private frameTool: FrameToolService,
        private zoom: CanvasZoomService,
        private objects: ObjectListService,
    ) {}

    public rotateLeft() {
        this.rotateFixed(-90);
    }

    public rotateRight() {
        this.rotateFixed(90);
    }

    private rotateFixed(degrees: number) {
        this.zoom.set(100, false);
        this.canvas.activeObject.deselect();
        const currentFixedAngle = this.helper().data.fixedAngle || 0;
        degrees = Math.round(degrees / 90) * 90;
        const newAngle = currentFixedAngle + (this.helper().data.freeAngle || 0) + degrees;

        // noinspection JSSuspiciousNameCombination
        this.canvas.resize(
            this.canvas.state.original.height,
            this.canvas.state.original.width,
            false,
            false,
        );

        this.storeObjectsRelationToHelper();

        this.helper().rotate(newAngle);
        this.helper().data.fixedAngle = currentFixedAngle + degrees;

        this.helper().center();
        this.transformObjectsBasedOnHelper();
        this.frameTool.resize(this.frameTool.activeFrame.currentSizeInPercent);
        // pattern frames dont resize properly if we dont zoom on next paint
        requestAnimationFrame(() => {
            this.zoom.fitToScreen();
        });
    }

    public rotateFree(degrees: number) {
        this.storeObjectsRelationToHelper();
        this.canvas.activeObject.deselect();
        const newAngle = (this.helper().data.fixedAngle || 0) + degrees;
        const scale = this.getImageScale(newAngle, this.helper());

        this.helper().angle = newAngle;
        this.helper().scaleX = scale;
        this.helper().scaleY = scale;

        this.helper().data.freeAngle = degrees;
        this.currentFreeAngle$.next(degrees);

        this.transformObjectsBasedOnHelper();
    }

    /**
     * Flip canvas vertically or horizontally.
     */
    public flip(direction: 'horizontal'|'vertical') {
        const prop = direction === 'horizontal' ? 'flipY' : 'flipX';
        this.objects.getAll().forEach(obj => {
            obj[prop] = !obj[prop];
        });
        this.canvas.render();
    }

    /**
     * Get minimum scale in order for image to fill the whole canvas, based on rotation.
     */
    private getImageScale(angle: number, image: IObject): number {
        angle = fabric.util.degreesToRadians(angle);
        const w = this.canvas.state.original.width;
        const h = this.canvas.state.original.height;
        const cw = w / 2;
        const ch = h / 2;

        const iw = image.width / 2;
        const ih = image.height / 2;
        const dist = Math.sqrt(Math.pow(cw, 2) + Math.pow(ch, 2));
        const diagAngle = Math.asin(ch / dist);

        let a1 = ((angle % (Math.PI * 2)) + Math.PI * 4) % (Math.PI * 2);
        if (a1 > Math.PI) {
            a1 -= Math.PI;
        }
        if (a1 > Math.PI / 2 && a1 <= Math.PI) {
            a1 = (Math.PI / 2) - (a1 - (Math.PI / 2));
        }

        const ang1 = Math.PI / 2 - diagAngle - Math.abs(a1);
        const ang2 = Math.abs(diagAngle - Math.abs(a1));
        const dist1 = Math.cos(ang1) * dist;
        const dist2 = Math.cos(ang2) * dist;
        const scale = Math.max(dist2 / (iw), dist1 / (ih));
        return scale;
    }

    private storeObjectsRelationToHelper() {
        this.objects.getAll().forEach(o => {
            if (o !== this.helper()) {
                o.data.relationToCanvas = fabric.util.multiplyTransformMatrices(
                    fabric.util.invertTransform(this.helper().calcTransformMatrix()),
                    o.calcTransformMatrix()
                );
            }
        });
    }

    private transformObjectsBasedOnHelper() {
        this.objects.getAll().forEach(o => {
            if (o.data.relationToCanvas) {
                const newTransform = fabric.util.multiplyTransformMatrices(
                    this.helper().calcTransformMatrix(),
                    o.data.relationToCanvas
                );
                const opt = fabric.util.qrDecompose(newTransform);
                o.set({flipX: false, flipY: false});
                o.setPositionByOrigin(
                    { x: opt.translateX, y: opt.translateY } as any,
                    'center',
                    'center'
                );
                o.set(opt);
                o.setCoords();
                o.data.relationToCanvas = null;
            }
        });
    }

    private helper() {
        return this.canvas.transformHelper;
    }
}
