export var ModifierBonusTypeEnum;
(function (ModifierBonusTypeEnum) {
    ModifierBonusTypeEnum[ModifierBonusTypeEnum["PROFICIENCY_BONUS"] = 1] = "PROFICIENCY_BONUS";
    ModifierBonusTypeEnum[ModifierBonusTypeEnum["ATTUNED_ITEM_COUNT"] = 2] = "ATTUNED_ITEM_COUNT";
    ModifierBonusTypeEnum[ModifierBonusTypeEnum["SPELL_LEVEL"] = 3] = "SPELL_LEVEL";
})(ModifierBonusTypeEnum || (ModifierBonusTypeEnum = {}));
export var ModifierTypeEnum;
(function (ModifierTypeEnum) {
    ModifierTypeEnum["SET_BASE"] = "set-base";
    ModifierTypeEnum["BONUS"] = "bonus";
    ModifierTypeEnum["SET"] = "set";
    ModifierTypeEnum["STACKING_BONUS"] = "stacking-bonus";
    ModifierTypeEnum["RESISTANCE"] = "resistance";
    ModifierTypeEnum["IMMUNITY"] = "immunity";
    ModifierTypeEnum["VULNERABILITY"] = "vulnerability";
    ModifierTypeEnum["HALF_PROFICIENCY"] = "half-proficiency";
    ModifierTypeEnum["HALF_PROFICIENCY_ROUND_UP"] = "half-proficiency-round-up";
    ModifierTypeEnum["PROFICIENCY"] = "proficiency";
    ModifierTypeEnum["TWICE_PROFICIENCY"] = "twice-proficiency";
    ModifierTypeEnum["EXPERTISE"] = "expertise";
    ModifierTypeEnum["DAMAGE"] = "damage";
    ModifierTypeEnum["ADVANTAGE"] = "advantage";
    ModifierTypeEnum["DISADVANTAGE"] = "disadvantage";
    ModifierTypeEnum["SENSE"] = "sense";
    ModifierTypeEnum["LANGUAGE"] = "language";
    ModifierTypeEnum["IGNORE"] = "ignore";
    ModifierTypeEnum["SIZE"] = "size";
    ModifierTypeEnum["SPEED_REDUCTION"] = "speed-reduction";
    ModifierTypeEnum["CARRYING_CAPACITY"] = "carrying-capacity";
    ModifierTypeEnum["NATURAL_WEAPON"] = "natural-weapon";
    ModifierTypeEnum["ELDRITCH_BLAST"] = "eldritch-blast";
    ModifierTypeEnum["REPLACE_DAMAGE_TYPE"] = "replace-damage-type";
    ModifierTypeEnum["REPLACE_WEAPON_ABILITY"] = "replace-weapon-ability";
    ModifierTypeEnum["WEAPON_PROPERTY"] = "weapon-property";
    ModifierTypeEnum["IGNORE_WEAPON_PROPERTY"] = "ignore-weapon-property";
    ModifierTypeEnum["MONK_WEAPON"] = "monk-weapon";
    ModifierTypeEnum["KENSEI"] = "kensei";
    ModifierTypeEnum["PROTECTION"] = "protection";
    ModifierTypeEnum["STEALTH_DISADVANTAGE"] = "stealth-disadvantage";
    ModifierTypeEnum["WEAPON_MASTERY"] = "weapon-mastery";
    ModifierTypeEnum["ENABLE_FEATURE"] = "enable-feature";
})(ModifierTypeEnum || (ModifierTypeEnum = {}));
export var ModifierSubTypeEnum;
(function (ModifierSubTypeEnum) {
    ModifierSubTypeEnum["ARMOR_CLASS"] = "armor-class";
    ModifierSubTypeEnum["MAGIC"] = "magic";
    ModifierSubTypeEnum["SPELL_SAVE_DC"] = "spell-save-dc";
    ModifierSubTypeEnum["PROFICIENCY"] = "proficiency";
    ModifierSubTypeEnum["PROFICIENCY_BONUS"] = "proficiency-bonus";
    ModifierSubTypeEnum["ALL"] = "all";
    ModifierSubTypeEnum["SELF"] = "self";
    ModifierSubTypeEnum["REMOVE"] = "remove";
    ModifierSubTypeEnum["DEATH"] = "death";
    ModifierSubTypeEnum["ATTUNEMENT_SLOTS"] = "attunement-slots";
    ModifierSubTypeEnum["INITIATIVE"] = "initiative";
    ModifierSubTypeEnum["PASSIVE_PERCEPTION"] = "passive-perception";
    ModifierSubTypeEnum["PASSIVE_INVESTIGATION"] = "passive-investigation";
    ModifierSubTypeEnum["PASSIVE_INSIGHT"] = "passive-insight";
    ModifierSubTypeEnum["AC_MAX_DEX_MODIFIER"] = "ac-max-dex-modifier";
    ModifierSubTypeEnum["AC_MAX_DEX_ARMORED_MODIFIER"] = "ac-max-dex-armored-modifier";
    ModifierSubTypeEnum["AC_MAX_DEX_UNARMORED_MODIFIER"] = "ac-max-dex-unarmored-modifier";
    ModifierSubTypeEnum["SHIELD_AC_ON_DEX_SAVES"] = "shield-ac-on-dex-saves";
    ModifierSubTypeEnum["OFFHAND_MODIFIER_RESTRICTIONS"] = "dual-wield-modifier-restrictions";
    ModifierSubTypeEnum["OFFHAND_LIGHT_RESTRICTIONS"] = "dual-wield-light-restrictions";
    ModifierSubTypeEnum["DUAL_WIELD_ARMOR_CLASS"] = "dual-wield-armor-class";
    ModifierSubTypeEnum["EXTRA_ATTACKS"] = "extra-attacks";
    ModifierSubTypeEnum["CANTRIP_DAMAGE"] = "cantrip-damage";
    ModifierSubTypeEnum["WEAPON_ATTACKS"] = "weapon-attacks";
    ModifierSubTypeEnum["MELEE_ATTACKS"] = "melee-attacks";
    ModifierSubTypeEnum["RANGED_ATTACKS"] = "ranged-attacks";
    ModifierSubTypeEnum["SPELL_ATTACKS"] = "spell-attacks";
    ModifierSubTypeEnum["NATURAL_ATTACKS"] = "natural-attacks";
    ModifierSubTypeEnum["MELEE_WEAPON_ATTACKS"] = "melee-weapon-attacks";
    ModifierSubTypeEnum["RANGED_WEAPON_ATTACKS"] = "ranged-weapon-attacks";
    ModifierSubTypeEnum["MELEE_SPELL_ATTACKS"] = "melee-spell-attacks";
    ModifierSubTypeEnum["RANGED_SPELL_ATTACKS"] = "ranged-spell-attacks";
    ModifierSubTypeEnum["MELEE_NATURAL_ATTACKS"] = "melee-natural-attacks";
    ModifierSubTypeEnum["RANGED_NATURAL_ATTACKS"] = "ranged-natural-attacks";
    ModifierSubTypeEnum["MELEE_UNARMED_ATTACKS"] = "melee-unarmed-attacks";
    ModifierSubTypeEnum["RANGED_UNARMED_ATTACKS"] = "ranged-unarmed-attacks";
    ModifierSubTypeEnum["UNARMED_ATTACKS"] = "unarmed-attacks";
    ModifierSubTypeEnum["STRENGTH_ATTACKS"] = "strength-attacks";
    ModifierSubTypeEnum["DEXTERITY_ATTACKS"] = "dexterity-attacks";
    ModifierSubTypeEnum["ONE_HANDED_WEAPON_ATTACKS"] = "one-handed-weapon-attacks";
    ModifierSubTypeEnum["TWO_HANDED_WEAPON_ATTACKS"] = "two-handed-weapon-attacks";
    ModifierSubTypeEnum["ONE_HANDED_MELEE_ATTACKS"] = "one-handed-melee-attacks";
    ModifierSubTypeEnum["TWO_HANDED_MELEE_ATTACKS"] = "two-handed-melee-attacks";
    ModifierSubTypeEnum["ONE_HANDED_RANGED_ATTACKS"] = "one-handed-ranged-attacks";
    ModifierSubTypeEnum["TWO_HANDED_RANGED_ATTACKS"] = "two-handed-ranged-attacks";
    ModifierSubTypeEnum["THROWN_WEAPON_ATTACKS"] = "thrown-weapon-attacks";
    ModifierSubTypeEnum["THROWN_MELEE_ATTACKS"] = "thrown-melee-attacks";
    ModifierSubTypeEnum["THROWN_RANGED_ATTACKS"] = "thrown-ranged-attacks";
    ModifierSubTypeEnum["UNARMORED_DEX_AC_BONUS"] = "unarmored-dex-ac-bonus";
    ModifierSubTypeEnum["UNARMORED_ARMOR_CLASS"] = "unarmored-armor-class";
    ModifierSubTypeEnum["ARMORED_ARMOR_CLASS"] = "armored-armor-class";
    ModifierSubTypeEnum["UNARMORED_WHILE_ARMORED"] = "unarmored-while-armored";
    ModifierSubTypeEnum["MINIMUM_BASE_ARMOR"] = "minimum-base-armor";
    ModifierSubTypeEnum["UNARMED_DAMAGE_DIE"] = "unarmed-damage-die";
    ModifierSubTypeEnum["HIT_POINTS"] = "hit-points";
    ModifierSubTypeEnum["HIT_POINTS_PER_LEVEL"] = "hit-points-per-level";
    ModifierSubTypeEnum["TEMPORARY_HIT_POINTS"] = "temporary-hit-points";
    ModifierSubTypeEnum["GARGANTUAN"] = "gargantuan";
    ModifierSubTypeEnum["HUGE"] = "huge";
    ModifierSubTypeEnum["LARGE"] = "large";
    ModifierSubTypeEnum["MEDIUM"] = "medium";
    ModifierSubTypeEnum["SMALL"] = "small";
    ModifierSubTypeEnum["TINY"] = "tiny";
    ModifierSubTypeEnum["MULTIPLIER"] = "multiplier";
    ModifierSubTypeEnum["STRENGTH_SCORE"] = "strength-score";
    ModifierSubTypeEnum["DEXTERITY_SCORE"] = "dexterity-score";
    ModifierSubTypeEnum["CONSTITUTION_SCORE"] = "constitution-score";
    ModifierSubTypeEnum["INTELLIGENCE_SCORE"] = "intelligence-score";
    ModifierSubTypeEnum["WISDOM_SCORE"] = "wisdom-score";
    ModifierSubTypeEnum["CHARISMA_SCORE"] = "charisma-score";
    ModifierSubTypeEnum["CHOOSE_AN_ABILITY_SCORE"] = "choose-an-ability-score";
    ModifierSubTypeEnum["SPEED"] = "speed";
    ModifierSubTypeEnum["SPEED_WALKING"] = "speed-walking";
    ModifierSubTypeEnum["SPEED_FLYING"] = "speed-flying";
    ModifierSubTypeEnum["SPEED_CLIMBING"] = "speed-climbing";
    ModifierSubTypeEnum["SPEED_SWIMMING"] = "speed-swimming";
    ModifierSubTypeEnum["SPEED_BURROWING"] = "speed-burrowing";
    ModifierSubTypeEnum["INNATE_SPEED_WALKING"] = "innate-speed-walking";
    ModifierSubTypeEnum["INNATE_SPEED_FLYING"] = "innate-speed-flying";
    ModifierSubTypeEnum["INNATE_SPEED_CLIMBING"] = "innate-speed-climbing";
    ModifierSubTypeEnum["INNATE_SPEED_SWIMMING"] = "innate-speed-swimming";
    ModifierSubTypeEnum["INNATE_SPEED_BURROWING"] = "innate-speed-burrowing";
    ModifierSubTypeEnum["UNARMORED_MOVEMENT"] = "unarmored-movement";
    ModifierSubTypeEnum["SAVING_THROWS"] = "saving-throws";
    ModifierSubTypeEnum["STRENGTH_SAVING_THROWS"] = "strength-saving-throws";
    ModifierSubTypeEnum["DEXTERITY_SAVING_THROWS"] = "dexterity-saving-throws";
    ModifierSubTypeEnum["CONSTITUTION_SAVING_THROWS"] = "constitution-saving-throws";
    ModifierSubTypeEnum["INTELLIGENCE_SAVING_THROWS"] = "intelligence-saving-throws";
    ModifierSubTypeEnum["WISDOM_SAVING_THROWS"] = "wisdom-saving-throws";
    ModifierSubTypeEnum["CHARISMA_SAVING_THROWS"] = "charisma-saving-throws";
    ModifierSubTypeEnum["DEATH_SAVING_THROWS"] = "death-saving-throws";
    ModifierSubTypeEnum["ABILITY_SCORE_MAXIMUM"] = "ability-score-maximum";
    ModifierSubTypeEnum["ABILITY_CHECKS"] = "ability-checks";
    ModifierSubTypeEnum["STRENGTH_ABILITY_CHECKS"] = "strength-ability-checks";
    ModifierSubTypeEnum["DEXTERITY_ABILITY_CHECKS"] = "dexterity-ability-checks";
    ModifierSubTypeEnum["CONSTITUTION_ABILITY_CHECKS"] = "constitution-ability-checks";
    ModifierSubTypeEnum["INTELLIGENCE_ABILITY_CHECKS"] = "intelligence-ability-checks";
    ModifierSubTypeEnum["WISDOM_ABILITY_CHECKS"] = "wisdom-ability-checks";
    ModifierSubTypeEnum["CHARISMA_ABILITY_CHECKS"] = "charisma-ability-checks";
    ModifierSubTypeEnum["CRITICAL_HITS"] = "critical-hits";
    ModifierSubTypeEnum["ACID"] = "acid";
    ModifierSubTypeEnum["BLUDGEONING"] = "bludgeoning";
    ModifierSubTypeEnum["COLD"] = "cold";
    ModifierSubTypeEnum["FIRE"] = "fire";
    ModifierSubTypeEnum["FORCE"] = "force";
    ModifierSubTypeEnum["LIGHTNING"] = "lightning";
    ModifierSubTypeEnum["NECROTIC"] = "necrotic";
    ModifierSubTypeEnum["PIERCING"] = "piercing";
    ModifierSubTypeEnum["POISON"] = "poison";
    ModifierSubTypeEnum["PSYCHIC"] = "psychic";
    ModifierSubTypeEnum["RADIANT"] = "radiant";
    ModifierSubTypeEnum["SLASHING"] = "slashing";
    ModifierSubTypeEnum["THUNDER"] = "thunder";
    ModifierSubTypeEnum["BLUDGEONING_PIERCING_SLASHING_NONMAGIC"] = "bludgeoning--piercing--and-slashing-from-nonmagical-weapons";
    ModifierSubTypeEnum["BLINDSIGHT"] = "blindsight";
    ModifierSubTypeEnum["DARKVISION"] = "darkvision";
    ModifierSubTypeEnum["TREMORSENSE"] = "tremorsense";
    ModifierSubTypeEnum["TRUESIGHT"] = "truesight";
    ModifierSubTypeEnum["NATURAL_WEAPON"] = "natural-weapon";
    ModifierSubTypeEnum["UNARMED_STRIKE"] = "unarmed-strike";
    ModifierSubTypeEnum["HEAVY_ARMOR_SPEED_REDUCTION"] = "heavy-armor-speed-reduction";
    // Armor
    ModifierSubTypeEnum["LIGHT_ARMOR"] = "light-armor";
    ModifierSubTypeEnum["MEDIUM_ARMOR"] = "medium-armor";
    ModifierSubTypeEnum["HEAVY_ARMOR"] = "heavy-armor";
    ModifierSubTypeEnum["SHIELDS"] = "shields";
    // light armor
    ModifierSubTypeEnum["PADDED"] = "padded";
    ModifierSubTypeEnum["LEATHER"] = "leather";
    ModifierSubTypeEnum["STUDDED_LEATHER"] = "studded-leather";
    // medium armor
    ModifierSubTypeEnum["HIDE"] = "hide";
    ModifierSubTypeEnum["CHAIN_SHIRT"] = "chain-shirt";
    ModifierSubTypeEnum["SCALE_MAIL"] = "scale-mail";
    ModifierSubTypeEnum["BREASTPLATE"] = "breastplate";
    ModifierSubTypeEnum["HALF_PLATE"] = "half-plate";
    ModifierSubTypeEnum["SPIKED_ARMOR"] = "spiked-armor";
    // heavy armor
    ModifierSubTypeEnum["RING_MAIL"] = "ring-mail";
    ModifierSubTypeEnum["CHAIN_MAIL"] = "chain-mail";
    ModifierSubTypeEnum["SPLINT"] = "splint";
    ModifierSubTypeEnum["PLATE"] = "plate";
    // shields
    ModifierSubTypeEnum["SHIELD"] = "shield";
    ModifierSubTypeEnum["PROPERTY_AMMUNITION"] = "ammunition";
    ModifierSubTypeEnum["PROPERTY_FINESSE"] = "finesse";
    ModifierSubTypeEnum["PROPERTY_HEAVY"] = "heavy";
    ModifierSubTypeEnum["PROPERTY_LIGHT"] = "light";
    ModifierSubTypeEnum["PROPERTY_LOADING"] = "loading";
    ModifierSubTypeEnum["PROPERTY_RANGE"] = "range";
    ModifierSubTypeEnum["PROPERTY_REACH"] = "reach";
    ModifierSubTypeEnum["PROPERTY_SPECIAL"] = "special";
    ModifierSubTypeEnum["PROPERTY_THROWN"] = "thrown";
    ModifierSubTypeEnum["PROPERTY_TWO_HANDED"] = "two-handed";
    ModifierSubTypeEnum["PROPERTY_VERSATILE"] = "versatile";
    ModifierSubTypeEnum["MELEE_REACH"] = "melee-reach";
    // edlritch blast
    ModifierSubTypeEnum["BONUS_DAMAGE"] = "bonus-damage";
    ModifierSubTypeEnum["BONUS_RANGE"] = "bonus-range";
    ModifierSubTypeEnum["SPELL_ATTACK_RANGE_MULTIPLIER"] = "spell-attack-range-multiplier";
    ModifierSubTypeEnum["ZERO_HP"] = "0-hp";
    ModifierSubTypeEnum["MAGIC_ITEM_ATTACK_WITH_STRENGTH"] = "magic-item-attack-with-strength";
    ModifierSubTypeEnum["MAGIC_ITEM_ATTACK_WITH_DEXTERITY"] = "magic-item-attack-with-dexterity";
    ModifierSubTypeEnum["MAGIC_ITEM_ATTACK_WITH_CONSTITUTION"] = "magic-item-attack-with-constitution";
    ModifierSubTypeEnum["MAGIC_ITEM_ATTACK_WITH_INTELLIGENCE"] = "magic-item-attack-with-intelligence";
    ModifierSubTypeEnum["MAGIC_ITEM_ATTACK_WITH_WISDOM"] = "magic-item-attack-with-wisdom";
    ModifierSubTypeEnum["MAGIC_ITEM_ATTACK_WITH_CHARISMA"] = "magic-item-attack-with-charisma";
    // Spell Groups
    ModifierSubTypeEnum["SPELL_GROUP_HEALING"] = "spell-group-healing";
    // Warlock Feature
    ModifierSubTypeEnum["ENABLE_PACT_WEAPON"] = "enable-pact-weapon";
    ModifierSubTypeEnum["ENABLE_HEX_WEAPON"] = "enable-hex-weapon";
})(ModifierSubTypeEnum || (ModifierSubTypeEnum = {}));
export const SIZE_LIST = [
    ModifierSubTypeEnum.GARGANTUAN,
    ModifierSubTypeEnum.HUGE,
    ModifierSubTypeEnum.LARGE,
    ModifierSubTypeEnum.MEDIUM,
    ModifierSubTypeEnum.SMALL,
    ModifierSubTypeEnum.TINY,
];
export const DAMAGE_ADJUSTMENT_LIST = [
    ModifierSubTypeEnum.ACID,
    ModifierSubTypeEnum.BLUDGEONING,
    ModifierSubTypeEnum.COLD,
    ModifierSubTypeEnum.FIRE,
    ModifierSubTypeEnum.FORCE,
    ModifierSubTypeEnum.LIGHTNING,
    ModifierSubTypeEnum.NECROTIC,
    ModifierSubTypeEnum.PIERCING,
    ModifierSubTypeEnum.POISON,
    ModifierSubTypeEnum.PSYCHIC,
    ModifierSubTypeEnum.RADIANT,
    ModifierSubTypeEnum.SLASHING,
    ModifierSubTypeEnum.THUNDER,
    ModifierSubTypeEnum.BLUDGEONING_PIERCING_SLASHING_NONMAGIC,
];
export const LIGHT_ARMOR_LIST = [
    ModifierSubTypeEnum.PADDED,
    ModifierSubTypeEnum.LEATHER,
    ModifierSubTypeEnum.STUDDED_LEATHER,
];
export const MEDIUM_ARMOR_LIST = [
    ModifierSubTypeEnum.HIDE,
    ModifierSubTypeEnum.CHAIN_SHIRT,
    ModifierSubTypeEnum.SCALE_MAIL,
    ModifierSubTypeEnum.BREASTPLATE,
    ModifierSubTypeEnum.HALF_PLATE,
    ModifierSubTypeEnum.SPIKED_ARMOR,
];
export const HEAVY_ARMOR_LIST = [
    ModifierSubTypeEnum.RING_MAIL,
    ModifierSubTypeEnum.CHAIN_MAIL,
    ModifierSubTypeEnum.SPLINT,
    ModifierSubTypeEnum.PLATE,
];
export const SHIELDS_LIST = [ModifierSubTypeEnum.SHIELD];
export const ALL_ARMOR_LIST = [
    ...LIGHT_ARMOR_LIST,
    ...MEDIUM_ARMOR_LIST,
    ...HEAVY_ARMOR_LIST,
    ...SHIELDS_LIST,
];
export const PROPERTY_LIST = [
    ModifierSubTypeEnum.PROPERTY_AMMUNITION,
    ModifierSubTypeEnum.PROPERTY_FINESSE,
    ModifierSubTypeEnum.PROPERTY_HEAVY,
    ModifierSubTypeEnum.PROPERTY_LIGHT,
    ModifierSubTypeEnum.PROPERTY_LOADING,
    ModifierSubTypeEnum.PROPERTY_RANGE,
    ModifierSubTypeEnum.PROPERTY_REACH,
    // ModifierSubTypeEnum.PROPERTY_SPECIAL,
    ModifierSubTypeEnum.PROPERTY_THROWN,
    ModifierSubTypeEnum.PROPERTY_TWO_HANDED,
    ModifierSubTypeEnum.PROPERTY_VERSATILE,
];
export const MAGIC_ITEM_ATTACK_WITH_STAT_LIST = [
    ModifierSubTypeEnum.MAGIC_ITEM_ATTACK_WITH_STRENGTH,
    ModifierSubTypeEnum.MAGIC_ITEM_ATTACK_WITH_DEXTERITY,
    ModifierSubTypeEnum.MAGIC_ITEM_ATTACK_WITH_CONSTITUTION,
    ModifierSubTypeEnum.MAGIC_ITEM_ATTACK_WITH_INTELLIGENCE,
    ModifierSubTypeEnum.MAGIC_ITEM_ATTACK_WITH_WISDOM,
    ModifierSubTypeEnum.MAGIC_ITEM_ATTACK_WITH_CHARISMA,
];
export const STAT_SAVING_THROW_LIST = [
    ModifierSubTypeEnum.STRENGTH_SAVING_THROWS,
    ModifierSubTypeEnum.DEXTERITY_SAVING_THROWS,
    ModifierSubTypeEnum.CONSTITUTION_SAVING_THROWS,
    ModifierSubTypeEnum.INTELLIGENCE_SAVING_THROWS,
    ModifierSubTypeEnum.WISDOM_SAVING_THROWS,
    ModifierSubTypeEnum.CHARISMA_SAVING_THROWS,
];
export const STAT_ABILITY_CHECK_LIST = [
    ModifierSubTypeEnum.STRENGTH_ABILITY_CHECKS,
    ModifierSubTypeEnum.DEXTERITY_ABILITY_CHECKS,
    ModifierSubTypeEnum.CONSTITUTION_ABILITY_CHECKS,
    ModifierSubTypeEnum.INTELLIGENCE_ABILITY_CHECKS,
    ModifierSubTypeEnum.WISDOM_ABILITY_CHECKS,
    ModifierSubTypeEnum.CHARISMA_ABILITY_CHECKS,
];
export const STAT_ABILITY_SCORE_LIST = [
    ModifierSubTypeEnum.STRENGTH_SCORE,
    ModifierSubTypeEnum.DEXTERITY_SCORE,
    ModifierSubTypeEnum.CONSTITUTION_SCORE,
    ModifierSubTypeEnum.INTELLIGENCE_SCORE,
    ModifierSubTypeEnum.WISDOM_SCORE,
    ModifierSubTypeEnum.CHARISMA_SCORE,
];
