import axios, { AxiosInstance } from 'axios';
import ratelimiter from 'axios-rate-limit';
import qs from 'qs';
import {
    BalanceResponse,
    BaseResponse,
    BuyForParams,
    BuyForResponse,
    BuyInfoByCustomId,
    BuyListInfoByCustomId,
    BuyParamsHash,
    BuyParamsId,
    CSGOMarketConfig,
    Currency,
    HistoryParams,
    HistoryResponse,
    InventoryItem,
    ItemHash,
    ItemInfo,
    ItemResponse,
    MySteamIdResponse,
    PriceInstancesResponse,
    PricesResponse,
    SearchItemBaseResponse,
    SearchItemByHashNameResponse,
    SendMoneyParams,
    SendMoneyResponse,
    Trade,
    TradeExtended,
    TradeResponse,
    TradeTakeResponse
} from './types';
import { TMSocket } from './socket';
import { CURRENCIES } from './constants';


export class TMApi {

    protected readonly config: CSGOMarketConfig;
    protected readonly http: AxiosInstance;

    readonly socket?: TMSocket;

    constructor(config: CSGOMarketConfig) {
        this.config = {
            ...config,
            ...!config.options && {
                options: {
                    ratelimit: true,
                },
            },
        };

        this.http = this.configureAxios(axios);
        this.socket = this.config.socket && new TMSocket(this.config.socket);
    }

    protected configureAxios(axios: AxiosInstance): AxiosInstance {
        axios.interceptors.response.use(response => {
            const data = response.data;
            if ('success' in data && data.success === false) throw new Error(JSON.stringify(data));

            return data;
        });

        axios.defaults.baseURL = this.config.endpoint;
        axios.defaults.params = { key: this.config.secretKey };

        return this.config.options?.ratelimit ? ratelimiter(axios, { maxRPS: 5 }) : axios;
    }

    public async prices(currency: Currency = CURRENCIES.RUB): Promise<PricesResponse> {
        return this.http.get(`api/v2/prices/${currency}.json`, { params: null });
    }

    public async pricesClassInstance(currency: Currency = CURRENCIES.RUB): Promise<PriceInstancesResponse> {
        return this.http.get(`api/v2/prices/class_instance/${currency}.json`, { params: null });
    }

    /**
     *
     * @param {boolean} withBotId
     * @returns {Promise<TradeTakeResponse>}
     */
    public async tradeTake(withBotId: boolean = true): Promise<TradeTakeResponse> {
        return this.http.get('api/v2/trade-request-take', {
            params: { ...withBotId && this.config.botId && { bot: this.config.botId } }
        });
    }

    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=EUR%22%2C%0A%20%20%22success%22%3A%20true%0A%7D-,go-offline,-%D0%9C%D0%BE%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%20%D0%BF%D1%80%D0%B8%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%B8%D1%82%D1%8C%20%D1%82%D0%BE%D1%80%D0%B3%D0%B8
     * @returns {void}
     */
    public async offline(): Promise<void> {
        return this.http.get('api/v2/go-offline');
    }

    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=offline%3Fkey%3D%5Byour_secret_key%5D-,my-inventory,-%D0%9F%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B8%D0%BD%D0%B2%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D1%8F%20Steam
     * @returns {Promise<InventoryItem>}
     */
    public async inventory(): Promise<InventoryItem> {
        return this.http.get('api/v2/my-inventory');
    }

    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%D0%BD%D0%B5%D1%82%20%D0%B2%D1%8B%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%BD%D1%8B%D1%85%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%BE%D0%B2-,items,-%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%BE%D0%B2%3A
     */
    public async items(): Promise<ItemResponse> {
        return this.http.get('api/v2/items');
    }

    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%D0%BD%D0%B0%D1%87%D0%B8%D1%81%D0%BB%D0%B5%D0%BD%D1%8B%20%D1%88%D1%82%D1%80%D0%B0%D1%84%D0%BD%D1%8B%D0%B5%20%D0%B1%D0%B0%D0%BB%D0%BB%D1%8B-,trades,-%D0%9F%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C%20%D1%81%D0%BF%D0%B8%D1%81%D0%BE%D0%BA%20%D1%82%D1%80%D0%B5%D0%B9%D0%B4
     * @returns {Promise<TradeResponse<Trade | TradeExtended>>}
     */
    public async trades(): Promise<TradeResponse<Trade>>;
    public async trades(extended: boolean): Promise<TradeResponse<TradeExtended>>;
    public async trades(extended: boolean = false): Promise<TradeResponse<Trade | TradeExtended>> {
        return this.http.get('api/v2/trades', {
            params: {
                ...extended && { extended: 1 }
            }
        });
    }

    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D1%8B%D0%B9%20%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%20%D0%B5%D0%B3%D0%BE-,buy,-%D0%9F%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%B0.%20%D0%92
     * @param {BuyParamsHash | BuyParamsId} payload
     * @returns {Promise<BuyForResponse>}
     */
    public async buy(payload: BuyParamsHash): Promise<BuyForResponse>;
    public async buy(payload: BuyParamsId): Promise<BuyForResponse>;
    public async buy(payload: BuyParamsHash | BuyParamsId): Promise<BuyForResponse> {
        return this.http.get('api/v2/buy', { params: payload });
    }

    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=id%20-%20ID%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%B0-,buy-for,-%D0%9F%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%B0%20%D0%B8
     * @param {BuyForParams & BuyParamsId | BuyForParams & BuyParamsHash} payload
     * @returns {Promise<BuyForResponse>}
     */
    public async buyFor(payload: BuyForParams & BuyParamsHash): Promise<BuyForResponse>;
    public async buyFor(payload: BuyForParams & BuyParamsId): Promise<BuyForResponse>;
    public async buyFor(payload: BuyForParams & BuyParamsId | BuyForParams & BuyParamsHash): Promise<BuyForResponse> {
        return this.http.get('api/v2/buy-for', { params: payload });
    }

    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=id%20-%20ID%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%B0-,get-buy-info-by-custom-id,-%D0%92%D0%BE%D0%B7%D0%B2%D1%80%D0%B0%D0%B2%D1%89%D0%B0%D0%B5%D1%82%20%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8E%20%D0%BE
     * @param {string | number} id
     * @returns {Promise<BuyInfoByCustomId>}
     */
    public async buyInfoByCustomId(id: string | number): Promise<BuyInfoByCustomId> {
        return this.http.get('api/v2/get-buy-info-by-custom-id', { params: { custom_id: id } });
    }

    public async buyListInfoByCustomId(customIds: string[]): Promise<BuyListInfoByCustomId> {
        return this.http.get('api/v2/get-list-buy-info-by-custom-id', {
            params: { custom_id: customIds },
            paramsSerializer: p => qs.stringify(p, { arrayFormat: 'brackets' })
        });
    }

    public async history(params: HistoryParams): Promise<HistoryResponse> {
        return this.http.get('api/v2/history', { params });
    }

    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%D0%94%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D0%B8%D1%8F%20%D1%81%20%D0%B0%D0%BA%D0%BA%D0%B0%D1%83%D0%BD%D1%82%D0%BE%D0%BC-,get-money,-%D0%9F%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C%20%D1%81%D1%83%D0%BC%D0%BC%D1%83%20%D0%BD%D0%B0
     * @returns {Promise<BalanceResponse>}
     */
    public async balance(): Promise<BalanceResponse> {
        return this.http.get('api/v2/get-money');
    }

    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%7B%0A%20%20%22success%22%3A%20true%0A%7D-,update-inventory,-%D0%97%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B8%D1%82%D1%8C%20%D0%BE%D0%B1%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BA%D1%8D%D1%88%D0%B0
     * @returns {Promise<BaseResponse>}
     */
    public async updateInventory(): Promise<BaseResponse> {
        return this.http.get('api/v2/pdate-inventory');
    }

    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%7B%0A%20%20%22success%22%3A%20true%0A%7D-,transfer-discounts,-%D0%9F%D0%B5%D1%80%D0%B5%D0%BD%D0%BE%D1%81%20%D1%81%D0%BA%D0%B8%D0%B4%D0%BE%D0%BA%20%D0%BD%D0%B0
     * @param {string} toSecretKey
     * @returns {Promise<BaseResponse>}
     */
    public async transferDiscounts(toSecretKey: string): Promise<BaseResponse> {
        return this.http.get('api/v2/transfer-discounts', { params: { to: toSecretKey } });
    }

    /**
     * @see https://market.csgo.com/docs-v2#:~:text=%7B%0A%20%20%22success%22%3A%20true%0A%7D-,get-my-steam-id,-%D0%A3%D0%B7%D0%BD%D0%B0%D1%82%D1%8C%20%D1%81%D0%B2%D0%BE%D0%B9%20steamID
     * @returns {Promise<MySteamIdResponse>}
     */
    public async mySteamId(): Promise<MySteamIdResponse> {
        return this.http.get('api/v2/get-my-steam-id');
    }

    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=123456%2C%0A%20%20%22steamid64%22%3A%20%221234123513245234%22%0A%7D-,set-pay-password,-%D0%A3%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0/%D1%81%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%BF%D0%BB%D0%B0%D1%82%D0%B5%D0%B6%D0%BD%D0%BE%D0%B3%D0%BE
     * @param {string} oldPassword
     * @param {string} newPassword
     * @returns {Promise<BaseResponse>}
     */
    public async setPayPassword(oldPassword: string, newPassword: string): Promise<BaseResponse> {
        return this.http.get('api/v2/set-pay-password', {
            params: {
                old_password: oldPassword,
                new_password: newPassword
            }
        });
    }

    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%7B%0A%20%20%22success%22%3A%20true%0A%7D-,money-send,-%D0%9F%D0%B5%D1%80%D0%B5%D0%BD%D0%BE%D1%81%20%D0%B1%D0%B0%D0%BB%D0%B0%D0%BD%D1%81%D0%B0%20%D1%81
     * @param {SendMoneyParams} params
     * @returns {Promise<SendMoneyResponse>}
     */
    public async sendMoney({ amount, userApiKey, payPass }: SendMoneyParams): Promise<SendMoneyResponse> {
        return this.http.get(`api/v2/money-send/${amount}/${userApiKey}`, { params: { pay_pass: payPass } });
    }

    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%BE%D0%B2-,search-item-by-hash-name,-%D0%92%D0%B0%D1%80%D0%B8%D0%B0%D0%BD%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B0
     * @param {string} hashName
     * @returns {Promise<SearchItemByHashNameResponse>}
     */
    public async searchItemByHashName(hashName: string): Promise<SearchItemByHashNameResponse> {
        return this.http.get(`api/v2/search-item-by-hash-name`, { params: { hash_name: hashName } });
    }

    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=57944754%2C%0A%20%20%20%20%20%20%22count%22%3A%2010%0A%20%20%20%20%7D%0A%20%20%5D%0A%7D-,search-item-by-hash-name-specific,-%D0%92%D0%B0%D1%80%D0%B8%D0%B0%D0%BD%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B0
     * @param {string} hashName
     * @returns {Promise<SearchItemBaseResponse<ItemHash[]>>}
     */
    public async searchItemByHashNameSpecific(hashName: string): Promise<SearchItemBaseResponse<ItemHash[]>> {
        return this.http.get(`api/v2/search-item-by-hash-name-specific`, { params: { hash_name: hashName } });
    }

    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%BE%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%B5-,search-list-items-by-hash-name-all,-%D0%92%D0%B0%D1%80%D0%B8%D0%B0%D0%BD%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B0
     * @param {string[]} hashNames
     * @returns {Promise<SearchItemBaseResponse<{[key: string]: ItemHash}>>}
     */
    public async searchListItemsByHashNameAll(hashNames: string[]): Promise<SearchItemBaseResponse<{ [key: string]: ItemHash; }>> {
        return this.http.get('api/v2/search-list-items-by-hash-name-all', {
            params: { list_hash_name: hashNames },
            paramsSerializer: p => qs.stringify(p, { arrayFormat: 'brackets' })
        });
    }

    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%D0%B2%D1%80%D0%B5%D0%BC%D1%8F%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B4%D0%B0%D1%87%D0%B8%20%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B2%D1%86%D0%B0-,get-list-items-info,-%D0%92%D0%B0%D1%80%D0%B8%D0%B0%D0%BD%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B0
     * @param {string[]} hashNames
     * @returns {Promise<SearchItemBaseResponse<{[key: string]: ItemInfo}>>}
     */
    public async getListItemsInfo(hashNames: string[]): Promise<SearchItemBaseResponse<{ [key: string]: ItemInfo; }>> {
        return this.http.get('api/v2/get-list-items-info', {
            params: { list_hash_name: hashNames },
            paramsSerializer: p => qs.stringify(p, { arrayFormat: 'brackets' })
        });
    }

    public async test() {
        return this.http.get('api/v2/test');
    }
}
