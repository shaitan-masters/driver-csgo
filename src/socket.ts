import WS from 'ws';
import { CHANNELS } from './constants';
import {
    SocketConfig,
    SocketState,
    TMSocketData,
} from './types';
import { Events } from '@osmium/events';


export class TMSocket extends Events {

    protected readonly config: SocketConfig;
    protected state: SocketState = { connected: false, authed: false };
    protected timers: { timeouts: NodeJS.Timeout[], intervals: NodeJS.Timer[] } = { timeouts: [], intervals: [] };
    protected socket: WS;

    constructor(config: SocketConfig) {
        super();
        this.config = {
            ...config,
            ...!config.options && {
                options: {
                    reconnectTimeout: 1000 * 60 * 15
                }
            }
        };

        this.connect();
    }

    protected connectChannels(): void {
        this.socket.send(CHANNELS.HISTORY_GO);
        this.socket.send(CHANNELS.NEW_ITEMS_GO);
    }

    protected clearTimers(): void {
        this.timers.intervals.forEach(clearInterval);
        this.timers.timeouts.forEach(clearTimeout);
        this.timers = { intervals: [], timeouts: [] };
    }

    protected parseMessage(data: WS.Data): TMSocketData {
        return JSON.parse(data.toString());
    }

    protected connect(): void {
        this.state = { connected: false, authed: false };
        this.clearTimers();

        this.socket = new WS(this.config.endpoint);
        this.socket.on('open', (): void => {
            this.state.connected = true;

            this.pingPong();
            this.connectChannels();
        });

        this.socket.on('message', (data: WS.Data): void => {
            const parsed = this.parseMessage(data);

            switch (parsed.type) {
                case CHANNELS.HISTORY_GO:
                    this.emit(CHANNELS.HISTORY_GO, parsed.data);
                    return;
                case CHANNELS.NEW_ITEMS_GO:
                    this.emit(CHANNELS.NEW_ITEMS_GO, parsed.data);
                    return;
                case CHANNELS.ADDITEM_GO:
                    this.emit(CHANNELS.ADDITEM_GO, parsed.data);
                    return;
                case CHANNELS.ITEMOUT_NEW_GO:
                    this.emit(CHANNELS.ITEMOUT_NEW_GO, parsed.data);
                    return;
                case CHANNELS.MONEY:
                    this.emit(CHANNELS.MONEY, parsed.data);
                    return
                case CHANNELS.ITEMSTATUS_GO:
                    this.emit(CHANNELS.ITEMSTATUS_GO, parsed.data);
                    return;
                default:
                    return;
            }
        });

        this.socket.on('close', (): void => { this.connect(); });

        const timeout = setTimeout((): void => {
            this.connect();
        }, this.config.options?.reconnectTimeout);

        this.timers.timeouts.push(timeout);
    }

    protected pingPong(): void {
        this.socket.ping();

        const interval = setInterval((): void => {
            this.socket.ping();
        }, 1000 * 30);

        this.timers.intervals.push(interval);
    }
}
