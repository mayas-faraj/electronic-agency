const filter = {
  searchFilter: (argsValue: string | undefined) => {
    if (argsValue == null) return undefined;
    else return { contains: argsValue };
  },

  dateFilter: (argsValue: string | undefined, isLessThan: boolean) => {
    if (argsValue == null) return undefined;
    else if (isLessThan) return { lte: new Date(argsValue) };
    else return { gt: new Date(argsValue) };
  },

  booleanFilter: (argsValue: boolean | undefined) => {
    if (argsValue == null) return undefined;
    else return argsValue;
  },
};

export default filter;