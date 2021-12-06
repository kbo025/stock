import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    NgZone,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {CanvasService} from '../image-editor/canvas/canvas.service';
import {HistoryToolService} from '../image-editor/history/history-tool.service';
import {asyncScheduler, fromEvent, interval, Observable} from 'rxjs';
import {
    delayWhen,
    distinctUntilChanged,
    filter,
    map,
    pairwise,
    take,
    throttleTime
} from 'rxjs/operators';
import {EditorControlsService} from './toolbar-controls/editor-controls.service';
import {FloatingPanelsService} from './toolbar-controls/floating-panels.service';
import {CanvasKeybindsService} from '../image-editor/canvas/canvas-keybinds.service';
import {ActiveObjectService} from '../image-editor/canvas/active-object/active-object.service';
import {Settings} from '@common/core/config/settings.service';
import {Select, Store} from '@ngxs/store';
import {
    ObjectDeselected,
    ObjectSelected,
    TextEditingToggled
} from '../image-editor/state/editor-state-actions';
import {EditorState} from '../image-editor/state/editor-state';
import {NavPosition} from '../image-editor/enums/control-positions.enum';
import {BreakpointsService} from '@common/core/ui/breakpoints.service';
import {Localization} from '@common/core/types/models/Localization';
import {Translations} from '@common/core/translations/translations.service';
import {EditorMode} from '../image-editor/enums/editor-mode.enum';
import {UploadedFile} from '@common/uploads/uploaded-file';
import {UploadInputTypes} from '@common/uploads/upload-input-config';
import {ImportToolService} from '../image-editor/tools/import/import-tool.service';
import {fabric} from 'fabric';
import {normalizeObjectProps} from '../image-editor/utils/normalize-object-props';
import {randomString} from '@common/core/utils/random-string';
import {CanvasZoomService} from '../image-editor/canvas/canvas-zoom.service';
import {CanvasPanService} from '../image-editor/canvas/canvas-pan.service';
import {ImageEditorService} from '../image-editor/image-editor.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {
    ContentLoadingState,
    ContentLoadingStateDisplayName
} from '../image-editor/canvas/canvas-state.service';
import {CropZoneService} from '../image-editor/tools/crop/crop-zone.service';
import {CropzoneComponent} from './cropzone/cropzone.component';
import {ObjectControlsService} from './object-controls/object-controls.service';
import {ActiveFrameService} from '../image-editor/tools/frame/active-frame.service';
import {FrameToolService} from '../image-editor/tools/frame/frame-tool.service';
import {DEFAULT_OBJECT_CONFIG} from '../image-editor/objects/default-object-config';

@Component({
    selector: 'image-editor',
    templateUrl: './image-editor.component.html',
    styleUrls: ['./image-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('imageLoadingAnimation', [
            transition(':enter', [
                style({transform: 'translateY(60%)'}),
                animate('325ms cubic-bezier(.4,0,.2,1)', style({ opacity: 1, transform: 'translateY(0%)' })),
            ]),
            transition(':leave', [
                animate('325ms cubic-bezier(.4,0,.2,1)', style({ opacity: 0, transform: 'translateY(-60%)' }))
            ])
        ]),
        trigger('fadeIn', [
            state('true', style({opacity: 1, boxShadow: '*'})),
            state('false', style({opacity: 0, boxShadow: 'none'})),
            transition('* => true', animate('325ms ease-in')),
        ])
    ]
})
export class ImageEditorComponent implements AfterViewInit {
    @Select(EditorState.navPosition) navPosition$: Observable<NavPosition>;
    @Select(EditorState.activeObjId) activeObjId$: Observable<string>;
    @Select(EditorState.toolbarHidden) toolbarHidden$: Observable<boolean>;
    @ViewChild('canvasWrapper') canvasWrapper: ElementRef;
    @ViewChild('canvasMaskWrapper') canvasMaskWrapper: ElementRef;
    @ViewChild(CropzoneComponent) cropComp: CropzoneComponent;

    @HostBinding('class.nav-hidden') get navHidden() {
        return this.store.selectSnapshot(EditorState.navPosition) === NavPosition.NONE;
    }

    public dropzoneConfig = {types: [UploadInputTypes.image]};
    public loadState: {canvasVisible: boolean, messageVisible: boolean, message: string};

    constructor(
        public canvas: CanvasService,
        private history: HistoryToolService,
        public controls: EditorControlsService,
        public breakpoints: BreakpointsService,
        private floatingPanels: FloatingPanelsService,
        private canvasKeybinds: CanvasKeybindsService,
        private el: ElementRef<HTMLElement>,
        private activeObject: ActiveObjectService,
        public config: Settings,
        private store: Store,
        private i18n: Translations,
        private importTool: ImportToolService,
        private zoom: CanvasZoomService,
        private pan: CanvasPanService,
        private imageEditor: ImageEditorService,
        private cd: ChangeDetectorRef,
        public cropzone: CropZoneService,
        private zone: NgZone,
        private objectControls: ObjectControlsService,
        private frame: FrameToolService,
    ) {
        this.resetLoadingState();
    }

    ngAfterViewInit() {
        this.canvas.state.wrapperEl = this.canvasWrapper.nativeElement;
        this.canvas.state.maskWrapperEl = this.canvasMaskWrapper.nativeElement;

        // update editor language on settings change
        this.config.all$()
            .pipe(
                map(config => config.pixie.languages.active),
                distinctUntilChanged(),
            ).subscribe(() => {
                this.setLocalization();
            });

        this.bindToLoadingState();

        // reset loading state when editor is hidden so animation
        // is played again when editor is shown again
        this.store.select(EditorState.visible)
            .pipe(filter(v => !v))
            .subscribe(() => {
                this.resetLoadingState();
            });

        this.canvas.state.cacheWrapperRects();
        this.initFabric().then(() => {
            this.activeObject.init();
            this.canvasKeybinds.init();
            this.handleCanvasSizeChange();
            this.fitCanvasToScreenOnResize();
            this.closePanelsOnObjectDelete();
            this.updateHistoryOnObjectModification();
            this.bindToClickOutsideCanvas();
            this.ignoreMobileKeyboard();
            this.handleTextEditing();
            this.canvasMaskWrapper.nativeElement.classList.remove('not-loaded');
        });
    }

    private initFabric(): Promise<any> {
        const canvasEl = document.querySelector('#pixie-canvas') as HTMLCanvasElement;
        this.zone.runOutsideAngular(() => {
            this.canvas.state.fabric = new fabric.Canvas(canvasEl);
        });

        this.canvas.state.fabric.preserveObjectStacking = true;
        this.canvas.state.fabric.selection = false;
        this.canvas.state.fabric.renderOnAddRemove = false;

        const textureSize = this.config.get('pixie.textureSize');
        if (textureSize) fabric.textureSize = textureSize;

        const objectDefaults = normalizeObjectProps({
            ...this.config.get('pixie.objectDefaults.global'),
            ...DEFAULT_OBJECT_CONFIG,
        });

        for (const key in objectDefaults) {
            fabric.Object.prototype[key] = objectDefaults[key];
        }

        // add ID to all objects
        this.canvas.state.on('object:added', e => {
            if (e.target.data && e.target.data.id) return;
            if ( ! e.target.data) e.target.data = {};
            e.target.data.id = randomString(10);
        });

        // remove native fabric object controls
        const objectControls = fabric.Object.prototype['controls'] as any;
        Object.keys(objectControls).forEach(key => {
            delete objectControls[key];
        });

        this.pan.init();
        this.zoom.init();

        this.handleObjectSelection();
        return this.imageEditor.loadInitialContent();
    }

    private closePanelsOnObjectDelete() {
        this.canvas.state.on('object:delete', () => this.controls.closeCurrentPanel());
    }

    /**
     * Replace current history item, so object position is
     * updated after object is scaled, moved or rotated.
     */
    private updateHistoryOnObjectModification() {
        this.canvas.state.on('object:modified', event => {
            if (!event.e || this.store.selectSnapshot(EditorState.dirty)) return;
            this.history.replaceCurrent();
        });
    }

    private handleTextEditing() {
        this.canvas.state.on('text:editing:entered', e => this.store.dispatch(new TextEditingToggled(true)));
        this.canvas.state.on('text:editing:exited', e => this.store.dispatch(new TextEditingToggled(false)));
    }

    private handleObjectSelection() {
        this.canvas.state.on('selection:created', e => this.onObjectSelection(e));
        this.canvas.state.on('selection:updated', e => this.onObjectSelection(e));

        this.canvas.state.on('selection:cleared', fabricEvent => {
            this.store.dispatch(new ObjectDeselected(fabricEvent.e != null));
        });
    }

    public onObjectSelection(fabricEvent) {
        this.store.dispatch(new ObjectSelected(
            fabricEvent.target.name, fabricEvent.e != null
        ));
    }

    private fitCanvasToScreenOnResize() {
        this.zone.runOutsideAngular(() => {
            fromEvent(window, 'resize')
                .pipe(throttleTime(200, asyncScheduler, {leading: true}), distinctUntilChanged())
                .subscribe(() => {
                    this.canvas.zoom.fitToScreen();
                    if (this.cropzone.visible$.value) {
                        this.cropzone.reset();
                    }
                });
        });
    }

    private handleCanvasSizeChange() {
       this.canvas.state.sizeChanged$
           .subscribe(e => {
               this.canvas.state.cacheWrapperRects();
               this.objectControls.reposition();
               if ( ! e.fromZoom) {
                   this.frame.resize();
                   requestAnimationFrame(() => {
                       this.canvas.transformHelper.set({
                           width: e.width,
                           height: e.height,
                       });
                       this.canvas.transformHelper.viewportCenter();
                   });
               }
           });
    }

    private setLocalization() {
        const active = this.config.get('pixie.languages.active', 'default');
        if (active === 'default') return;

        if ( ! this.config.get('i18n.enable')) {
            this.config.set('i18n.enable', true);
        }

        const lines = this.config.get(`pixie.languages.custom.${active}`);
        this.i18n.setLocalization({
            name: active,
            model: new Localization({name: active}),
            lines: lines,
        });
    }

    private bindToClickOutsideCanvas() {
        this.canvas.state.wrapperEl.addEventListener('click', e => {
            if (e.target === e.currentTarget) {
                this.activeObject.deselect();
            }
        });
    }

    private ignoreMobileKeyboard() {
        if (this.config.get('pixie.ui.ignoreMobileKeyboard')) {
            this.breakpoints.isMobile$.pipe(filter(result => !!result), take(1))
                .subscribe(() => {
                    let minHeight = this.el.nativeElement.offsetHeight;
                    if (this.config.get('pixie.ui.mode') === EditorMode.OVERLAY) {
                        minHeight -= 40; // overlay mode gutter
                    }
                    this.el.nativeElement.style.minHeight = minHeight + 'px';
                });
        }
    }

    public onFileDropped(files: UploadedFile[]) {
        const openAsBackground = this.config.get('pixie.tools.import.openDroppedImageAsBackground');
        this.importTool.loadFile(files[0], {openAsBackground}).then(image => {
            image && this.activeObject.select(image);
        });
    }

    private bindToLoadingState() {
        // delay loading emits by 500 ms so loading message is shown for at least 500ms
        this.canvas.state.contentLoadingState$.pipe(
            map((value: ContentLoadingState & {date: number}) => {
                value.date = Date.now();
                return value;
            }),
            pairwise(),
            delayWhen(([previousValue, currentValue]) => {
                const ms = currentValue.date - previousValue.date,
                    delay = 500 - ms || 0;
                return currentValue.name === 'overlayImage' || (!currentValue.loading && currentValue.name !== 'blank') ? interval(delay) : interval(0);
            })
        ).subscribe(values => {
            const s = values[1];
            this.loadState = {
                // keep canvas visible if loading overlay image
                canvasVisible: s.name === 'overlayImage' || !s.loading,
                // don't show loading message when creating blank canvas
                messageVisible: s.name !== 'blank' && s.loading,
                message: ContentLoadingStateDisplayName[s.name],
            };
            this.cd.markForCheck();
        });
    }

    private resetLoadingState() {
        this.loadState = {canvasVisible: false, messageVisible: false, message: null};
        this.canvas.state.contentLoadingState$.next({});
    }
}
