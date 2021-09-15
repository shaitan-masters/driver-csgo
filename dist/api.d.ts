import { AxiosInstance } from 'axios';
import { BalanceResponse, BaseResponse, BuyForParams, BuyForResponse, BuyInfoByCustomId, BuyListInfoByCustomId, BuyParamsHash, BuyParamsId, CSGOMarketConfig, Currency, HistoryParams, HistoryResponse, InventoryItem, ItemHash, ItemInfo, ItemResponse, MySteamIdResponse, PriceInstancesResponse, PricesResponse, SearchItemBaseResponse, SearchItemByHashNameResponse, SendMoneyParams, SendMoneyResponse, Trade, TradeExtended, TradeResponse, TradeTakeResponse } from './types';
import { TMSocket } from './socket';
export declare class TMApi {
    protected readonly config: CSGOMarketConfig;
    protected readonly http: AxiosInstance;
    readonly socket?: TMSocket;
    constructor(config: CSGOMarketConfig);
    protected configureAxios(axios: AxiosInstance): AxiosInstance;
    prices(currency?: Currency): Promise<PricesResponse>;
    pricesClassInstance(currency?: Currency): Promise<PriceInstancesResponse>;
    /**
     *
     * @param {boolean} withBotId
     * @returns {Promise<TradeTakeResponse>}
     */
    tradeTake(withBotId?: boolean): Promise<TradeTakeResponse>;
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=EUR%22%2C%0A%20%20%22success%22%3A%20true%0A%7D-,go-offline,-%D0%9C%D0%BE%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%20%D0%BF%D1%80%D0%B8%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%B8%D1%82%D1%8C%20%D1%82%D0%BE%D1%80%D0%B3%D0%B8
     * @returns {void}
     */
    offline(): Promise<void>;
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=offline%3Fkey%3D%5Byour_secret_key%5D-,my-inventory,-%D0%9F%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B8%D0%BD%D0%B2%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D1%8F%20Steam
     * @returns {Promise<InventoryItem>}
     */
    inventory(): Promise<InventoryItem>;
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%D0%BD%D0%B5%D1%82%20%D0%B2%D1%8B%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%BD%D1%8B%D1%85%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%BE%D0%B2-,items,-%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%BE%D0%B2%3A
     */
    items(): Promise<ItemResponse>;
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%D0%BD%D0%B0%D1%87%D0%B8%D1%81%D0%BB%D0%B5%D0%BD%D1%8B%20%D1%88%D1%82%D1%80%D0%B0%D1%84%D0%BD%D1%8B%D0%B5%20%D0%B1%D0%B0%D0%BB%D0%BB%D1%8B-,trades,-%D0%9F%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C%20%D1%81%D0%BF%D0%B8%D1%81%D0%BE%D0%BA%20%D1%82%D1%80%D0%B5%D0%B9%D0%B4
     * @returns {Promise<TradeResponse<Trade | TradeExtended>>}
     */
    trades(): Promise<TradeResponse<Trade>>;
    trades(extended: boolean): Promise<TradeResponse<TradeExtended>>;
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D1%8B%D0%B9%20%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%20%D0%B5%D0%B3%D0%BE-,buy,-%D0%9F%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%B0.%20%D0%92
     * @param {BuyParamsHash | BuyParamsId} payload
     * @returns {Promise<BuyForResponse>}
     */
    buy(payload: BuyParamsHash): Promise<BuyForResponse>;
    buy(payload: BuyParamsId): Promise<BuyForResponse>;
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=id%20-%20ID%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%B0-,buy-for,-%D0%9F%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%B0%20%D0%B8
     * @param {BuyForParams & BuyParamsId | BuyForParams & BuyParamsHash} payload
     * @returns {Promise<BuyForResponse>}
     */
    buyFor(payload: BuyForParams & BuyParamsHash): Promise<BuyForResponse>;
    buyFor(payload: BuyForParams & BuyParamsId): Promise<BuyForResponse>;
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=id%20-%20ID%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%B0-,get-buy-info-by-custom-id,-%D0%92%D0%BE%D0%B7%D0%B2%D1%80%D0%B0%D0%B2%D1%89%D0%B0%D0%B5%D1%82%20%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8E%20%D0%BE
     * @param {string | number} id
     * @returns {Promise<BuyInfoByCustomId>}
     */
    buyInfoByCustomId(id: string | number): Promise<BuyInfoByCustomId>;
    buyListInfoByCustomId(customIds: string[]): Promise<BuyListInfoByCustomId>;
    history(params: HistoryParams): Promise<HistoryResponse>;
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%D0%94%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D0%B8%D1%8F%20%D1%81%20%D0%B0%D0%BA%D0%BA%D0%B0%D1%83%D0%BD%D1%82%D0%BE%D0%BC-,get-money,-%D0%9F%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C%20%D1%81%D1%83%D0%BC%D0%BC%D1%83%20%D0%BD%D0%B0
     * @returns {Promise<BalanceResponse>}
     */
    balance(): Promise<BalanceResponse>;
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%7B%0A%20%20%22success%22%3A%20true%0A%7D-,update-inventory,-%D0%97%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B8%D1%82%D1%8C%20%D0%BE%D0%B1%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BA%D1%8D%D1%88%D0%B0
     * @returns {Promise<BaseResponse>}
     */
    updateInventory(): Promise<BaseResponse>;
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%7B%0A%20%20%22success%22%3A%20true%0A%7D-,transfer-discounts,-%D0%9F%D0%B5%D1%80%D0%B5%D0%BD%D0%BE%D1%81%20%D1%81%D0%BA%D0%B8%D0%B4%D0%BE%D0%BA%20%D0%BD%D0%B0
     * @param {string} toSecretKey
     * @returns {Promise<BaseResponse>}
     */
    transferDiscounts(toSecretKey: string): Promise<BaseResponse>;
    /**
     * @see https://market.csgo.com/docs-v2#:~:text=%7B%0A%20%20%22success%22%3A%20true%0A%7D-,get-my-steam-id,-%D0%A3%D0%B7%D0%BD%D0%B0%D1%82%D1%8C%20%D1%81%D0%B2%D0%BE%D0%B9%20steamID
     * @returns {Promise<MySteamIdResponse>}
     */
    mySteamId(): Promise<MySteamIdResponse>;
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=123456%2C%0A%20%20%22steamid64%22%3A%20%221234123513245234%22%0A%7D-,set-pay-password,-%D0%A3%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0/%D1%81%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%BF%D0%BB%D0%B0%D1%82%D0%B5%D0%B6%D0%BD%D0%BE%D0%B3%D0%BE
     * @param {string} oldPassword
     * @param {string} newPassword
     * @returns {Promise<BaseResponse>}
     */
    setPayPassword(oldPassword: string, newPassword: string): Promise<BaseResponse>;
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%7B%0A%20%20%22success%22%3A%20true%0A%7D-,money-send,-%D0%9F%D0%B5%D1%80%D0%B5%D0%BD%D0%BE%D1%81%20%D0%B1%D0%B0%D0%BB%D0%B0%D0%BD%D1%81%D0%B0%20%D1%81
     * @param {SendMoneyParams} params
     * @returns {Promise<SendMoneyResponse>}
     */
    sendMoney({ amount, userApiKey, payPass }: SendMoneyParams): Promise<SendMoneyResponse>;
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%BE%D0%B2-,search-item-by-hash-name,-%D0%92%D0%B0%D1%80%D0%B8%D0%B0%D0%BD%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B0
     * @param {string} hashName
     * @returns {Promise<SearchItemByHashNameResponse>}
     */
    searchItemByHashName(hashName: string): Promise<SearchItemByHashNameResponse>;
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=57944754%2C%0A%20%20%20%20%20%20%22count%22%3A%2010%0A%20%20%20%20%7D%0A%20%20%5D%0A%7D-,search-item-by-hash-name-specific,-%D0%92%D0%B0%D1%80%D0%B8%D0%B0%D0%BD%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B0
     * @param {string} hashName
     * @returns {Promise<SearchItemBaseResponse<ItemHash[]>>}
     */
    searchItemByHashNameSpecific(hashName: string): Promise<SearchItemBaseResponse<ItemHash[]>>;
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%BE%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%B5-,search-list-items-by-hash-name-all,-%D0%92%D0%B0%D1%80%D0%B8%D0%B0%D0%BD%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B0
     * @param {string[]} hashNames
     * @returns {Promise<SearchItemBaseResponse<{[key: string]: ItemHash}>>}
     */
    searchListItemsByHashNameAll(hashNames: string[]): Promise<SearchItemBaseResponse<{
        [key: string]: ItemHash;
    }>>;
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%D0%B2%D1%80%D0%B5%D0%BC%D1%8F%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B4%D0%B0%D1%87%D0%B8%20%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B2%D1%86%D0%B0-,get-list-items-info,-%D0%92%D0%B0%D1%80%D0%B8%D0%B0%D0%BD%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B0
     * @param {string[]} hashNames
     * @returns {Promise<SearchItemBaseResponse<{[key: string]: ItemInfo}>>}
     */
    getListItemsInfo(hashNames: string[]): Promise<SearchItemBaseResponse<{
        [key: string]: ItemInfo;
    }>>;
    test(): Promise<import("axios").AxiosResponse<any>>;
}
