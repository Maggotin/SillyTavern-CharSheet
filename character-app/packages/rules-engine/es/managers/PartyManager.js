import { serviceDataActions } from '../actions';
import { CampaignAccessors, CampaignUtils } from '../engine/Campaign';
import { PartyInventorySharingStateEnum } from '../engine/Campaign/constants';
import { serviceDataSelectors } from '../selectors';
import { MessageManager } from './MessageManager';
export class PartyManager extends MessageManager {
    constructor(params) {
        super(params);
        // Data Requests
        this.updateSharedInventory = (shouldUpdate) => {
            if (shouldUpdate) {
                this.dispatch(serviceDataActions.partyInventoryRequest());
            }
        };
        this.handleAcceptOnSuccess = (isShared, onSuccess) => {
            return () => {
                typeof onSuccess === 'function' && onSuccess();
                if (isShared) {
                    const data = {};
                    const eventType = this.EVENT_TYPES.ITEM_SHARED_FULFILLED;
                    this.sendMessage({ data, eventType });
                }
            };
        };
        this.handleRejectOnError = (onError, isShared) => {
            return () => {
                typeof onError === 'function' && onError();
            };
        };
        // Accessors
        this.getSharingState = () => {
            var _a;
            const partyInfo = serviceDataSelectors.getPartyInfo(this.state);
            return (_a = (partyInfo && CampaignAccessors.getSharingState(partyInfo))) !== null && _a !== void 0 ? _a : PartyInventorySharingStateEnum.OFF; // if we get null return off
        };
        this.getPartyId = () => {
            const partyInfo = serviceDataSelectors.getPartyInfo(this.state);
            return partyInfo ? CampaignAccessors.getId(partyInfo) : null;
        };
        this.getPartyMemberName = (equippedEntityId) => {
            const partyInfo = serviceDataSelectors.getPartyInfo(this.state);
            if (partyInfo) {
                return CampaignUtils.getCharacterName(partyInfo, equippedEntityId);
            }
            return '';
        };
        // Validators
        this.isSharingTurnedOn = () => this.getSharingState() === PartyInventorySharingStateEnum.ON;
        this.isSharingTurnedOff = () => this.getSharingState() === PartyInventorySharingStateEnum.OFF;
        this.isSharingTurnedDeleteOnly = () => this.getSharingState() === PartyInventorySharingStateEnum.DELETE_ONLY;
        this.isSharingTurnedOnOrDeleteOnly = () => CampaignUtils.isSharingStateActive(this.getSharingState());
        this.addSubscriptions({
            [this.EVENT_TYPES.ITEM_SHARED_FULFILLED]: this.updateSharedInventory,
        });
    }
}
