export interface CSGOMarketConfig {
    readonly endpoint: string;
    readonly secretKey: string;
    readonly botId?: number;
    readonly options?: CSGOMarketOptions;
    readonly socket?: SocketConfig;
}
export declare type Channel = 'newitems_go' | 'history_go' | 'additem_go' | 'itemout_new_go' | 'itemstatus_go' | 'money' | 'webnotify';
export declare type Channels = {
    [channel in 'NEW_ITEMS_GO' | 'HISTORY_GO' | 'ADDITEM_GO' | 'ITEMOUT_NEW_GO' | 'ITEMSTATUS_GO' | 'MONEY' | 'WEBNOTIFY']: Channel;
};
export interface SocketConfig {
    readonly endpoint: string;
    readonly options?: {
        readonly reconnectTimeout: number;
    };
}
export interface SocketState {
    connected: boolean;
    authed: boolean;
}
export interface TMSocketData {
    readonly type: Channel;
    readonly data: string;
}
export interface CSGOMarketOptions {
    readonly ratelimit: boolean;
}
export declare type Currency = 'RUB' | 'EUR' | 'USD';
export declare type Currencies = {
    [currency in Currency]: Currency;
};
export interface BaseResponse {
    readonly success: boolean;
}
export interface PricesResponse extends BaseResponse {
    readonly time: number;
    readonly currency: Currency;
    readonly items: PriceItem[];
}
export interface PriceItem {
    readonly market_hash_name: string;
    readonly volume: string;
    readonly price: string;
}
export interface PriceInstancesResponse extends BaseResponse {
    readonly time: number;
    readonly currency: Currency;
    readonly items: {
        [key: string]: PriceInstanceItem;
    };
}
export interface PriceInstanceItem {
    readonly price: string;
    readonly buy_order: number;
    readonly avg_price: string | null;
    readonly popularity_7d: string | null;
    readonly market_hash_name: string;
    readonly ru_name: string;
    readonly ru_rarity: string;
    readonly ru_quality: string;
    readonly text_color: string;
    readonly bg_color: string;
}
export interface BuyParamsBase {
    readonly price?: number;
    readonly custom_id?: string;
}
export interface BuyParamsHash extends BuyParamsBase {
    readonly hash_name: string;
}
export interface BuyParamsId extends BuyParamsBase {
    readonly id: string | number;
}
export interface BuyForParams {
    readonly partner: string;
    readonly token: string;
}
export interface HistoryParams {
    readonly date: string | number;
    readonly date_end?: number;
}
export interface HistoryResponse extends BaseResponse {
    readonly data: HistoryItem[];
}
export interface HistoryItem {
    readonly item_id: string;
    readonly market_hash_name: string;
    readonly class: string;
    readonly instance: string;
    readonly time: string;
    readonly event: string;
    readonly app: string;
    readonly stage: string;
    readonly for: string | null;
    readonly custom_id: string | null;
    readonly paid: string;
    readonly currency: Currency;
}
export interface SendMoneyParams {
    readonly amount: string | number;
    readonly userApiKey: string;
    readonly payPass: string | number;
}
export interface InventoryResponse extends BaseResponse {
    readonly items: InventoryItem;
}
export interface InventoryItem {
    readonly id: string;
    readonly classid: string;
    readonly instanceid: string;
    readonly market_hash_name: string;
    readonly market_price: number;
    readonly tradable: number;
}
export interface TradeTakeResponse extends BaseResponse {
    readonly trade: string;
    readonly nick: string;
    readonly botid: string;
    readonly profile: string;
    readonly secret: string;
    readonly items: string[];
}
export interface TradeGiveResponse extends BaseResponse {
    readonly trade: string;
    readonly nick: string;
    readonly botid: string;
    readonly profile: string;
    readonly secret: string;
    readonly items: string[];
}
export interface BalanceResponse extends BaseResponse {
    readonly money: number;
    readonly currency: Currency;
}
export interface ItemResponse extends BaseResponse {
    readonly items: Item[];
}
export interface Item {
    readonly item_id: string;
    readonly assetid: string;
    readonly classid: string;
    readonly instanceid: string;
    readonly read_instance: string;
    readonly market_hash_name: string;
    readonly position: number;
    readonly price: number;
    readonly currency: Currency;
    readonly status: string;
    readonly live_time: number;
    readonly left: number | string | null;
}
export interface TradeResponse<T> extends BaseResponse {
    readonly trades: T;
}
export interface Trade {
    readonly dir: string;
    readonly trade_id: string;
    readonly bot_id: string;
    readonly timestamp: number;
}
export interface TradeExtended extends Trade {
    readonly secret: string;
    readonly nik: string;
    readonly list_item_id: {
        [key: string]: {
            readonly id: string;
            readonly assetid: string;
            readonly classid: string;
            readonly instanceid: string;
        };
    };
}
export interface BuyForResponse extends BaseResponse {
    readonly id: string;
    readonly price: string;
}
export interface MySteamIdResponse extends BaseResponse {
    readonly steamid32: string;
    readonly steamid64: string;
}
export interface BuyInfoByCustomId extends BaseResponse {
    readonly data: BuyInfo;
}
export interface BuyListInfoByCustomId extends BaseResponse {
    readonly data: {
        [key: string]: BuyInfo;
    };
}
export interface BuyInfo {
    readonly item_id: string;
    readonly market_hash_name: string;
    readonly classid: string;
    readonly instance: string;
    readonly time: string;
    readonly send_until: any;
    readonly stage: string;
    readonly paid: number;
    readonly causer: any;
    readonly currency: Currency;
    readonly for: string;
    readonly trade_id: any;
}
export interface SendMoneyResponse extends BaseResponse {
    readonly from: number;
    readonly to: number;
    readonly amount: number;
}
export interface SearchItemByHashNameResponse extends BaseResponse {
    readonly currency: Currency;
    readonly data: {
        readonly market_hash_name: string;
        readonly price: number;
        readonly class: number;
        readonly instance: number;
        readonly count: number;
    }[];
}
export interface SearchItemBaseResponse<T> extends BaseResponse {
    readonly currency: Currency;
    readonly data: T;
}
export interface ItemHash {
    readonly id: number;
    readonly market_hash_name: string;
    readonly price: number;
    readonly class: number;
    readonly instance: number;
    readonly extra: {
        readonly [key: string]: any;
    };
}
export interface ItemInfo {
    readonly max: number;
    readonly min: number;
    readonly average: number;
    readonly history: [number, number][];
}
