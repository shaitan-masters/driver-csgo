"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TMSocket = void 0;
const ws_1 = __importDefault(require("ws"));
const constants_1 = require("./constants");
const events_1 = require("@osmium/events");
class TMSocket extends events_1.Events {
    config;
    state = { connected: false, authed: false };
    timers = { timeouts: [], intervals: [] };
    socket;
    constructor(config) {
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
    connectChannels() {
        this.socket.send(constants_1.CHANNELS.HISTORY_GO);
        this.socket.send(constants_1.CHANNELS.NEW_ITEMS_GO);
    }
    clearTimers() {
        this.timers.intervals.forEach(clearInterval);
        this.timers.timeouts.forEach(clearTimeout);
        this.timers = { intervals: [], timeouts: [] };
    }
    parseMessage(data) {
        return JSON.parse(data.toString());
    }
    connect() {
        this.state = { connected: false, authed: false };
        this.clearTimers();
        this.socket = new ws_1.default(this.config.endpoint);
        this.socket.on('open', () => {
            this.state.connected = true;
            this.pingPong();
            this.connectChannels();
        });
        this.socket.on('message', (data) => {
            const parsed = this.parseMessage(data);
            switch (parsed.type) {
                case constants_1.CHANNELS.HISTORY_GO:
                    this.emit(constants_1.CHANNELS.HISTORY_GO, parsed.data);
                    return;
                case constants_1.CHANNELS.NEW_ITEMS_GO:
                    this.emit(constants_1.CHANNELS.NEW_ITEMS_GO, parsed.data);
                    return;
                case constants_1.CHANNELS.ADDITEM_GO:
                    this.emit(constants_1.CHANNELS.ADDITEM_GO, parsed.data);
                    return;
                case constants_1.CHANNELS.ITEMOUT_NEW_GO:
                    this.emit(constants_1.CHANNELS.ITEMOUT_NEW_GO, parsed.data);
                    return;
                case constants_1.CHANNELS.MONEY:
                    this.emit(constants_1.CHANNELS.MONEY, parsed.data);
                    return;
                case constants_1.CHANNELS.ITEMSTATUS_GO:
                    this.emit(constants_1.CHANNELS.ITEMSTATUS_GO, parsed.data);
                    return;
                default:
                    return;
            }
        });
        this.socket.on('close', () => { this.connect(); });
        const timeout = setTimeout(() => {
            this.connect();
        }, this.config.options?.reconnectTimeout);
        this.timers.timeouts.push(timeout);
    }
    pingPong() {
        this.socket.ping();
        const interval = setInterval(() => {
            this.socket.ping();
        }, 1000 * 30);
        this.timers.intervals.push(interval);
    }
}
exports.TMSocket = TMSocket;
//# sourceMappingURL=socket.js.map