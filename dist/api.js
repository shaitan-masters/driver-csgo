"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TMApi = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_rate_limit_1 = __importDefault(require("axios-rate-limit"));
const qs_1 = __importDefault(require("qs"));
const socket_1 = require("./socket");
const constants_1 = require("./constants");
class TMApi {
    config;
    http;
    socket;
    constructor(config) {
        this.config = {
            ...config,
            ...!config.options && {
                options: {
                    ratelimit: true,
                },
            },
        };
        this.http = this.configureAxios(axios_1.default.create());
        this.socket = this.config.socket && new socket_1.TMSocket(this.config.socket);
    }
    configureAxios(axios) {
        axios.interceptors.response.use(response => {
            const data = response.data;
            if ('success' in data && data.success === false)
                throw new Error(JSON.stringify(data));
            return data;
        });
        axios.defaults.baseURL = this.config.endpoint;
        axios.defaults.params = { key: this.config.secretKey };
        return this.config.options?.ratelimit ? (0, axios_rate_limit_1.default)(axios, { maxRPS: 5 }) : axios;
    }
    async prices(currency = constants_1.CURRENCIES.RUB) {
        return this.http.get(`api/v2/prices/${currency}.json`, { params: null });
    }
    async pricesClassInstance(currency = constants_1.CURRENCIES.RUB) {
        return this.http.get(`api/v2/prices/class_instance/${currency}.json`, { params: null });
    }
    /**
     *
     * @param {boolean} withBotId
     * @returns {Promise<TradeTakeResponse>}
     */
    async tradeTake(withBotId = true) {
        return this.http.get('api/v2/trade-request-take', {
            params: { ...withBotId && this.config.botId && { bot: this.config.botId } }
        });
    }
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=EUR%22%2C%0A%20%20%22success%22%3A%20true%0A%7D-,go-offline,-%D0%9C%D0%BE%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%20%D0%BF%D1%80%D0%B8%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%B8%D1%82%D1%8C%20%D1%82%D0%BE%D1%80%D0%B3%D0%B8
     * @returns {void}
     */
    async offline() {
        return this.http.get('api/v2/go-offline');
    }
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=offline%3Fkey%3D%5Byour_secret_key%5D-,my-inventory,-%D0%9F%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B8%D0%BD%D0%B2%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D1%8F%20Steam
     * @returns {Promise<InventoryItem>}
     */
    async inventory() {
        return this.http.get('api/v2/my-inventory');
    }
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%D0%BD%D0%B5%D1%82%20%D0%B2%D1%8B%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%BD%D1%8B%D1%85%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%BE%D0%B2-,items,-%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%BE%D0%B2%3A
     */
    async items() {
        return this.http.get('api/v2/items');
    }
    async trades(extended = false) {
        return this.http.get('api/v2/trades', {
            params: {
                ...extended && { extended: 1 }
            }
        });
    }
    async buy(payload) {
        return this.http.get('api/v2/buy', { params: payload });
    }
    async buyFor(payload) {
        return this.http.get('api/v2/buy-for', { params: payload });
    }
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=id%20-%20ID%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%B0-,get-buy-info-by-custom-id,-%D0%92%D0%BE%D0%B7%D0%B2%D1%80%D0%B0%D0%B2%D1%89%D0%B0%D0%B5%D1%82%20%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8E%20%D0%BE
     * @param {string | number} id
     * @returns {Promise<BuyInfoByCustomId>}
     */
    async buyInfoByCustomId(id) {
        return this.http.get('api/v2/get-buy-info-by-custom-id', { params: { custom_id: id } });
    }
    async buyListInfoByCustomId(customIds) {
        return this.http.get('api/v2/get-list-buy-info-by-custom-id', {
            params: { custom_id: customIds },
            paramsSerializer: p => qs_1.default.stringify(p, { arrayFormat: 'brackets' })
        });
    }
    async history(params) {
        return this.http.get('api/v2/history', { params });
    }
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%D0%94%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D0%B8%D1%8F%20%D1%81%20%D0%B0%D0%BA%D0%BA%D0%B0%D1%83%D0%BD%D1%82%D0%BE%D0%BC-,get-money,-%D0%9F%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C%20%D1%81%D1%83%D0%BC%D0%BC%D1%83%20%D0%BD%D0%B0
     * @returns {Promise<BalanceResponse>}
     */
    async balance() {
        return this.http.get('api/v2/get-money');
    }
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%7B%0A%20%20%22success%22%3A%20true%0A%7D-,update-inventory,-%D0%97%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B8%D1%82%D1%8C%20%D0%BE%D0%B1%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BA%D1%8D%D1%88%D0%B0
     * @returns {Promise<BaseResponse>}
     */
    async updateInventory() {
        return this.http.get('api/v2/pdate-inventory');
    }
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%7B%0A%20%20%22success%22%3A%20true%0A%7D-,transfer-discounts,-%D0%9F%D0%B5%D1%80%D0%B5%D0%BD%D0%BE%D1%81%20%D1%81%D0%BA%D0%B8%D0%B4%D0%BE%D0%BA%20%D0%BD%D0%B0
     * @param {string} toSecretKey
     * @returns {Promise<BaseResponse>}
     */
    async transferDiscounts(toSecretKey) {
        return this.http.get('api/v2/transfer-discounts', { params: { to: toSecretKey } });
    }
    /**
     * @see https://market.csgo.com/docs-v2#:~:text=%7B%0A%20%20%22success%22%3A%20true%0A%7D-,get-my-steam-id,-%D0%A3%D0%B7%D0%BD%D0%B0%D1%82%D1%8C%20%D1%81%D0%B2%D0%BE%D0%B9%20steamID
     * @returns {Promise<MySteamIdResponse>}
     */
    async mySteamId() {
        return this.http.get('api/v2/get-my-steam-id');
    }
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=123456%2C%0A%20%20%22steamid64%22%3A%20%221234123513245234%22%0A%7D-,set-pay-password,-%D0%A3%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0/%D1%81%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%BF%D0%BB%D0%B0%D1%82%D0%B5%D0%B6%D0%BD%D0%BE%D0%B3%D0%BE
     * @param {string} oldPassword
     * @param {string} newPassword
     * @returns {Promise<BaseResponse>}
     */
    async setPayPassword(oldPassword, newPassword) {
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
    async sendMoney({ amount, userApiKey, payPass }) {
        return this.http.get(`api/v2/money-send/${amount}/${userApiKey}`, { params: { pay_pass: payPass } });
    }
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%BE%D0%B2-,search-item-by-hash-name,-%D0%92%D0%B0%D1%80%D0%B8%D0%B0%D0%BD%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B0
     * @param {string} hashName
     * @returns {Promise<SearchItemByHashNameResponse>}
     */
    async searchItemByHashName(hashName) {
        return this.http.get(`api/v2/search-item-by-hash-name`, { params: { hash_name: hashName } });
    }
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=57944754%2C%0A%20%20%20%20%20%20%22count%22%3A%2010%0A%20%20%20%20%7D%0A%20%20%5D%0A%7D-,search-item-by-hash-name-specific,-%D0%92%D0%B0%D1%80%D0%B8%D0%B0%D0%BD%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B0
     * @param {string} hashName
     * @returns {Promise<SearchItemBaseResponse<ItemHash[]>>}
     */
    async searchItemByHashNameSpecific(hashName) {
        return this.http.get(`api/v2/search-item-by-hash-name-specific`, { params: { hash_name: hashName } });
    }
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%BE%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%B5-,search-list-items-by-hash-name-all,-%D0%92%D0%B0%D1%80%D0%B8%D0%B0%D0%BD%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B0
     * @param {string[]} hashNames
     * @returns {Promise<SearchItemBaseResponse<{[key: string]: ItemHash}>>}
     */
    async searchListItemsByHashNameAll(hashNames) {
        return this.http.get('api/v2/search-list-items-by-hash-name-all', {
            params: { list_hash_name: hashNames },
            paramsSerializer: p => qs_1.default.stringify(p, { arrayFormat: 'brackets' })
        });
    }
    /**
     *
     * @see https://market.csgo.com/docs-v2#:~:text=%D0%B2%D1%80%D0%B5%D0%BC%D1%8F%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B4%D0%B0%D1%87%D0%B8%20%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B2%D1%86%D0%B0-,get-list-items-info,-%D0%92%D0%B0%D1%80%D0%B8%D0%B0%D0%BD%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B0
     * @param {string[]} hashNames
     * @returns {Promise<SearchItemBaseResponse<{[key: string]: ItemInfo}>>}
     */
    async getListItemsInfo(hashNames) {
        return this.http.get('api/v2/get-list-items-info', {
            params: { list_hash_name: hashNames },
            paramsSerializer: p => qs_1.default.stringify(p, { arrayFormat: 'brackets' })
        });
    }
    async test() {
        return this.http.get('api/v2/test');
    }
}
exports.TMApi = TMApi;
//# sourceMappingURL=api.js.map