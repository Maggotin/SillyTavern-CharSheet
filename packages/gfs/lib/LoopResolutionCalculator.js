var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import pkg from 'lodash';
import { ExpressionOperators } from './types';
import { log, LOG_LEVEL } from './utils/log';
var get = pkg.get, set = pkg.set;
var ADDITIVE_IDENTITY = 0;
var MULTIPLICATIVE_IDENTITY = 1;
var ValueUnavailble = /** @class */ (function (_super) {
    __extends(ValueUnavailble, _super);
    function ValueUnavailble(message) {
        return _super.call(this, message) || this;
    }
    return ValueUnavailble;
}(Error));
function add(state, operands) {
    var sum = ADDITIVE_IDENTITY;
    for (var _i = 0, operands_1 = operands; _i < operands_1.length; _i++) {
        var operand = operands_1[_i];
        var value = Number(run(state, operand));
        log(LOG_LEVEL.INFO, ExpressionOperators.ADD + ": value " + value);
        if (isNaN(value)) {
            log(LOG_LEVEL.WARN, ExpressionOperators.ADD + ": This was not a number");
        }
        else {
            sum += value;
        }
    }
    log(LOG_LEVEL.INFO, ExpressionOperators.ADD + ": result " + sum);
    return sum;
}
function multiply(state, operands) {
    var product = MULTIPLICATIVE_IDENTITY;
    for (var _i = 0, operands_2 = operands; _i < operands_2.length; _i++) {
        var operand = operands_2[_i];
        var value = Number(run(state, operand));
        log(LOG_LEVEL.INFO, ExpressionOperators.ADD + ": value " + value);
        if (isNaN(value)) {
            log(LOG_LEVEL.WARN, ExpressionOperators.ADD + ": This was not a number");
        }
        else {
            product *= value;
        }
    }
    log(LOG_LEVEL.INFO, ExpressionOperators.MULTIPLY + ": result " + product);
    return product;
}
function keepHighest() {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i] = arguments[_i];
    }
    log(LOG_LEVEL.INFO, "KEEP HIGHEST: options " + String(rest));
    var result = Math.max.apply(Math, rest.filter(function (x) { return !isNaN(x); }));
    log(LOG_LEVEL.INFO, "KEEP HIGHEST: result " + result);
    return result;
}
function min(state, operands) {
    var options = operands.map(function (x) { return run(state, x); });
    log(LOG_LEVEL.INFO, ExpressionOperators.MIN + ": options " + String(options));
    var restult = Math.min.apply(Math, options);
    log(LOG_LEVEL.INFO, ExpressionOperators.MIN + ": result " + restult);
    return restult;
}
function max(state, operands) {
    var options = operands.map(function (x) { return run(state, x); });
    log(LOG_LEVEL.INFO, ExpressionOperators.MAX + ": options " + String(options));
    var restult = Math.max.apply(Math, options);
    log(LOG_LEVEL.INFO, ExpressionOperators.MAX + ": result " + restult);
    return restult;
}
function getNestedValue(state, path) {
    return get(state, path);
}
function setNestedValue(state, path, value) {
    if (isNaN(value)) {
        throw new Error("Value " + value + " is not a number");
    }
    set(state, path, value);
}
function dynamicValue(state, key) {
    key = key.flatMap(function (x) { return x.split('.'); });
    log(LOG_LEVEL.INFO, ExpressionOperators.DYNAMIC_VALUE + ": key " + key);
    if (!getNestedValue(state, key)) {
        throw new ValueUnavailble('key not available');
    }
    var result = getNestedValue(state, key);
    log(LOG_LEVEL.INFO, ExpressionOperators.DYNAMIC_VALUE + ": result " + result);
    return result;
}
function floor(state, operand) {
    return Math.floor(run(state, operand[0]));
}
function run(state, operand) {
    var result;
    switch (operand.operator) {
        case ExpressionOperators.STATIC_VALUE: {
            var values = operand.values;
            if (!Array.isArray(values)) {
                throw new Error('STATIC_VALUE has to be an array');
            }
            if (!values[0]) {
                throw new Error('STATIC_VALUE must have a value for index 0');
            }
            result = values[0];
            break;
        }
        case ExpressionOperators.DYNAMIC_VALUE: {
            var values = operand.values;
            if (!Array.isArray(values) || values.some(function (v) { return typeof v !== 'string'; })) {
                throw new Error('DYNAMIC_VALUE has to be array of string');
            }
            if (!values[0]) {
                throw new Error('DYNAMIC_VALUE must have a value for index 0');
            }
            result = dynamicValue(state, values);
            break;
        }
        case ExpressionOperators.ADD:
            if (!Array.isArray(operand.operands)) {
                throw new Error('ADD only supports an array');
            }
            result = add(state, operand.operands);
            break;
        case ExpressionOperators.MIN:
            if (!Array.isArray(operand.operands)) {
                throw new Error('MIN only supports an array');
            }
            result = min(state, operand.operands);
            break;
        case ExpressionOperators.MAX:
            if (!Array.isArray(operand.operands)) {
                throw new Error('MAX only supports an array');
            }
            result = max(state, operand.operands);
            break;
        case ExpressionOperators.FLOOR:
            if (!Array.isArray(operand.operands)) {
                throw new Error('FLOOR not correct format');
            }
            result = floor(state, operand.operands);
            break;
        case ExpressionOperators.MULTIPLY:
            if (!Array.isArray(operand.operands)) {
                throw new Error('MULTIPLY only supports an array');
            }
            result = multiply(state, operand.operands);
            break;
        default:
            throw new Error("run: Unknown operator " + operand.operator);
    }
    log(LOG_LEVEL.INFO, "Performing " + operand.operator + " :> Result " + result);
    return result;
}
function determineRequirements(operand) {
    switch (operand.operator) {
        case 'DYNAMIC_VALUE':
            if (!operand.values) {
                throw new Error('DYNAMIC_VALUE reqires values');
            }
            return [operand.values.join('.')];
        case 'STATIC_VALUE':
            return [];
        case 'MAX':
        case 'MIN':
        case 'ADD':
        case 'MULTIPLY':
        case 'FLOOR':
            if (!Array.isArray(operand.operands)) {
                throw new Error('no operands array');
            }
            var dynamicValueKeys = [];
            for (var _i = 0, _a = operand.operands; _i < _a.length; _i++) {
                var childOperand = _a[_i];
                dynamicValueKeys = dynamicValueKeys.concat(determineRequirements(childOperand));
            }
            return dynamicValueKeys;
        default:
            throw new Error("determineRequirements: Unknown operator " + operand.operator);
    }
}
function getRequiremets(expression) {
    if (!expression.operand) {
        throw new Error('getRequiremets: no operands');
    }
    var requirements = determineRequirements(expression.operand);
    return requirements.filter(function (x) { return x !== expression.target.join('.'); });
}
export function runProgram(_a) {
    var _b;
    var initState = _a.state, initExpressions = _a.expressions, initTargetResolutionPolicies = _a.targetResolutionPolicies, _c = _a.forceRun, forceRun = _c === void 0 ? false : _c;
    var state = initState !== null && initState !== void 0 ? initState : {};
    var expressions = initExpressions !== null && initExpressions !== void 0 ? initExpressions : [];
    var targetResolutionPolicies = initTargetResolutionPolicies !== null && initTargetResolutionPolicies !== void 0 ? initTargetResolutionPolicies : {};
    var reprocess = [];
    var _loop_1 = function (expression) {
        try {
            var requirements_1 = getRequiremets(expression);
            log(LOG_LEVEL.INFO, expression.target + " requires " + requirements_1);
            var shouldWait = expressions.filter(function (x) { return x !== expression; }).some(function (x) { return requirements_1.includes(x.target.join('.')); }) ||
                requirements_1.some(function (x) { return !getNestedValue(state, x.split('.')); });
            log(LOG_LEVEL.ERROR, "Can process " + ((_b = expression.statementId) !== null && _b !== void 0 ? _b : 'id') + " -> " + expression.target + " :> " + (shouldWait ? 'Not yet' : 'Yes'));
            if (!forceRun && shouldWait) {
                log(LOG_LEVEL.WARN, "Forcing " + expression.target + " to process");
                reprocess.push(expression);
            }
            else {
                var result = run(state, expression.operand);
                if (targetResolutionPolicies.hasOwnProperty(expression.target.join('.'))) {
                    switch (targetResolutionPolicies[expression.target.join('.')]) {
                        case 'KEEP_HIGHEST':
                            setNestedValue(state, expression.target, keepHighest(getNestedValue(state, expression.target), result));
                            break;
                        default:
                            throw new Error('resolution policy not implemented');
                    }
                }
                else {
                    log(LOG_LEVEL.INFO, "Applying " + expression.target + " = " + result);
                    setNestedValue(state, expression.target, result);
                }
            }
        }
        catch (err) {
            if (err instanceof ValueUnavailble) {
                reprocess.push(expression);
            }
            else {
            }
        }
    };
    for (var _i = 0, expressions_1 = expressions; _i < expressions_1.length; _i++) {
        var expression = expressions_1[_i];
        _loop_1(expression);
    }
    if (!forceRun && reprocess.length && reprocess.length === expressions.length) {
        // throw new Error('cannot resolve'); // Tthis is a circular dependency so just run now
        return runProgram({ state: state, expressions: reprocess, targetResolutionPolicies: targetResolutionPolicies, forceRun: true });
    }
    if (!forceRun && reprocess.length) {
        return runProgram({ state: state, expressions: reprocess, targetResolutionPolicies: targetResolutionPolicies });
    }
    return state;
}
export function initProgram(_a) {
    var _b;
    var initState = _a.state, initExpressions = _a.expressions, initTargetResolutionPolicies = _a.targetResolutionPolicies;
    var state = initState !== null && initState !== void 0 ? initState : {};
    var statements = initExpressions !== null && initExpressions !== void 0 ? initExpressions : [];
    var targetResolutionPolicies = initTargetResolutionPolicies !== null && initTargetResolutionPolicies !== void 0 ? initTargetResolutionPolicies : {};
    //TODO: consider a init program to run once
    // const sorted = expressions.sort((a: Statement, b: Statement) => (a?.precedence ?? 0) - (b?.precedence ?? 0));
    var getSections = function () { return ({
        noDynamicValues: [],
        onlySelfDynamics: [],
        complexDynamics: [],
    }); };
    var statementMap = {};
    for (var i = 0; i < statements.length; i++) {
        var statement = statements[i];
        var reqs = determineRequirements(statement.operand);
        statementMap[statement.precedence] = (_b = statementMap[statement.precedence]) !== null && _b !== void 0 ? _b : getSections();
        var sections = statementMap[statement.precedence];
        if (reqs.length === 0) {
            sections.noDynamicValues.push(statement);
        }
        else if (reqs.length === 1 && reqs.includes(statement.target.join('.'))) {
            sections.onlySelfDynamics.push(statement);
        }
        else if (reqs.length > 1 && reqs.includes(statement.target.join('.'))) {
            sections.onlySelfDynamics.push(statement);
        }
        else {
            sections.complexDynamics.push(statement);
        }
    }
    // const sections = sorted.reduce(
    //     (sections, expression) => {
    //         const reqs = determineRequirements(expression.operand);
    //         if (reqs.length === 0) {
    //             sections.noDynamicValues.push(expression);
    //         } else if (reqs.length === 1 && reqs.includes(expression.target)) {
    //             sections.onlySelfDynamics.push(expression);
    //         } else {
    //             sections.complexDynamics.push(expression);
    //         }
    //         return sections;
    //     },
    //     {
    //         noDynamicValues: [] as Statement[],
    //         onlySelfDynamics: [] as Statement[],
    //         complexDynamics: [] as Statement[],
    //     },
    // );
    var precedences = Object.keys(statementMap).sort(function (a, b) { return Number(a) - Number(b); });
    for (var i = 0; i < precedences.length; i++) {
        var precedence = Number(precedences[i]);
        var precedenceMap = statementMap[precedence];
        state = runProgram({ state: state, expressions: precedenceMap.noDynamicValues, targetResolutionPolicies: targetResolutionPolicies });
        state = runProgram({ state: state, expressions: precedenceMap.onlySelfDynamics, targetResolutionPolicies: targetResolutionPolicies });
        state = runProgram({ state: state, expressions: precedenceMap.complexDynamics, targetResolutionPolicies: targetResolutionPolicies });
    }
    log(LOG_LEVEL.INFO, 'STATE:');
    log(LOG_LEVEL.INFO, JSON.stringify(state, null, 2));
    return state;
}
// runProgram(dynamicAddTest);
