import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnDestroy,
    ViewChild
} from '@angular/core';
import {CropZoneService} from '../../image-editor/tools/crop/crop-zone.service';
import {Subscription} from 'rxjs';
import {Settings} from '@common/core/config/settings.service';

@Component({
    selector: 'cropzone',
    templateUrl: './cropzone.component.html',
    styleUrls: ['./cropzone.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CropzoneComponent implements AfterViewInit, OnDestroy {
    @ViewChild('innerZone') innerZone: ElementRef<HTMLDivElement>;
    @ViewChild('maskTop') maskTop: ElementRef<HTMLDivElement>;
    @ViewChild('maskLeft') maskLeft: ElementRef<HTMLDivElement>;
    @ViewChild('maskRight') maskRight: ElementRef<HTMLDivElement>;
    @ViewChild('maskBottom') maskBottom: ElementRef<HTMLDivElement>;
    @ViewChild('lineVer1') lineVer1: ElementRef<HTMLDivElement>;
    @ViewChild('lineVer2') lineVer2: ElementRef<HTMLDivElement>;
    @ViewChild('lineHor1') lineHor1: ElementRef<HTMLDivElement>;
    @ViewChild('lineHor2') lineHor2: ElementRef<HTMLDivElement>;
    private movingSub: Subscription;

    constructor(
        public cropZone: CropZoneService,
        private el: ElementRef<HTMLElement>,
        private config: Settings,
    ) {}

    ngAfterViewInit() {
        this.cropZone.els = {
            innerZone: this.innerZone.nativeElement,
            maskTop: this.maskTop.nativeElement,
            maskLeft: this.maskLeft.nativeElement,
            maskRight: this.maskRight.nativeElement,
            maskBottom: this.maskBottom.nativeElement,
            lineVer1: this.lineVer1.nativeElement,
            lineVer2: this.lineVer2.nativeElement,
            lineHor1: this.lineHor1.nativeElement,
            lineHor2: this.lineHor2.nativeElement,
        };
        this.cropZone.aspectRatio = this.config.get('pixie.tools.crop.defaultRatio');
        this.cropZone.init();
        this.movingSub = this.cropZone.moving$.subscribe(moving => {
            if (moving) {
                this.el.nativeElement.classList.add('moving');
            } else {
                this.el.nativeElement.classList.remove('moving');
            }
        });
    }

    ngOnDestroy() {
        this.movingSub.unsubscribe();
    }
}
