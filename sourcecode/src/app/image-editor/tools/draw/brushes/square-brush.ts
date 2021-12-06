import {fabric} from 'fabric';

export const SquareBrush = (canvas: fabric.Canvas) => {
    const squareBrush = new (fabric.PatternBrush as any)(canvas);

    squareBrush.getPatternSrc = function() {
        const squareWidth = 10, squareDistance = 2;

        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
        const ctx = patternCanvas.getContext('2d');

        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, squareWidth, squareWidth);

        return patternCanvas;
    };

    return squareBrush;
};
