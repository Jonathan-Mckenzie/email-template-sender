import { getDifferenceOfArrays, IArrayDifference } from "./getDifferenceOfArrays";
import { IDynamicVariables } from "../model/emailService.interface";

export const processVariableChange = (dynamicVariableObj: IDynamicVariables, variableName: string, newValue: string) => {
	return {
		...dynamicVariableObj,
		[variableName]: newValue
	};
};

export const processVariableDifferences = (dynamicVariableObj: IDynamicVariables, nextDynamicVariables: string[]) => {
	// loop over
	const currentKeys = Object.keys(dynamicVariableObj);
	const difference: IArrayDifference = getDifferenceOfArrays(currentKeys, nextDynamicVariables);

	if (difference.hasAdded || difference.hasRemoved) {
		const nextObj = {...dynamicVariableObj};
		difference.removed.forEach( removedKey => {
			delete nextObj[removedKey];
		});
		difference.added.forEach( addedKey => {
			nextObj[addedKey] = '';
		});

		return nextObj;
	} else {
		return null;
	}
};

