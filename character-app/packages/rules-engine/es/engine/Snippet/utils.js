import { isFinite, toNumber } from 'lodash';
import { TypeScriptUtils } from '../../utils';
import { AbilityAccessors } from '../Ability';
import { CharacterDerivers } from '../Character';
import { DiceRenderers } from '../Dice';
import { FormatUtils } from '../Format';
import { LimitedUseDerivers } from '../LimitedUse';
import { SpellDerivers } from '../Spell';
import { SnippetAbilityKeyEnum, SnippetContentChunkTypeEnum, SnippetMathOperatorEnum, SnippetPostProcessTypeEnum, SnippetSymbolEnum, SnippetTagDataTypeEnum, SnippetTagValueTypeEnum, SnippetValueModifierTypeEnum, } from './constants';
const snippetTagValues = Object.keys(SnippetTagValueTypeEnum)
    .map((tagValueType) => SnippetTagValueTypeEnum[tagValueType])
    .join('|')
    .toLowerCase();
const groupFragmentRegExpr = new RegExp(['\\(([^\\(\\)]*?)\\)(?:', SnippetSymbolEnum.VALUE_MODIFIER, '([^+*\\-\\/]+)?)?'].join(''));
const tagValueRegExpr = new RegExp([
    '((?:',
    snippetTagValues,
    ')(?:\\',
    SnippetSymbolEnum.PARAMETER,
    '[^',
    SnippetSymbolEnum.VALUE_MODIFIER,
    '+*\\-\\/]+)?)(?:',
    SnippetSymbolEnum.VALUE_MODIFIER,
    '([^+*\\-\\/]+)?)?',
].join(''));
/**
 *
 * @param key
 */
export function validateAbilityKey(key) {
    if (!isSnippetAbilityKeyEnum(key)) {
        throw new Error(`Invalid Ability Key: ${key}`);
    }
}
/**
 *
 * @param key
 */
export function isSnippetAbilityKeyEnum(key) {
    switch (key) {
        case SnippetAbilityKeyEnum.STRENGTH:
        case SnippetAbilityKeyEnum.DEXTERITY:
        case SnippetAbilityKeyEnum.CONSTITUTION:
        case SnippetAbilityKeyEnum.INTELLIGENCE:
        case SnippetAbilityKeyEnum.WISDOM:
        case SnippetAbilityKeyEnum.CHARISMA:
            return true;
        default:
        // not implemented
    }
    return false;
}
/**
 *
 * @param key
 */
export function isSnippetValueModifierTypeEnum(key) {
    switch (key) {
        case SnippetValueModifierTypeEnum.MAX:
        case SnippetValueModifierTypeEnum.MIN:
        case SnippetValueModifierTypeEnum.ROUND_DOWN:
        case SnippetValueModifierTypeEnum.ROUND_UP:
            return true;
        default:
        // not implemented
    }
    return false;
}
/**
 *
 * @param key
 */
export function isSnippetPostProcessTypeEnum(key) {
    switch (key) {
        case SnippetPostProcessTypeEnum.MAX:
        case SnippetPostProcessTypeEnum.MIN:
        case SnippetPostProcessTypeEnum.ROUND_DOWN:
        case SnippetPostProcessTypeEnum.ROUND_UP:
        case SnippetPostProcessTypeEnum.SIGNED_NUMBER:
        case SnippetPostProcessTypeEnum.UNSIGNED_NUMBER:
            return true;
        default:
        // not implemented
    }
    return false;
}
/**
 *
 * @param key
 */
export function isSnippetTagValueTypeEnum(key) {
    switch (key) {
        case SnippetTagValueTypeEnum.SCALE_VALUE:
        case SnippetTagValueTypeEnum.LIMITED_USE:
        case SnippetTagValueTypeEnum.CLASS_LEVEL:
        case SnippetTagValueTypeEnum.ABILITY_SCORE:
        case SnippetTagValueTypeEnum.CHARACTER_LEVEL:
        case SnippetTagValueTypeEnum.MAX_HP:
        case SnippetTagValueTypeEnum.PROFICIENCY:
        case SnippetTagValueTypeEnum.SPELL_ATTACK:
        case SnippetTagValueTypeEnum.SAVE_DC:
        case SnippetTagValueTypeEnum.MODIFIER:
        case SnippetTagValueTypeEnum.FIXED_VALUE:
            return true;
        default:
        // not implemented
    }
    return false;
}
/**
 *
 * @param type
 */
export function isSignedTagValueType(type) {
    switch (type) {
        case SnippetTagValueTypeEnum.SPELL_ATTACK:
        case SnippetTagValueTypeEnum.MODIFIER:
            return true;
        default:
        // not implemented
    }
    return false;
}
/**
 *
 * @param contextData
 */
export function isLevelScaleFixedValue(contextData) {
    if (!contextData.levelScale) {
        return false;
    }
    return contextData.levelScale.fixedValue !== null && contextData.levelScale.dice === null;
}
/**
 *
 * @param rawSnippetTag
 * @param contextData
 */
export function isValidStringTagValueType(rawSnippetTag, contextData) {
    const tagValueStringTypesRegExp = new RegExp(['^(', [SnippetTagValueTypeEnum.SCALE_VALUE].join('|').toLowerCase(), ')$'].join(''));
    let match = rawSnippetTag.match(tagValueStringTypesRegExp);
    if (match) {
        switch (match[1]) {
            case SnippetTagValueTypeEnum.SCALE_VALUE:
                return !isLevelScaleFixedValue(contextData);
            default:
            // not implemented
        }
    }
    return false;
}
/**
 *
 * @param type
 */
export function isLastPostProcessType(type) {
    switch (type) {
        case SnippetPostProcessTypeEnum.SIGNED_NUMBER:
        case SnippetPostProcessTypeEnum.UNSIGNED_NUMBER:
            return true;
    }
    return false;
}
/**
 *
 * @param numberString
 */
export function isParsableNumber(numberString) {
    return !isNaN(toNumber(numberString)) || numberString === '-' || numberString === '.';
}
/**
 *
 * @param expression
 * @param operator
 */
export function hasOperator(expression, operator) {
    return expression.indexOf(operator) > -1;
}
/**
 *
 * @param str
 */
export function throwMismatchedParens(str) {
    let level = 0;
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        if (char === '(') {
            level += 1;
        }
        if (char === ')') {
            if (level === 0) {
                throw new Error('Mismatching parenthesis');
            }
            level -= 1;
        }
    }
    if (level !== 0) {
        throw new Error('Mismatching parenthesis');
    }
}
/**
 *
 * @param str
 */
export function throwInvalidSnippetCharacters(str) {
    const keywordMatches = str.match(/[a-z]+/g);
    keywordMatches === null || keywordMatches === void 0 ? void 0 : keywordMatches.forEach((keyword) => {
        if (isSnippetTagValueTypeEnum(keyword) ||
            isSnippetAbilityKeyEnum(keyword) ||
            isSnippetValueModifierTypeEnum(keyword) ||
            isSnippetPostProcessTypeEnum(keyword)) {
            return;
        }
        else {
            throw new Error(`Invalid keyword: ${keyword}`);
        }
    });
    const invalidSymbolMatches = str.match(/[^a-z\d+*\-\/#@:,()]/);
    if (invalidSymbolMatches) {
        throw new Error(`Invalid symbol: ${invalidSymbolMatches[0]}`);
    }
    const invalidValueModifierMatches = str.match(/[^a-z@)]+(@[a-z,:\d]*)/);
    if (invalidValueModifierMatches) {
        throw new Error(`Value modifier cannot be used at current location: ${invalidValueModifierMatches[1]}`);
    }
}
/**
 *
 * @param str
 */
export function deriveFormattedTag(str) {
    return str
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/-\(/g, '-1*(')
        .replace(/\)\(/g, ')*(')
        .replace(/-/g, '+-')
        .replace(/--/g, '+')
        .replace(/\+\+/g, '+')
        .replace(/\(\+/g, '(')
        .replace(/(\d)\(/g, '$1*(')
        .replace(/^\++/, '');
}
/**
 *
 * @param str
 */
export function deriveListOptions(str) {
    return str.split(SnippetSymbolEnum.LIST_OPTION);
}
/**
 *
 * @param stats
 * @param snippetData
 */
export function deriveStatModifierValue(stats, snippetData) {
    const modifierValues = stats
        .map((statKey) => {
        validateAbilityKey(statKey);
        return AbilityAccessors.getModifier(snippetData.abilityKeyLookup[statKey]);
    })
        .filter(TypeScriptUtils.isNotNullOrUndefined);
    return Math.max(...modifierValues);
}
/**
 *
 * @param stats
 * @param snippetData
 */
export function deriveAbilityScoreValue(stats, snippetData) {
    const modifierValues = stats
        .map((statKey) => {
        validateAbilityKey(statKey);
        return AbilityAccessors.getScore(snippetData.abilityKeyLookup[statKey]);
    })
        .filter(TypeScriptUtils.isNotNullOrUndefined);
    return Math.max(...modifierValues);
}
/**
 *
 * @param contextData
 */
export function deriveLevelScaleDiceValue(contextData) {
    if (!contextData.levelScale) {
        throw new Error('No level scale data available');
    }
    if (contextData.levelScale.dice === null) {
        throw new Error('Has level scale, but no dice value available');
    }
    return DiceRenderers.renderDice(contextData.levelScale.dice);
}
/**
 *
 * @param contextData
 */
export function deriveLevelScaleFixedValue(contextData) {
    if (!contextData.levelScale) {
        throw new Error('No level scale data available');
    }
    if (contextData.levelScale.fixedValue === null) {
        throw new Error('Has level scale, but no numeric value available');
    }
    return contextData.levelScale.fixedValue;
}
/**
 *
 * @param tagValue
 * @param contextData
 */
export function deriveStringTagValue(tagValue, contextData) {
    const { type, params } = tagValue;
    switch (type) {
        case SnippetTagValueTypeEnum.SCALE_VALUE:
            return deriveLevelScaleDiceValue(contextData);
    }
    throw new Error('Unknown string tag');
}
/**
 *
 * @param tagValue
 * @param contextData
 * @param snippetData
 * @param proficiencyBonus
 */
export function deriveNumericTagValue(tagValue, contextData, snippetData, proficiencyBonus) {
    const { type, params } = tagValue;
    let value = 0;
    switch (type) {
        case SnippetTagValueTypeEnum.SAVE_DC:
            if (params.length < 1) {
                throw new Error('Save DC missing ability key');
            }
            return CharacterDerivers.deriveAttackSaveValue(snippetData.proficiencyBonus, deriveStatModifierValue(deriveListOptions(params[0]), snippetData));
        case SnippetTagValueTypeEnum.SPELL_ATTACK:
            if (params.length < 1) {
                throw new Error('Spell attack missing ability key');
            }
            return SpellDerivers.deriveSpellAttackModifier(snippetData.proficiencyBonus, deriveStatModifierValue(deriveListOptions(params[0]), snippetData));
        case SnippetTagValueTypeEnum.MODIFIER: {
            if (params.length < 1) {
                throw new Error('Modifier missing ability key');
            }
            return deriveStatModifierValue(deriveListOptions(params[0]), snippetData);
        }
        case SnippetTagValueTypeEnum.ABILITY_SCORE: {
            if (params.length < 1) {
                throw new Error('Ability score missing ability key');
            }
            return deriveAbilityScoreValue(deriveListOptions(params[0]), snippetData);
        }
        case SnippetTagValueTypeEnum.SCALE_VALUE:
            return deriveLevelScaleFixedValue(contextData);
        case SnippetTagValueTypeEnum.FIXED_VALUE:
            if (params.length < 1) {
                throw new Error('Fixed value is missing');
            }
            value = toNumber(params[0]);
            if (!isFinite(value)) {
                throw new Error('Fixed value is not a number');
            }
            return value;
        case SnippetTagValueTypeEnum.CLASS_LEVEL: {
            if (!contextData.classLevel) {
                throw new Error('No class level data available');
            }
            return contextData.classLevel;
        }
        case SnippetTagValueTypeEnum.CHARACTER_LEVEL: {
            return snippetData.xpInfo.currentLevel;
        }
        case SnippetTagValueTypeEnum.PROFICIENCY: {
            return snippetData.proficiencyBonus;
        }
        case SnippetTagValueTypeEnum.MAX_HP: {
            return snippetData.hitPointInfo.totalHp;
        }
        case SnippetTagValueTypeEnum.LIMITED_USE: {
            if (!contextData.limitedUse) {
                throw new Error('No limited use data available');
            }
            return LimitedUseDerivers.deriveMaxUses(contextData.limitedUse, snippetData.abilityLookup, snippetData.ruleData, proficiencyBonus);
        }
    }
}
/**
 *
 * @param str
 */
export function parseSnippetParams(str) {
    if (!str.length) {
        throw new Error('Invalid parameter');
    }
    const [key, ...params] = str.split(SnippetSymbolEnum.PARAMETER);
    if (!key.length) {
        throw new Error('Invalid parameter key');
    }
    return {
        key,
        params: params.filter(Boolean),
    };
}
/**
 *
 * @param str
 */
export function parseSnippetPostProcessParams(str) {
    const { key, params } = parseSnippetParams(str);
    if (!isSnippetPostProcessTypeEnum(key)) {
        throw new Error(`Unknown post process type: ${key}`);
    }
    return {
        type: key,
        params,
    };
}
/**
 *
 * @param str
 */
export function parseSnippetTagValue(str) {
    const { key, params } = parseSnippetParams(str);
    if (!isSnippetTagValueTypeEnum(key)) {
        throw new Error(`Unknown value type: ${key}`);
    }
    return {
        type: key,
        params,
    };
}
/**
 *
 * @param str
 */
export function parseSnippetValueModifierParams(str) {
    const { key, params } = parseSnippetParams(str);
    if (!isSnippetValueModifierTypeEnum(key)) {
        throw new Error(`Unknown value modifier type: ${key}`);
    }
    return {
        type: key,
        params,
    };
}
/**
 *
 * @param str
 */
export function parseRawTagInfo(str) {
    if (!str.length) {
        throw new Error('Invalid tag');
    }
    const [expression, rawPostProcess] = str.split(SnippetSymbolEnum.POST_PROCESS);
    if (!expression.length) {
        throw new Error('Missing tag expression');
    }
    let postProcess = rawPostProcess;
    if (rawPostProcess === undefined || rawPostProcess === '') {
        postProcess = null;
    }
    return {
        expression,
        postProcess,
    };
}
/**
 *
 * @param value
 * @param valueModifierString
 */
export function applyValueModifierString(value, valueModifierString) {
    let modifiedValue = value;
    const valueModifiers = deriveListOptions(valueModifierString);
    valueModifiers.forEach((valueModifierString) => {
        const { type, params } = parseSnippetValueModifierParams(valueModifierString);
        modifiedValue = deriveModifiedValue(modifiedValue, type, params);
    });
    return modifiedValue;
}
/**
 *
 * @param value
 * @param postProcessesString
 * @param intrinsicSignedNumber
 */
export function applyPostProcessString(value, postProcessesString, intrinsicSignedNumber = false) {
    if (typeof value === 'string' && !value) {
        return value;
    }
    let processedValue = value;
    let postProcesses = postProcessesString === null || !postProcessesString.length ? [] : deriveListOptions(postProcessesString);
    if (intrinsicSignedNumber &&
        !postProcesses.includes(SnippetPostProcessTypeEnum.SIGNED_NUMBER) &&
        !postProcesses.includes(SnippetPostProcessTypeEnum.UNSIGNED_NUMBER)) {
        postProcesses = [...postProcesses, SnippetPostProcessTypeEnum.SIGNED_NUMBER];
    }
    postProcesses.forEach((postProcessString, idx) => {
        const { type, params } = parseSnippetPostProcessParams(postProcessString);
        const isLast = idx + 1 === postProcesses.length;
        if (isLastPostProcessType(type) && !isLast) {
            throw new Error(`"${type}" post process must be the last to run`);
        }
        processedValue = derivePostProcessedValue(processedValue, type, params);
    });
    return processedValue;
}
/**
 *
 * @param value
 * @param modifierType
 * @param params
 */
export function deriveModifiedValue(value, modifierType, params) {
    switch (modifierType) {
        case SnippetValueModifierTypeEnum.MAX:
            if (params.length < 1) {
                throw new Error('Max value modifier is missing a number');
            }
            const maxValue = toNumber(params[0]);
            if (!isFinite(maxValue)) {
                throw new Error('Max value modifier is not a number');
            }
            return Math.min(maxValue, value);
        case SnippetValueModifierTypeEnum.MIN:
            if (params.length < 1) {
                throw new Error('Min value modifier is missing a number');
            }
            const minValue = toNumber(params[0]);
            if (!isFinite(minValue)) {
                throw new Error('Min value modifier is not a number');
            }
            return Math.max(minValue, value);
        case SnippetValueModifierTypeEnum.ROUND_UP:
            return Math.ceil(value);
        case SnippetValueModifierTypeEnum.ROUND_DOWN:
            return Math.floor(value);
    }
}
/**
 *
 * @param value
 * @param type
 * @param params
 */
export function derivePostProcessedValue(value, type, params) {
    switch (type) {
        case SnippetPostProcessTypeEnum.MAX:
            if (typeof value !== 'number') {
                throw new Error('Max post process must be used on number value');
            }
            if (params.length < 1) {
                throw new Error('Max post process is missing a number');
            }
            const maxValue = toNumber(params[0]);
            return Math.min(maxValue, value);
        case SnippetPostProcessTypeEnum.MIN:
            if (typeof value !== 'number') {
                throw new Error('Min post process must be used on number value');
            }
            if (params.length < 1) {
                throw new Error('Min post process is missing a number');
            }
            const minValue = toNumber(params[0]);
            return Math.max(minValue, value);
        case SnippetPostProcessTypeEnum.ROUND_DOWN:
            if (typeof value !== 'number') {
                throw new Error('Post process value being rounded is not a number');
            }
            return Math.floor(value);
        case SnippetPostProcessTypeEnum.ROUND_UP:
            if (typeof value !== 'number') {
                throw new Error('Post process value being rounded is not a number');
            }
            return Math.ceil(value);
        case SnippetPostProcessTypeEnum.SIGNED_NUMBER:
            if (typeof value !== 'number') {
                return value;
            }
            return FormatUtils.renderSignedNumber(value);
        case SnippetPostProcessTypeEnum.UNSIGNED_NUMBER:
            return value;
    }
}
/**
 *
 * @param haystack
 * @param operatorIdx
 * @param direction
 */
export function deriveExpressionValueFragmentSide(haystack, operatorIdx, direction) {
    const limit = direction == -1 ? 0 : haystack.length;
    let i = operatorIdx + direction;
    let term = '';
    while (i * direction <= limit) {
        if (isParsableNumber(haystack[i])) {
            if (direction == 1) {
                term = term + haystack[i];
            }
            else {
                term = haystack[i] + term;
            }
            i += direction;
        }
        else {
            return term;
        }
    }
    return term;
}
/**
 *
 * @param expression
 * @param operator
 */
export function deriveExpressionValueFragment(expression, operator) {
    if (hasOperator(expression, operator)) {
        const middleIndex = expression.indexOf(operator);
        const left = deriveExpressionValueFragmentSide(expression, middleIndex, -1);
        const right = deriveExpressionValueFragmentSide(expression, middleIndex, 1);
        const value = deriveExpressionValue(left, right, operator);
        return expression.replace(left + operator + right, value.toString());
    }
    return expression;
}
/**
 *
 * @param left
 * @param right
 * @param operator
 */
export function deriveExpressionValue(left, right, operator) {
    switch (operator) {
        case SnippetMathOperatorEnum.ADDITION:
            return parseFloat(left) + parseFloat(right);
        case SnippetMathOperatorEnum.MULTIPLICATION:
            return parseFloat(left) * parseFloat(right);
        case SnippetMathOperatorEnum.DIVISION:
            return parseFloat(left) / parseFloat(right);
        case SnippetMathOperatorEnum.SUBTRACTION:
            return parseFloat(left) - parseFloat(right);
    }
}
/**
 *
 * @param expression
 */
export function deriveExpression(expression) {
    while (hasOperator(expression, SnippetMathOperatorEnum.MULTIPLICATION) ||
        hasOperator(expression, SnippetMathOperatorEnum.DIVISION)) {
        let multiply = true;
        if (expression.indexOf(SnippetMathOperatorEnum.MULTIPLICATION) <
            expression.indexOf(SnippetMathOperatorEnum.DIVISION)) {
            multiply = hasOperator(expression, SnippetMathOperatorEnum.MULTIPLICATION);
        }
        else {
            multiply = !hasOperator(expression, SnippetMathOperatorEnum.DIVISION);
        }
        if (multiply) {
            expression = deriveExpressionValueFragment(expression, SnippetMathOperatorEnum.MULTIPLICATION);
        }
        else {
            expression = deriveExpressionValueFragment(expression, SnippetMathOperatorEnum.DIVISION);
        }
    }
    while (hasOperator(expression, SnippetMathOperatorEnum.ADDITION)) {
        expression = deriveExpressionValueFragment(expression, SnippetMathOperatorEnum.ADDITION);
    }
    return toNumber(expression);
}
/**
 *
 * @param tagExpression
 * @param contextData
 * @param snippetData
 * @param proficiencyBonus
 */
export function generateFragmentExpression(tagExpression, contextData, snippetData, proficiencyBonus) {
    let hasSignedValue = false;
    let updatedExpression = tagExpression;
    let match;
    while ((match = updatedExpression.match(tagValueRegExpr))) {
        const tagRaw = match[0];
        const tagValue = match[1];
        const tagValueModifier = match[2];
        const snippetTagValue = parseSnippetTagValue(tagValue);
        if (!hasSignedValue) {
            hasSignedValue = isSignedTagValueType(snippetTagValue.type);
        }
        let value = deriveNumericTagValue(snippetTagValue, contextData, snippetData, proficiencyBonus);
        if (tagValueModifier) {
            value = applyValueModifierString(value, tagValueModifier);
        }
        updatedExpression = updatedExpression.replace(tagRaw, value.toString());
    }
    return {
        original: tagExpression,
        expression: updatedExpression,
        hasSignedValue,
    };
}
/**
 *
 * @param rawSnippetTag
 * @param contextData
 * @param snippetData
 * @param proficiencyBonus
 */
export function generateSnippetTag(rawSnippetTag, contextData, snippetData, proficiencyBonus) {
    const { expression, postProcess } = parseRawTagInfo(deriveFormattedTag(rawSnippetTag));
    const snippetBaseTag = {
        raw: rawSnippetTag,
    };
    if (isValidStringTagValueType(rawSnippetTag, contextData)) {
        const snippetTagValue = parseSnippetTagValue(rawSnippetTag);
        return Object.assign(Object.assign({}, snippetBaseTag), { type: SnippetTagDataTypeEnum.STRING, value: deriveStringTagValue(snippetTagValue, contextData) });
    }
    throwMismatchedParens(rawSnippetTag);
    throwInvalidSnippetCharacters(rawSnippetTag);
    let hasSignedValue = false;
    let updatedExpression = expression;
    // solve grouped parens first
    let match;
    while ((match = updatedExpression.match(groupFragmentRegExpr))) {
        let groupFragmentRaw = match[0];
        let groupFragmentExpression = match[1];
        let groupFragmentValueModifier = match[2];
        let tagFragmentExpression = generateFragmentExpression(groupFragmentExpression, contextData, snippetData, proficiencyBonus);
        if (!hasSignedValue) {
            hasSignedValue = tagFragmentExpression.hasSignedValue;
        }
        let value = deriveExpression(tagFragmentExpression.expression);
        if (groupFragmentValueModifier) {
            value = applyValueModifierString(value, groupFragmentValueModifier);
        }
        updatedExpression = updatedExpression.replace(groupFragmentRaw, value.toString());
    }
    let fragmentExpression = generateFragmentExpression(updatedExpression, contextData, snippetData, proficiencyBonus);
    let value = deriveExpression(fragmentExpression.expression);
    if (!hasSignedValue) {
        hasSignedValue = fragmentExpression.hasSignedValue;
    }
    value = applyPostProcessString(value, postProcess, hasSignedValue);
    if (typeof value === 'number') {
        return Object.assign(Object.assign({}, snippetBaseTag), { type: SnippetTagDataTypeEnum.NUMBER, value });
    }
    else {
        return Object.assign(Object.assign({}, snippetBaseTag), { type: SnippetTagDataTypeEnum.STRING, value });
    }
}
/**
 *
 * @param id
 */
export function generateSnippetTagPlaceholder(id) {
    return `__SNIPPET_PLACEHOLDER_${id}__`;
}
/**
 *
 * @param snippetTag
 */
export function generateSnippetContentTagChunk(snippetTag) {
    return {
        type: SnippetContentChunkTypeEnum.TAG,
        data: snippetTag,
    };
}
/**
 *
 * @param str
 */
export function generateSnippetContentTextChunk(str) {
    return {
        type: SnippetContentChunkTypeEnum.TEXT,
        data: str,
    };
}
/**
 *
 * @param snippetString
 * @param placeholders
 * @param placeholderLookup
 */
export function generateSnippetContentChunks(snippetString, placeholders, placeholderLookup) {
    let chunks = [];
    placeholders.forEach((placeholder) => {
        let strIdx = snippetString.indexOf(placeholder);
        if (strIdx > -1) {
            let prePlaceholder = snippetString.slice(0, strIdx);
            let postPlaceholder = snippetString.slice(strIdx + placeholder.length);
            if (prePlaceholder) {
                chunks = [...generateSnippetContentChunks(prePlaceholder, placeholders, placeholderLookup)];
            }
            chunks = [...chunks, generateSnippetContentTagChunk(placeholderLookup[placeholder])];
            if (postPlaceholder) {
                chunks = [...chunks, ...generateSnippetContentChunks(postPlaceholder, placeholders, placeholderLookup)];
            }
        }
    });
    if (!chunks.length) {
        chunks.push(generateSnippetContentTextChunk(snippetString));
    }
    return chunks;
}
/**
 *
 * @param snippetString
 * @param contextData
 * @param snippetData
 * @param proficiencyBonus
 */
export function generateSnippetChunks(snippetString, contextData, snippetData, proficiencyBonus) {
    let match;
    let placeholderSnippetString = snippetString;
    let placeholders = [];
    let rawSnippetTags = [];
    // find all snippet tags and put placeholders
    while ((match = placeholderSnippetString.match(/\{\{([^\}]*)\}\}/))) {
        const rawSnippetTag = match[0];
        const rawSnippetTagContent = match[1];
        const placeholder = generateSnippetTagPlaceholder(rawSnippetTags.length);
        rawSnippetTags.push(rawSnippetTagContent);
        placeholders.push(placeholder);
        placeholderSnippetString = placeholderSnippetString.split(rawSnippetTag).join(placeholder);
    }
    // parse all snippet tags that were found
    let placeholderLookup = {};
    rawSnippetTags.forEach((rawSnippetTag, idx) => {
        const key = generateSnippetTagPlaceholder(idx);
        try {
            placeholderLookup[key] = generateSnippetTag(rawSnippetTag, contextData, snippetData, proficiencyBonus);
        }
        catch (error) {
            const errorSnippetTag = {
                type: SnippetTagDataTypeEnum.ERROR,
                raw: rawSnippetTag,
                value: error.message,
            };
            placeholderLookup[key] = errorSnippetTag;
        }
    });
    // break apart the original string into chunks
    return generateSnippetContentChunks(placeholderSnippetString, placeholders, placeholderLookup);
}
/**
 *
 * @param snippetString
 * @param contextData
 * @param snippetData
 * @param outputHtml
 * @param proficiencyBonus
 * @deprecated this will be moving to character component Snippet
 *
 */
export function convertSnippetToHtml(snippetString, contextData, snippetData, outputHtml = true, proficiencyBonus) {
    if (snippetString === null) {
        return null;
    }
    const snippetChunks = generateSnippetChunks(snippetString, contextData, snippetData, proficiencyBonus);
    const htmlChunkString = snippetChunks
        .map((contentChunk) => {
        switch (contentChunk.type) {
            case SnippetContentChunkTypeEnum.TAG:
                switch (contentChunk.data.type) {
                    case SnippetTagDataTypeEnum.ERROR:
                        const errorMessage = `${contentChunk.data.raw} - ${contentChunk.data.value}`;
                        return `<span class="ddbc-snippet__tag--error" title="${contentChunk.data.raw}">${errorMessage}</span>`;
                    case SnippetTagDataTypeEnum.NUMBER:
                        return `<Tooltip title="${contentChunk.data.raw}"><span class="ddbc-snippet__tag">${contentChunk.data.value.toLocaleString()}</span></Tooltip>`;
                    case SnippetTagDataTypeEnum.STRING:
                    default:
                        return `<Tooltip title="${contentChunk.data.raw}"><span class="ddbc-snippet__tag">${contentChunk.data.value}</span></Tooltip>`;
                }
            case SnippetContentChunkTypeEnum.TEXT:
            default:
                return contentChunk.data;
        }
    })
        .join('');
    return `<p>${htmlChunkString.replace(/\s*\n+?\s*\n*/g, '</p><p>')}</p>`;
}
/**
 *
 * @param snippetString
 * @param contextData
 * @param snippetData
 * @param proficiencyBonus
 */
export function convertSnippetToText(snippetString, contextData, snippetData, proficiencyBonus) {
    if (snippetString === null) {
        return null;
    }
    const snippetChunks = generateSnippetChunks(snippetString, contextData, snippetData, proficiencyBonus);
    return snippetChunks
        .map((contentChunk) => {
        switch (contentChunk.type) {
            case SnippetContentChunkTypeEnum.TAG:
                switch (contentChunk.data.type) {
                    case SnippetTagDataTypeEnum.ERROR:
                        let messageParts = [];
                        if (contentChunk.data.raw.trim()) {
                            messageParts.push(contentChunk.data.raw);
                        }
                        messageParts.push(contentChunk.data.value);
                        return messageParts.join(' - ');
                    case SnippetTagDataTypeEnum.NUMBER:
                        return contentChunk.data.value.toLocaleString();
                    case SnippetTagDataTypeEnum.STRING:
                    default:
                        return contentChunk.data.value;
                }
            case SnippetContentChunkTypeEnum.TEXT:
                return contentChunk.data;
            default:
            // not implemented
        }
    })
        .join('');
}
