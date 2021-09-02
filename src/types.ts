import Panel from "./browser/panel";

export interface ControllerConfig {
    socket: {
        url: string
        port?: number | string
    }
    serial: {
        port: string
        baudRate?: number
    }
    mock: boolean,
    rate: number;
};

export interface ClientConfig {
    socket: {
        url: string
        port?: number | string
    }
    stage: StageConfig
};

export interface StageConfig {
    panels: Array<PanelConfig>,
    panelConfig?: PanelBounds
};

export interface PanelConfig {
    address: number,
    bounds: PanelBounds,
    offset: {
        x: number,
        y: number
    }
};

export interface PanelBounds {
    x: number,
    y: number
    width: number,
    height: number
}

export interface Dot {
    x: number,
    y: number,
    col: number,
    row: number,
    value: boolean,
    id: number,
    bufferId: number,
    panel: Panel
}