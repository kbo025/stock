import {Injectable} from '@angular/core';
import {CanvasService} from '../../canvas/canvas.service';
import {MergeToolService} from '../merge/merge-tool.service';
import {RectSizeAndPos} from '../../../image-editor-ui/utils/rect-size-and-pos';
import {CanvasZoomService} from '../../canvas/canvas-zoom.service';
import {FrameToolService} from '../frame/frame-tool.service';

@Injectable()
export class CropToolService {
    constructor(
        private canvas: CanvasService,
        private mergeTool: MergeToolService,
        private zoom: CanvasZoomService,
        private frameTool: FrameToolService,
    ) {}

    public apply(box: RectSizeAndPos): Promise<any> {
        const activeFrame = this.frameTool.getActive();
        this.frameTool.activeFrame.hide();
        return this.mergeTool.apply().then(() => {
            this.canvas.resize(Math.round(box.width), Math.round(box.height), true);

            const img = this.canvas.getMainImage();
            img.cropX = Math.round(box.left);
            img.cropY = Math.round(box.top);
            img.width = Math.round(box.width);
            img.height = Math.round(box.height);
            img.viewportCenter();

            if (activeFrame) {
                this.frameTool.add(activeFrame.name);
            }
            this.zoom.fitToScreen();
            this.canvas.render();
        });
    }
}
