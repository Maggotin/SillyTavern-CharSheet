export var ExtraTypeEnum;
(function (ExtraTypeEnum) {
    ExtraTypeEnum["VEHICLE"] = "Vehicle";
    ExtraTypeEnum["CREATURE"] = "Creature";
})(ExtraTypeEnum || (ExtraTypeEnum = {}));
//This is "hacking" vehicles into the creature group system giving the vehicle group an id value of -1
export const HACK_VEHICLE_GROUP_ID = -1;
export var ExtraGroupTypeEnum;
(function (ExtraGroupTypeEnum) {
    ExtraGroupTypeEnum["VEHICLE"] = "vehicle";
})(ExtraGroupTypeEnum || (ExtraGroupTypeEnum = {}));
