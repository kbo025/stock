import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    ViewChild
} from '@angular/core';
import {delay, take} from 'rxjs/operators';
import {ObjectControlsService} from './object-controls.service';
import {CanvasStateService} from '../../image-editor/canvas/canvas-state.service';
import {Observable} from 'rxjs';
import {EditorState} from '../../image-editor/state/editor-state';
import {Select} from '@ngxs/store';

@Component({
    selector: 'object-controls',
    templateUrl: './object-controls.component.html',
    styleUrls: ['./object-controls.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectControlsComponent implements AfterViewInit {
    @ViewChild('floatingControls', {read: ElementRef}) floatingControls: ElementRef<HTMLDivElement>;
    @ViewChild('boundingBox') boundingBox: ElementRef<HTMLDivElement>;
    @Select(EditorState.editingText) editingText$: Observable<boolean>;

    constructor(
        private el: ElementRef<HTMLElement>,
        private canvasState: CanvasStateService,
        public objectControls: ObjectControlsService,
    ) {}

    ngAfterViewInit() {
        this.canvasState.loaded
            .pipe(take(1), delay(0))
            .subscribe(() => {
                this.objectControls.init(
                    this.el.nativeElement,
                    this.boundingBox.nativeElement,
                    this.floatingControls.nativeElement
                );

                this.editingText$.subscribe(isEditing => {
                    if (isEditing) {
                        this.objectControls.hide();
                    } else {
                        this.objectControls.show();
                    }
                });
            });
    }
}
