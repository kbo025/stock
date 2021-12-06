import {Injectable, NgZone} from '@angular/core';
import {delay} from 'rxjs/operators';
import {IText} from 'fabric/fabric-impl';
import {fabric} from 'fabric';
import {ActiveObjectService} from '../../image-editor/canvas/active-object/active-object.service';
import {Interactable} from '../utils/interactable';
import {Select, Store} from '@ngxs/store';
import {EditorState} from '../../image-editor/state/editor-state';
import {BehaviorSubject, Observable} from 'rxjs';
import {CanvasZoomService} from '../../image-editor/canvas/canvas-zoom.service';
import {TEXT_CONTROLS_PADDING} from '../../image-editor/tools/text/text-tool.service';
import {CanvasStateService} from '../../image-editor/canvas/canvas-state.service';
import {OpenPanel} from '../../image-editor/state/editor-state-actions';
import {DrawerName} from '../toolbar-controls/drawers/drawer-name.enum';
import {Settings} from '@common/core/config/settings.service';
import {ObjectControls, PixieConfig} from '../../image-editor/default-settings';

@Injectable({
    providedIn: 'root'
})
export class ObjectControlsService {
    @Select(EditorState.activeObjId) activeObjId$: Observable<string>;
    public objectIsBeingTransformed$ = new BehaviorSubject<boolean>(false);
    private interactable: Interactable;
    public boundingBox: HTMLElement;
    public userConfig$ = new BehaviorSubject<ObjectControls>({});
    private floatingControls: HTMLElement;
    private el: HTMLElement;

    _floatingControlsRect: DOMRect;
    get floatingControlsRect() {
        if ( ! this._floatingControlsRect?.width) {
            this._floatingControlsRect = this.floatingControls.getBoundingClientRect();
        }
        return this._floatingControlsRect;
    }

    constructor(
        public activeObject: ActiveObjectService,
        private canvasState: CanvasStateService,
        private zone: NgZone,
        private zoom: CanvasZoomService,
        private store: Store,
        private config: Settings,
    ) {}

    public init(el: HTMLElement, boundingBox: HTMLElement, floatingControls: HTMLElement) {
        this.el = el;
        this.boundingBox = boundingBox;
        this.floatingControls = floatingControls;
        this.createInteractable();
        this.bindToObjectSelection();

        this.activeObject.sizeOrPositionChanged$
            .subscribe(() => {
                this.reposition();
            });
    }

    public show() {
        this.el.classList.add('visible');
    }

    public hide() {
        this.el.classList.remove('visible');
    }

    public visible(): boolean {
        return this.el.classList.contains('visible');
    }

    public reposition() {
        const obj = this.activeObject.get();
        if ( ! obj || ! this.el) return;
        const el = this.boundingBox;

        // bounding box position
        const angleRad = fabric.util.degreesToRadians(obj.angle);
        let width = Math.round(obj.getScaledWidth() * this.zoom.getScaleFactor());
        let height = Math.round(obj.getScaledHeight() * this.zoom.getScaleFactor());
        let left = Math.round(obj.left * this.zoom.getScaleFactor());
        let top = Math.round(obj.top * this.zoom.getScaleFactor());

        const centerX = obj.originX === 'center' ? (width / 2) : 0;
        const centerY = obj.originY === 'center' ? (height / 2) : 0;

        if (obj.padding) {
            width += obj.padding * 2;
            height += obj.padding * 2;
            left -= obj.padding;
            top -= obj.padding;
        }

        // position bounding box
        el.style.width = width + 'px';
        el.style.height = height + 'px';
        el.style.transform = `translate(${left - centerX}px, ${top - centerY}px) rotate(${angleRad}rad)`;

        this.positionFloatingControls();
    }

    private bindToObjectSelection() {
        // wait till next frame to get correct size for newly added object
        this.activeObjId$.pipe(delay(0)).subscribe(objId => {
            this.objectIsBeingTransformed$.next(false);
            if (objId) {
                // reposition in case canvas size changed since controls were visible last
                this.getUserConfigForActiveObject();
                this.show();
                this.reposition();
            } else {
                this.hide();
            }
        });
    }

    private positionFloatingControls() {
        const obj = this.activeObject.get();
        if ( ! obj || ! this.el) return;

        // make sure rotation handle is not covered when it's at the top
        const floatingControlsTopOffset =  obj.angle > 168 && obj.angle < 188 ? -30 : -15;
        const canvasRect = this.canvasState.maskWrapperElRect;
        const workspaceRect = this.canvasState.wrapperElRect;

        // margin between canvas el and wrapper el edges
        const canvasTopMargin = canvasRect.top - workspaceRect.top;
        const canvasLeftMargin = canvasRect.left - workspaceRect.left;
        const canvasRightMargin = workspaceRect.width - (canvasLeftMargin + canvasRect.width);
        const canvasBottomMargin = workspaceRect.height - (canvasTopMargin + canvasRect.height);

        // floating controls max boundaries
        const maxTop = -canvasTopMargin;
        const maxLeft = -(canvasRect.left - workspaceRect.left);
        const maxRight = (canvasRect.width - this.floatingControlsRect.width) + canvasRightMargin;
        const maxBottom = (canvasRect.height - this.floatingControlsRect.height) + canvasBottomMargin;

        // position floating controls
        const boundingRect = obj.getBoundingRect();
        let floatingTop = boundingRect.top - this.floatingControlsRect.height + floatingControlsTopOffset;
        let floatingLeft = boundingRect.left + (boundingRect.width / 2) - (this.floatingControlsRect.width / 2);

        floatingTop = Math.min(maxBottom, Math.max(maxTop, floatingTop));
        floatingLeft = Math.min(maxRight, Math.max(maxLeft, floatingLeft));
        this.floatingControls.style.transform = `translate(${floatingLeft}px, ${floatingTop}px) rotate(0deg)`;
    }

    private createInteractable() {
        this.interactable = new Interactable({
            el: this.boundingBox,
            zone: this.zone,
            minWidth: 50,
            minHeight: 50,
            maintainInitialAspectRatio: true,
            onDoubleTap: () => {
                if (this.activeObject.isText()) {
                    this.enableTextEditing();
                } else {
                    const obj = this.activeObject.get();
                    if (!obj && !this.store.selectSnapshot(EditorState.dirty)) {
                        this.store.dispatch(new OpenPanel(DrawerName.OBJECT_SETTINGS));
                    }
                }
            },
            onInteractStart: () => {
                this.zone.run(() => this.objectIsBeingTransformed$.next(true));
            },
            onInteractEnd: () => {
                this.zone.run(() => this.objectIsBeingTransformed$.next(false));
            },
            onRotate: e => {
                const obj = this.activeObject.get();
                const newAngle = fabric.util.radiansToDegrees(e.rect.angle);
                if (newAngle !== obj.angle) {
                    obj.rotate(newAngle);
                    this.reposition();
                    this.canvasState.fabric.requestRenderAll();
                }
            },
            onMove: e => {
                if (this.userConfig$.value.lockMovement) {
                    return;
                }
                const obj = this.activeObject.get();
                const centerX = e.rect.width / 2;
                const centerY = e.rect.height / 2;
                obj.set('left', ((e.rect.left + centerX) / this.zoom.getScaleFactor()));
                obj.set('top', ((e.rect.top + centerY) / this.zoom.getScaleFactor()));
                this.reposition();
                this.canvasState.fabric.requestRenderAll();
            },
            onResize: e => {
                const obj = this.activeObject.get();
                if (obj.type === 'i-text') {
                    const delta = e.rect.width - e.prevRect.width;
                    if (delta > 0 || (obj.getScaledHeight() >= 20 && obj.getScaledWidth() >= 20)) {
                        (obj as IText).set('fontSize', obj['fontSize'] + delta);
                        this.activeObject.syncForm();
                    }
                } else {
                    obj.set('scaleX', (e.rect.width / this.zoom.getScaleFactor()) / obj.width);
                    // TODO: line shape has 0 height for some reason
                    if (obj.height) {
                        obj.set('scaleY', (e.rect.height / this.zoom.getScaleFactor()) / obj.height);
                    }
                }
                this.reposition();
                this.canvasState.fabric.requestRenderAll();
            }
        });
    }

    private enableTextEditing() {
        const obj = this.activeObject.get() as IText;
        if (obj && obj.type === 'i-text') {
            this.hide();
            obj.enterEditing();
            obj.hiddenTextarea.focus();
        }
    }

    private getUserConfigForActiveObject() {
        const obj = this.activeObject.get();
        const userConfig = (this.config.getAll().pixie as PixieConfig).objectControls || {};
        const typeConfig = {
            ...userConfig.global,
            ...(userConfig[obj.name])
        };
        this.userConfig$.next(typeConfig);
        this.interactable.setConfig({
            maintainInitialAspectRatio: !typeConfig.unlockAspectRatio
        });
    }
}
