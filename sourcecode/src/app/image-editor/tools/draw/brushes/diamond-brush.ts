import {fabric} from 'fabric';

export const DiamondBrush = (canvas: fabric.Canvas) => {
    const diamondBrush = new (fabric.PatternBrush as any)(canvas);

    diamondBrush.getPatternSrc = function() {
        const squareWidth = this.width / 2, squareDistance = 5;
        const patternCanvas = document.createElement('canvas');

        const rect = new fabric.Rect({
            width: squareWidth,
            height: squareWidth,
            angle: 45,
            fill: this.color
        });

        const canvasWidth = rect.getBoundingRect().width;

        patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
        rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

        const ctx = patternCanvas.getContext('2d');
        rect.render(ctx);

        return patternCanvas;
    };

    return diamondBrush;
};
