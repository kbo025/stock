import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    QueryList,
    ViewChildren,
    ViewEncapsulation
} from '@angular/core';
import {Settings} from '@common/core/config/settings.service';
import {CropZoneService} from '../../../../image-editor/tools/crop/crop-zone.service';
import {CanvasStateService} from '../../../../image-editor/canvas/canvas-state.service';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {ActiveFrameService} from '../../../../image-editor/tools/frame/active-frame.service';
import {ActiveObjectService} from '../../../../image-editor/canvas/active-object/active-object.service';
import {skip} from 'rxjs/operators';
import {Interactable} from '../../../utils/interactable';

@Component({
    selector: 'crop-drawer',
    templateUrl: './crop-drawer.component.html',
    styleUrls: ['./crop-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'controls-drawer'},
})
export class CropDrawerComponent implements AfterViewInit, OnDestroy {
    @ViewChildren('ratioPreview') ratioPreviews: QueryList<ElementRef>;

    public presets: {ratio: string, name: string}[];
    public cropzoneHeight: number;
    public cropzoneWidth: number;
    private subscriptions: Subscription[] = [];

    public sizeForm = new FormGroup({
        width: new FormControl(0),
        height: new FormControl(0)
    });

    constructor(
        public cropZone: CropZoneService,
        public config: Settings,
        public canvasState: CanvasStateService,
        private activeFrame: ActiveFrameService,
        private activeObject: ActiveObjectService,
        private cd: ChangeDetectorRef,
    ) {
        this.presets = this.config.get('pixie.tools.crop.presets');
    }

    ngAfterViewInit() {
        this.activeFrame.hide();
        this.ratioPreviews.forEach(el => {
            const ratio = el.nativeElement.dataset.ratio;
            if (ratio) {
                const adjusted = Interactable.calculateNewSizeFromAspectRatio(el.nativeElement.dataset.ratio, 40, 30);
                el.nativeElement.style.width = adjusted.width + 'px';
                el.nativeElement.style.height = adjusted.height + 'px';
            }
        });
        this.activeObject.deselect();
        this.cropZone.visible$.next(true);
        const sub1 = this.cropZone.currentRectChanged$.subscribe(() => {
            this.sizeForm.patchValue(this.cropZone.getSize());
        });
        this.subscriptions.push(sub1);

        // update if crop config changes after initial load
        const sub2 = this.config.all$().pipe(skip((1))).subscribe(() => {
            this.presets = this.config.get('pixie.tools.crop.presets');
            if (this.cropZone.aspectRatioString$.value !== this.config.get('pixie.tools.crop.defaultRatio')) {
                this.applyAspectRatio(this.config.get('pixie.tools.crop.defaultRatio'));
            }
            this.cd.markForCheck();
        });
        this.subscriptions.push(sub2);
    }

    ngOnDestroy() {
        this.activeFrame.show();
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    public applyAspectRatio(aspectRatio: string) {
        this.cropZone.reset(aspectRatio);
    }

    public resizeCropzone() {
        this.cropZone.resize(this.sizeForm.get('width').value, this.sizeForm.get('height').value);
    }
}
