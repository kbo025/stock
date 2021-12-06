import {Component, ElementRef, Input, OnInit} from '@angular/core';

export type CornerHandlePosition = 'top-left'|'top-right'|'bottom-left'|'bottom-right';

@Component({
    selector: 'corner-handle',
    templateUrl: './corner-handle.component.html',
    styleUrls: ['./corner-handle.component.scss'],
})
export class CornerHandleComponent implements OnInit {
    @Input('position') set position(value: CornerHandlePosition) {
        this.el.nativeElement.classList.add(value);
    }

    constructor(private el: ElementRef<HTMLDivElement>) {}

    ngOnInit(): void {
    }

}
