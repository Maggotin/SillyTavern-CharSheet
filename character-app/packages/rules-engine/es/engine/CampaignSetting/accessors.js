export function getEnabledSourceIds(campaignSetting) {
    return campaignSetting.enabledSourceIds;
}
export function getAvailableSourceIds(campaignSetting) {
    var _a;
    return (_a = campaignSetting === null || campaignSetting === void 0 ? void 0 : campaignSetting.availableSources) === null || _a === void 0 ? void 0 : _a.map((s) => s.sourceId);
}
