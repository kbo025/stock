import {Injectable} from '@angular/core';
import {randomString} from '@common/core/utils/random-string';
import {Object as IObject} from 'fabric/fabric-impl';
import {FormBuilder} from '@angular/forms';
import {Settings} from '@common/core/config/settings.service';
import {CanvasStateService} from '../canvas/canvas-state.service';
import {ObjectControlsService} from '../../image-editor-ui/object-controls/object-controls.service';

@Injectable({
    providedIn: 'root'
})
export class ObjectActionsService {

    constructor(
        private fb: FormBuilder,
        private config: Settings,
        private canvasState: CanvasStateService,
        private controls: ObjectControlsService,
    ) {}

    /**
     * Move specified object on canvas in specified direction.
     */
    public move(obj: IObject, direction: 'top'|'right'|'bottom'|'left', amount: number) {
        if ( ! obj) return;
        obj.set(direction as any, obj[direction] + amount);
        this.canvasState.fabric.requestRenderAll();
        this.controls.reposition();
    }

    /**
     * Bring specified to front of canvas.
     */
    public bringToFront(obj: IObject) {
        if ( ! obj) return;
        obj.bringToFront();
        this.canvasState.fabric.requestRenderAll();
    }

    /**
     * Send specified to the back of canvas.
     */
    public sendToBack(obj: IObject) {
        if ( ! obj) return;
        obj.sendToBack();
        this.canvasState.fabric.requestRenderAll();
    }

    /**
     * Flip specified horizontally.
     */
    public flipHorizontal(obj: IObject) {
        if ( ! obj) return;
        obj.flipX = !obj.flipX;
        this.canvasState.fabric.requestRenderAll();
    }

    public duplicate(original: IObject) {
        if ( ! original) return;

        this.deselect();

        original.clone(clonedObj => {
            clonedObj.set({
                left: original.left + 40,
                top: original.top + 40,
                data: {...original.data, id: randomString(10)},
                name: original.name,
            });

            this.canvasState.fabric.add(clonedObj);
            this.select(clonedObj);
            this.canvasState.fabric.requestRenderAll();
        });
    }

    /**
     * Delete specified object.
     */
    public delete(obj: IObject) {
        if ( ! obj) return;
        this.canvasState.fabric.remove(obj);
        this.canvasState.fabric.requestRenderAll();
    }

    /**
     * Deselect active object.
     */
    public deselect() {
        this.canvasState.fabric.discardActiveObject();
        this.canvasState.fabric.requestRenderAll();
    }

    /**
     * Set specified object as new active object.
     */
    public select(obj: IObject) {
        this.canvasState.fabric.setActiveObject(obj);
    }
}
