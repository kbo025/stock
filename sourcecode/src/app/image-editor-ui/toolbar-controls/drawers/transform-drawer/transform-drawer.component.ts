import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    NgZone,
    ViewChild
} from '@angular/core';
import {TransformToolService} from '../../../../image-editor/tools/transform/transform-tool.service';
import {Store} from '@ngxs/store';
import {MarkAsDirty} from '../../../state/transform/transform.actions';

@Component({
    selector: 'transform-drawer',
    templateUrl: './transform-drawer.component.html',
    styleUrls: ['./transform-drawer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'controls-drawer'},
})
export class TransformDrawerComponent implements AfterViewInit {
    @ViewChild('angleSliderContainer') angleSliderContainer: ElementRef<HTMLElement>;
    @ViewChild('angleSlider') angleSlider: ElementRef<HTMLElement>;

    private prevDeltaX = 0;
    private deltaSinceLastMove = 0;
    public numberOfDots = new Array(80);

    constructor(
        private store: Store,
        public transformTool: TransformToolService,
        private zone: NgZone,
    ) {}

    ngAfterViewInit() {
        this.bindSliderHammerEvents();
    }

    private bindSliderHammerEvents() {
        let hammer: HammerManager;
        this.zone.runOutsideAngular(() => {
            hammer = new Hammer.Manager(this.angleSlider.nativeElement);
            const pan = new Hammer.Pan({threshold: 0});
            hammer.add([pan]);

            hammer.on('panstart', (e: HammerInput) => {
                this.prevDeltaX = 0;
                this.angleSlider.nativeElement.classList.add('moving');
            });
            hammer.on('panmove', (e: HammerInput) => {
                const delta = e.deltaX - this.prevDeltaX;
                const newAngle = this.transformTool.currentFreeAngle$.value + delta;
                const newAngleValid = newAngle >= -45 && newAngle <= 45;
                this.deltaSinceLastMove += Math.abs(delta);
                if (newAngleValid) {
                    // rotate every 4px only, it's a bit too fast otherwise
                    if (this.deltaSinceLastMove >= 4) {
                        this.zone.run(() => this.rotateFree(newAngle));
                        this.deltaSinceLastMove = 0;
                        this.angleSlider.nativeElement.style.transform =  `translateX(${newAngle * 4}px)`;
                    }
                }
                this.prevDeltaX = e.deltaX;

            });
            hammer.on('panend', () => {
                this.angleSlider.nativeElement.classList.remove('moving');
            });
        });
    }

    public rotateLeft() {
        this.transformTool.rotateLeft();
        this.markAsDirty();
    }

    public rotateRight() {
        this.transformTool.rotateRight();
        this.markAsDirty();
    }

    public rotateFree(value: number) {
        this.transformTool.rotateFree(value);
        this.markAsDirty();
    }

    public flipHorizontal() {
        this.transformTool.flip('horizontal');
        this.markAsDirty();
    }

    public flipVertical() {
        this.transformTool.flip('vertical');
        this.markAsDirty();
    }

    public markAsDirty() {
        this.store.dispatch(new MarkAsDirty());
    }
}
