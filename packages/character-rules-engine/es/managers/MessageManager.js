var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { getCurrentRulesEngineConfig } from '../config/utils';
import { generateGuid } from '../engine/Helper/utils';
import { characterSelectors } from '../selectors';
import { BaseManager } from './BaseManager';
const messageManagerGuid = generateGuid();
let isSubscribed = false;
let listeningFor = {};
export class MessageManager extends BaseManager {
    constructor(params = {}) {
        super(params);
        this.setMessageBroker = (newMessageBroker) => {
            const messageBroker = newMessageBroker || getCurrentRulesEngineConfig().messageBroker;
            if (!messageBroker) {
                if (process.env.NODE_ENV === 'development') {
                    console.warn('[MessageManager]: The message manager was not able to set the messageBroker');
                }
                this.messageBroker = null;
                return;
            }
            this.messageBroker = messageBroker;
            if (!isSubscribed) {
                this.subscribeToMessages();
            }
            isSubscribed = true;
        };
        this.getMessageBroker = () => {
            if (this.messageBroker === null) {
                // This class may have been instantiated before the message broker is ready.
                // If so, try getting it from the rules engine config, which may have updated.
                this.setMessageBroker();
            }
            return this.messageBroker;
        };
        this.sendMessage = (_a) => {
            var _b, _c, _d;
            var { data, entityId, entityType, eventType, messageScope, messageTarget, persist } = _a, rest = __rest(_a, ["data", "entityId", "entityType", "eventType", "messageScope", "messageTarget", "persist"]);
            if (!eventType) {
                throw new Error(`[MessageManager]: The message manager send method needs a valid eventType - ${eventType}`);
            }
            (_b = this.getMessageBroker()) === null || _b === void 0 ? void 0 : _b.dispatch(Object.assign({ data: Object.assign({ messageManagerGuid: this.messageManagerGuid, shouldUpdate: false }, data), entityId: entityId || this.characterId, entityType: entityType || 'character', 
                //pending, fulfilled, or rejected
                eventType, persist: persist || false, messageScope: messageScope || 'gameId', messageTarget: messageTarget ||
                    ((_c = characterSelectors.getCampaign(this.state)) === null || _c === void 0 ? void 0 : _c.id.toString()) ||
                    ((_d = this.getMessageBroker()) === null || _d === void 0 ? void 0 : _d.gameId) }, rest));
        };
        this.subscribeToMessages = () => {
            var _a;
            (_a = this.messageBroker) === null || _a === void 0 ? void 0 : _a.subscribe((msg) => {
                try {
                    const { messageManagerGuid, shouldUpdate } = msg === null || msg === void 0 ? void 0 : msg.data;
                    listeningFor[msg.eventType](shouldUpdate || this.messageManagerGuid !== messageManagerGuid);
                }
                catch (error) {
                    if (process.env.NODE_ENV === 'development') {
                        console.warn(`[MessageManager]: The message manager recieved an event it does not handle(${msg.eventType})`);
                    }
                }
            });
        };
        this.addSubscriptions = (newSubs) => {
            listeningFor = Object.assign(Object.assign({}, listeningFor), newSubs);
        };
        this.EVENT_TYPES = {
            //pending, fulfilled, or rejected
            //TODO: add more verbose actions? chat with team about it?
            //if we add more here - we should strongly consider changing ITEM_SHARED_FULFILLED name to something related to "update"
            ITEM_SHARED_FULFILLED: 'character-sheet/item-shared/fulfilled',
        };
        this.setMessageBroker(params.messageBroker);
        this.messageManagerGuid = messageManagerGuid;
        this.characterId = this.state ? characterSelectors.getId(this.state).toString() : '';
    }
}
