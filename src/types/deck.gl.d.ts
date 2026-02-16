declare module '@deck.gl/mapbox' {
  import { LayersList } from '@deck.gl/core';
  export class MapboxOverlay {
    constructor(props: { layers?: LayersList; [key: string]: any });
    setProps(props: { layers?: LayersList; [key: string]: any }): void;
    finalize(): void;
  }
}

declare module '@deck.gl/core' {
  export class Layer<PropsT = {}> {
    constructor(props: PropsT);
    id: string;
    props: PropsT;
  }

  export type LayersList = (Layer<any> | null | false)[];

  export interface PickingInfo<DataT = any> {
    object: DataT;
    x: number;
    y: number;
    coordinate: [number, number];
    layer: Layer<any>;
    index: number;
    picked: boolean;
  }
  
  export interface CompositeLayer<PropsT = {}> extends Layer<PropsT> {}
}

declare module '@deck.gl/layers' {
  import { Layer } from '@deck.gl/core';

  export interface LayerProps<DataT = any> {
    id?: string;
    data?: DataT[] | Iterable<DataT> | { length: number } | any;
    visible?: boolean;
    opacity?: number;
    pickable?: boolean;
    onHover?: (info: any) => void;
    onClick?: (info: any) => void;
    beforeId?: string;
    // Common accessors
    getPosition?: (d: DataT) => number[];
    getColor?: (d: DataT) => number[];
    getFillColor?: ((d: DataT) => number[]) | number[];
    getLineColor?: ((d: DataT) => number[]) | number[];
    getLineWidth?: ((d: DataT) => number) | number;
    getRadius?: ((d: DataT) => number) | number;
    getIcon?: (d: DataT) => string | any;
    getText?: (d: DataT) => string;
    getSize?: ((d: DataT) => number) | number;
    getAngle?: ((d: DataT) => number) | number;
    getPixelOffset?: ((d: DataT) => number[]) | number[];
    // Common props
    stroked?: boolean;
    filled?: boolean;
    extruded?: boolean;
    wireframe?: boolean;
    lineWidthScale?: number;
    lineWidthMinPixels?: number;
    lineWidthMaxPixels?: number;
    radiusScale?: number;
    radiusMinPixels?: number;
    radiusMaxPixels?: number;
    sizeScale?: number;
    sizeMinPixels?: number;
    sizeMaxPixels?: number;
    iconAtlas?: any;
    iconMapping?: any;
    // Updates
    updateTriggers?: Record<string, any>;
    
    [key: string]: any;
  }

  export class GeoJsonLayer<DataT = any> extends Layer<LayerProps<DataT>> {}
  export class ScatterplotLayer<DataT = any> extends Layer<LayerProps<DataT>> {}
  export class PathLayer<DataT = any> extends Layer<LayerProps<DataT>> {
    constructor(props: LayerProps<DataT> & { getPath?: (d: DataT) => number[][] | any; getWidth?: (d: DataT) => number; widthMinPixels?: number; widthMaxPixels?: number; });
  }
  export class IconLayer<DataT = any> extends Layer<LayerProps<DataT>> {}
  export class TextLayer<DataT = any> extends Layer<LayerProps<DataT>> {}
  export class ArcLayer<DataT = any> extends Layer<LayerProps<DataT>> {}
}

declare module '@deck.gl/aggregation-layers' {
  import { Layer } from '@deck.gl/core';
  import { LayerProps } from '@deck.gl/layers';
  export class HeatmapLayer<DataT = any> extends Layer<LayerProps<DataT>> {}
}
