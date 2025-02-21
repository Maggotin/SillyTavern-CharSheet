import { log, LOG_LEVEL } from './utils/log';
var FeaturePreprocessor = /** @class */ (function () {
    function FeaturePreprocessor() {
        this.featureMap = new Map();
        this.statementList = [];
    }
    FeaturePreprocessor.prototype.process = function (_a) {
        var rootFeatureIds = _a.rootFeatureIds, featureMap = _a.featureMap;
        this.featureMap = featureMap;
        // Add statements from root level features, and their subfeatures.
        for (var _i = 0, rootFeatureIds_1 = rootFeatureIds; _i < rootFeatureIds_1.length; _i++) {
            var featureId = rootFeatureIds_1[_i];
            var feature = featureMap.get(featureId);
            if (feature === undefined) {
                log(LOG_LEVEL.ERROR, "Feature " + featureId + " not found");
            }
            else {
                this.deriveStatements(feature, null, null);
            }
        }
        return this.statementList;
    };
    FeaturePreprocessor.prototype.deriveStatements = function (feature, featureReferenceId, parameters) {
        for (var _i = 0, _a = feature.statements; _i < _a.length; _i++) {
            var statement = _a[_i];
            // Make a deep copy of the statement. The copy gets the featureReferenceId set.
            // Also, the engine will be modifying the expressions in the statements, so a deep copy is needed.
            var statementCopy = JSON.parse(JSON.stringify(statement));
            if (featureReferenceId !== null && parameters !== null) {
                // targets might be parameterized
                statementCopy.target = this.evaluateStatementTarget(statementCopy.target, parameters);
                // then dive into the statement's expressions to evaluate parameterized static and dynamic values
                this.processExpression(statementCopy.operand, parameters);
            }
            this.statementList.push(statementCopy);
        }
        for (var _b = 0, _c = feature.subfeatures; _b < _c.length; _b++) {
            var featureReference = _c[_b];
            // the featureReference might also be parameterized, in order to pass parameters down multiple levels
            var referenceCopy = JSON.parse(JSON.stringify(featureReference)); // copy might not be needed
            if (parameters !== null) {
                this.processReferenceParameters(referenceCopy.parameters, parameters);
            }
            var subfeatureDef = this.featureMap.get(referenceCopy.featureId);
            if (subfeatureDef === undefined) {
                log(LOG_LEVEL.ERROR, "Feature " + referenceCopy.featureId + " not found");
            }
            else {
                this.deriveStatements(subfeatureDef, referenceCopy.featureReferenceId, referenceCopy.parameters);
            }
        }
    };
    FeaturePreprocessor.prototype.evaluateStatementTarget = function (target, parameters) {
        var newTargetList = [];
        for (var i = 0; i < target.length; i++) {
            var part = target[i];
            if (typeof part === 'string' && part.startsWith('$inputs.')) {
                var evaluated = this.lookupInput(part, parameters);
                if (evaluated === null || evaluated.some(function (x) { return typeof x !== 'string'; })) {
                    throw new Error('Parameter values for dynamic targets must be strings');
                }
                newTargetList.push.apply(newTargetList, evaluated);
            }
            else {
                newTargetList.push(part);
            }
        }
        return newTargetList;
    };
    // Some duplicated code here. The difference is that targets must be strings,
    // while expression parameters might be numbers.
    FeaturePreprocessor.prototype.evaluateExpressionValues = function (values, parameters) {
        // An array of strings might turn into an array of numbers, if the parameter values are numbers.
        // I don't like this :O
        var evaluatedValues = [];
        for (var i = 0; i < values.length; i++) {
            var part = values[i];
            if (typeof part === 'string' && part.startsWith('$inputs.')) {
                var evaluated = this.lookupInput(part, parameters);
                if (evaluated === null) {
                    throw new Error('Parameter values for static or dynamic values cannot be null');
                }
                evaluatedValues.push.apply(evaluatedValues, evaluated);
            }
            else {
                evaluatedValues.push(part);
            }
        }
        if (evaluatedValues.every(function (x) { return typeof x === 'string'; })) {
            return evaluatedValues;
        }
        if (evaluatedValues.every(function (x) { return typeof x === 'number'; })) {
            return evaluatedValues;
        }
        throw new Error('Parameter value type needs to match the type of non-parameterized values');
    };
    FeaturePreprocessor.prototype.lookupInput = function (inputName, parameters) {
        var splits = inputName.split('$inputs.');
        if (splits.length !== 2) {
            throw new Error('Invalid $inputs format');
        }
        var key = splits[1];
        if (!parameters.hasOwnProperty(key)) {
            throw new Error("Parameters is missing key " + key);
        }
        return parameters[key]; // TODO: Check to make sure the parameter is there
    };
    FeaturePreprocessor.prototype.processExpression = function (expression, parameters) {
        // If the expression has values, evaluate any $inputs
        if (expression.values !== null && expression.values.length) {
            expression.values = this.evaluateExpressionValues(expression.values, parameters);
        }
        // If the expression has operands, recurse!
        if (expression.operands !== null && expression.operands.length) {
            for (var _i = 0, _a = expression.operands; _i < _a.length; _i++) {
                var operand = _a[_i];
                this.processExpression(operand, parameters);
            }
        }
    };
    FeaturePreprocessor.prototype.processReferenceParameters = function (childParameters, parentParameters) {
        // FeatureParameters is Record<string, Array<string> | Array<number> | null>
        var parameterKeys = Object.keys(childParameters);
        for (var _i = 0, parameterKeys_1 = parameterKeys; _i < parameterKeys_1.length; _i++) {
            var key = parameterKeys_1[_i];
            var parameterValues = childParameters[key];
            if (parameterValues !== null) {
                childParameters[key] = this.evaluateExpressionValues(parameterValues, parentParameters);
            }
        }
    };
    return FeaturePreprocessor;
}());
export { FeaturePreprocessor };
