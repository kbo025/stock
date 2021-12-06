import {
    IObjectOptions,
    IShadowOptions,
    IText,
    ITextOptions,
    Object,
    Shadow
} from 'fabric/fabric-impl';
import {defaultObjectProps} from '../objects/default-object-props';

interface FabricObjectProps extends Omit<ITextOptions, 'shadow'> {
    shadow: IShadowOptions;
}

export function getFabricObjectProps(obj: Object): Partial<FabricObjectProps> {
    if ( ! obj) return {};
    const shadow = obj.shadow as Shadow;

    const props = {
        fill: obj.fill,
        opacity: obj.opacity,
        backgroundColor: obj.backgroundColor,
        stroke: obj.stroke,
        strokeWidth: obj.strokeWidth,
    } as FabricObjectProps;

    if (shadow) {
        props.shadow = {
            color: shadow.color || defaultObjectProps.shadow.color,
            blur: shadow.blur || defaultObjectProps.shadow.blur,
            offsetX: shadow.offsetX || defaultObjectProps.shadow.offsetX,
            offsetY: shadow.offsetY || defaultObjectProps.shadow.offsetY,
        };
    }

    if (obj.type === 'i-text') {
        const text = obj as IText;
        props.textAlign = text.textAlign;
        props.underline = text.underline;
        props.linethrough = text.linethrough;
        props.fontStyle = text.fontStyle;
        props.fontFamily = text.fontFamily;
        props.fontWeight = text.fontWeight;
        props.fontSize = text.fontSize;
    }

    return props;
}
