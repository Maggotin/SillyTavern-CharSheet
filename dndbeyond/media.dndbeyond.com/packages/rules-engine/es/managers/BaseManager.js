import { getCurrentRulesEngineConfig } from '../config/utils';
export class BaseManager {
    constructor(params = {}) {
        this.randomId = 0; // helpful for debugging
        this.setState = (newState) => {
            var _a;
            const state = newState || ((_a = getCurrentRulesEngineConfig().store) === null || _a === void 0 ? void 0 : _a.getState()) || null;
            this.state = state;
        };
        this.getState = () => this.state || null;
        this.setDispatch = (newDispatch) => {
            var _a;
            const dispatch = newDispatch || ((_a = getCurrentRulesEngineConfig().store) === null || _a === void 0 ? void 0 : _a.dispatch) || null;
            if (dispatch) {
                this.dispatch = dispatch;
            }
        };
        this.getDispatch = () => this.dispatch;
        this.setState(params.state);
        this.setDispatch(params.dispatch);
        this.subscribeToStateUpdates(function init() { });
        // this random id can be used to help debug if there are more than one instance
        this.randomId = Math.floor(Math.random() * 1000000);
        this.name = 'BaseManager';
    }
    updateState() {
        const store = getCurrentRulesEngineConfig().store;
        if (store) {
            this.setState(store.getState());
        }
    }
    subscribeToStateUpdates(callback) {
        if (getCurrentRulesEngineConfig().store) {
            const store = getCurrentRulesEngineConfig().store;
            if (this.unsubscribe) {
                this.unsubscribe();
            }
            this.unsubscribe = store === null || store === void 0 ? void 0 : store.subscribe(() => {
                this.setState(store.getState());
                if (callback) {
                    callback();
                }
            });
            return this.unsubscribe;
        }
        return () => {
            if (this.unsubscribe) {
                this.unsubscribe();
            }
        };
    }
}
