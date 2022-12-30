const pathReducer = (path, location) => {
  return path.reduce((prev, cur) => prev[cur], location);
};

module.exports = pathReducer;
