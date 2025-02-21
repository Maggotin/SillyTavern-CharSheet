var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiRequests } from "../api";
export class FeatureManager {
    constructor(params) {
        this.handleAcceptOnSuccess = (onSuccess) => {
            typeof onSuccess === 'function' && onSuccess();
        };
        this.handleRejectOnError = (onError) => {
            typeof onError === 'function' && onError();
        };
        this.handleAdd = (onSuccess, onError) => __awaiter(this, void 0, void 0, function* () {
            yield ApiRequests.postCharacterFeature({ featureId: this.getId() });
            this.bustCache();
            this.handleAcceptOnSuccess(onSuccess);
            this.runSubscriptions();
        });
        this.handleRemove = (onSuccess, onError) => __awaiter(this, void 0, void 0, function* () {
            // featureManagerMap.delete(this.getId()); //TODO GFS do we still need to do it this way
            yield ApiRequests.deleteCharacterFeature({ featureId: this.getId() });
            this.bustCache();
            this.handleAcceptOnSuccess(onSuccess);
            this.runSubscriptions();
        });
        //Accessors
        this.getId = () => this.feature.featureId;
        this.getStatements = () => this.feature.statements;
        this.getFeature = () => this.feature;
        // Label accessors
        // TODO what are the default/standard ones?
        //TODO GFS: talk about role.toLowerCase
        this.getName = () => { var _a, _b; return (_b = (_a = this.feature.labels.find((label) => label.role.toLowerCase() === 'name')) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 'FEATURE WITH NO NAME'; }; //TODO GFS ENUMS for all of these
        this.getDescription = () => { var _a, _b; return (_b = (_a = this.feature.labels.find((label) => label.role.toLowerCase() === 'description')) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : ''; };
        this.params = params;
        this.feature = params.feature;
        this.runSubscriptions = params.runSubscriptions;
        this.bustCache = params.bustCache;
    }
}
