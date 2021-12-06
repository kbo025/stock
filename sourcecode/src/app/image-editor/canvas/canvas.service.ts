import {Injectable} from '@angular/core';
import {fabric} from 'fabric';
import {IEvent, Image, Image as FImage, Object, Rect} from 'fabric/fabric-impl';
import {CanvasPanService} from './canvas-pan.service';
import {ActiveObjectService} from './active-object/active-object.service';
import {CanvasZoomService} from './canvas-zoom.service';
import {Settings} from 'common/core/config/settings.service';
import {staticObjectConfig} from '../objects/static-object-config';
import {CanvasStateService, ContentLoadingStateName} from './canvas-state.service';
import {ObjectNames} from '../objects/object-names.enum';

interface TransformHelper extends Rect {
    data: {
        freeAngle: number;
        fixedAngle: number;
    };
}

@Injectable()
export class CanvasService {
    private readonly minWidth: number = 50;
    private readonly minHeight: number = 50;
    public transformHelper: TransformHelper;

    constructor(
        public pan: CanvasPanService,
        public zoom: CanvasZoomService,
        public state: CanvasStateService,
        public activeObject: ActiveObjectService,
        private config: Settings,
    ) {}

    public render() {
        this.state.fabric.requestRenderAll();
    }

    public fabric(): fabric.Canvas {
        return this.state.fabric;
    }

    public getObjectById(id: string): Object|null {
        return this.state.fabric.getObjects().find(obj => {
            return obj.data && obj.data.id === id;
        });
    }

    public resize(width: number, height: number, applyZoom = false, resizeHelper = true) {
        this.state.fabric.setWidth(width * (applyZoom ? this.zoom.getScaleFactor() : 1));
        this.state.fabric.setHeight(height * (applyZoom ? this.zoom.getScaleFactor() : 1));
        this.state.original.width = width;
        this.state.original.height = height;
        this.state.sizeChanged$.next({width, height});
        if (resizeHelper) {
            this.transformHelper.set({
                width: this.state.original.width,
                height: this.state.original.height,
                scaleX: 1,
                scaleY: 1,
            });
            this.transformHelper.center();
        }
    }

    public loadMainImage(url: string, clearCanvas = true, loadStateName: ContentLoadingStateName = 'mainImage'): Promise<Image> {
        return new Promise(resolve => {
            this.state.contentLoadingState$.next({name: loadStateName, loading: true});
            this.loadImage(url).then(img => {
                if ( ! clearCanvas) {
                    const bgImage = this.getMainImage();
                    this.fabric().remove(bgImage);
                } else {
                    this.clear();
                }
                img.set(staticObjectConfig);
                img.name = ObjectNames.mainImage.name;
                this.state.fabric.add(img);
                this.resize(img.width, img.height);
                img.center();
                img.setCoords();
                this.zoom.fitToScreen();
                this.state.contentLoadingState$.next({name: loadStateName, loading: false});
                resolve(img);
                const callback = this.config.get('pixie.onMainImageLoaded');
                if (callback) callback(img);
            });
        });
    }

    public loadImage(data: string): Promise<Image> {
        return new Promise(resolve => {
            fabric.util.loadImage(
                data,
                img => resolve(new fabric.Image(img)),
                null,
                this.config.get('pixie.crossOrigin')
            );
        });
    }

    public openNew(width: number, height: number): Promise<{width: number, height: number}> {
        width = width < this.minWidth ? this.minWidth : width;
        height = height < this.minHeight ? this.minHeight : height;

        this.clear();
        this.resize(width, height);

        return new Promise(resolve => {
            setTimeout(() => {
                this.zoom.fitToScreen();
                this.state.contentLoadingState$.next({name: 'blank', loading: false});
                resolve({width, height});
            });
        });
    }

    /**
     * Open image at given url in canvas.
     */
    public openImage(url, fitToScreen = true): Promise<Image> {
        return new Promise(resolve => {
            this.loadImage(url).then(object => {
                if ( ! object) return;

                object.name = ObjectNames.image.name;
                object.opacity = 0;

                // use either main image or canvas dimensions as outer boundaries for scaling new image
                const maxWidth  = this.state.original.width,
                    maxHeight = this.state.original.height;

                // if image is wider or higher then the current canvas, we'll scale it down
                if (fitToScreen && (object.width >= maxWidth || object.height >= maxHeight)) {

                    // calc new image dimensions (main image height - 10% and width - 10%)
                    const newWidth  = maxWidth - (0.1 * maxWidth),
                        newHeight = maxHeight - (0.1 * maxHeight),
                        scale     = 1 / (Math.min(newHeight / object.getScaledHeight(), newWidth / object.getScaledWidth()));

                    // scale newly uploaded image to the above dimensions
                    object.scaleX = object.scaleX * (1 / scale);
                    object.scaleY = object.scaleY * (1 / scale);
                }

                // center and render newly uploaded image on the canvas
                this.state.fabric.add(object);
                object.viewportCenter();
                object.setCoords();
                this.render();
                this.zoom.fitToScreen();

                object.animate('opacity', '1', {
                    duration: 425,
                    onChange: () => {
                        this.render();
                    },
                    onComplete: () => {
                        resolve(object);
                    }
                });
            });
        });
    }

    /**
     * Get main image object, if it exists.
     */
    public getMainImage(): FImage {
        return this.state.fabric.getObjects()
            .find(obj => obj.name === ObjectNames.mainImage.name) as FImage;
    }

    /**
     * Listen to specified canvas event.
     */
    public on(eventName: string, handler: (e: IEvent) => void) {
        this.state.on(eventName, handler);
    }

    public clear() {
        this.fabric().clear();
        if ( ! this.transformHelper) {
            this.transformHelper = new fabric.Rect({
                ...staticObjectConfig,
                name: 'transformHelper',
                visible: false,
                width: this.state.original.width,
                height: this.state.original.height,
                data: {
                    pixieInternal: true,
                    freeAngle: 0,
                    fixedAngle: 0,
                }
            }) as TransformHelper;
        }
        this.fabric().add(this.transformHelper);
    }
}
