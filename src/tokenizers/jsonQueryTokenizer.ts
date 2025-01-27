import {BaseQueryTokenizer} from "./baseQueryTokenizer";
import {Token} from "../models";
import {FieldType, Logic, TokenType} from "../constants";
import {array, isArray, string} from "../utils";
import {newCouldNotBeTokenizedError} from "../errors";

export class JsonQueryTokenizer extends BaseQueryTokenizer {
    public tokenize(query: string): any[] {
        const data = JSON.parse(query);
        return this.tokenizeInternal(data);
    }

    private tokenizeInternal(data: any[]): any[] {
        if (data.length === 3) {
            const fieldString = String(data[0]).valueOf();
            const fieldMatch = this.findMatch(fieldString);

            let fieldToken;
            if (fieldMatch && fieldString.length === fieldMatch.value?.length) {
                fieldToken = this.createToken([], fieldMatch.tokenType, fieldMatch.value, fieldMatch.label);
            }

            if (!fieldToken || fieldToken.type === TokenType.TokenTypeNone) {
                fieldToken = new Token(TokenType.TokenTypeNone, fieldString);
            }

            const operatorString = String(data[1]).valueOf();
            const operatorMatch = this.findMatch(operatorString);

            let operatorToken;
            if (operatorMatch && operatorString.length === operatorMatch.value?.length) {
                operatorToken = this.createToken([fieldToken], operatorMatch.tokenType, operatorMatch.value, operatorMatch.label);
            }

            if (!operatorToken || operatorToken.type === TokenType.TokenTypeNone) {
                operatorToken = new Token(TokenType.TokenTypeNone, operatorString);
            }

            if (isArray(data[2])) {
                const valueTokens: Token[] = [];

                for (const v of array(data[2])) {
                    const valueString = string(v);
                    const valueMatch = this.findMatch(valueString);

                    let valueToken;
                    if (valueMatch) {
                        if (valueString.length === valueMatch.value?.length) {
                            valueToken = this.createToken([fieldToken, operatorToken], valueMatch.tokenType, valueMatch.value, valueMatch.label);
                        } else if (this.getFieldType(fieldString).name === FieldType.FieldTypeString.name) {
                            valueToken = new Token(TokenType.TokenTypeStringValue, valueString)
                        }
                    }

                    if (!valueToken || valueToken.type === TokenType.TokenTypeNone) {
                        valueToken = new Token(TokenType.TokenTypeNone, valueString);
                    }

                    valueTokens.push(valueToken);
                }

                return [
                    fieldToken,
                    operatorToken,
                    valueTokens
                ];
            } else {
                const valueString = string(data[2]);
                const valueMatch = this.findMatch(valueString);

                let valueToken;
                if (valueMatch) {
                    if (valueString.length === valueMatch.value?.length) {
                        valueToken = this.createToken([fieldToken, operatorToken], valueMatch.tokenType, valueMatch.value, valueMatch.label);
                    } else if (this.getFieldType(fieldString).name === FieldType.FieldTypeString.name) {
                        valueToken = new Token(TokenType.TokenTypeStringValue, valueString)
                    }
                }

                if (!valueToken || valueToken.type === TokenType.TokenTypeNone) {
                    valueToken = new Token(TokenType.TokenTypeNone, valueString);
                }

                return [
                    fieldToken,
                    operatorToken,
                    valueToken
                ];
            }
        }

        if (data.length === 2) {
            const logicString = string(data[0]);
            const logicMatch = this.findMatch(logicString);
            let logicToken = new Token(TokenType.TokenTypeNone, logicString);

            let logic = Logic.LogicUnknown;
            if (logicMatch) {
                logic = Logic.parseLogic(logicMatch.value);

                if (logic !== Logic.LogicUnknown) {
                    logicToken = new Token(logic.toTokenType(), logicMatch.value);
                }
            }

            if (!isArray(data[1])) {
                return [
                    logicToken,
                    new Token(TokenType.TokenTypeNone, data[1])
                ];
            }

            const expressionList = [];

            for (const v of array(data[1])) {
                const ex = this.tokenizeInternal(v as any[]);
                expressionList.push(ex);
            }

            return [
                logicToken,
                expressionList
            ];
        }

        throw newCouldNotBeTokenizedError();
    }
}
