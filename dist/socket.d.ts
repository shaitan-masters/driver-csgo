/// <reference types="node" />
import WS from 'ws';
import { SocketConfig, SocketState, TMSocketData } from './types';
import { Events } from '@osmium/events';
export declare class TMSocket extends Events {
    protected readonly config: SocketConfig;
    protected state: SocketState;
    protected timers: {
        timeouts: NodeJS.Timeout[];
        intervals: NodeJS.Timer[];
    };
    protected socket: WS;
    constructor(config: SocketConfig);
    protected connectChannels(): void;
    protected clearTimers(): void;
    protected parseMessage(data: WS.Data): TMSocketData;
    protected connect(): void;
    protected pingPong(): void;
}
