import { PrerequisiteFailure } from "../types";

// Format a group of PrerequisiteFailures into a human-readable string
const formatReq = (group: Array<PrerequisiteFailure>) =>
  group.map(({ data }) => {
    const key = data.statKey?.toUpperCase() || "";
    const value = data.requiredValue;
    const amount = data.currentAmount === null ? "None" : data.currentAmount;

    return `${key} ${value} (${amount})`;
  });

// Loop through groups of PrerequisiteFailures and format them into a human-readable string
export const getMissingRequirements = (
  groups: Array<Array<PrerequisiteFailure>>
) => groups.map((group) => formatReq(group).join(", ")).join(" or ");
