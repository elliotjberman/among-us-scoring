const sortCaseInsensitive = (a,b, reverse=false) => {
  const factor = reverse ? -1 : 1;
  return factor * a.toLowerCase().localeCompare(b.toLowerCase());
}

const sortNumbers = (a, b, reverse=false) => {
  const factor = reverse ? -1 : 1;
  if (a > b) {
    return -1*factor;
  }
  if (a < b) {
    return 1*factor;
  }
  // a must be equal to b
  return 0;
}

export {
  sortCaseInsensitive,
  sortNumbers
}
