const countProducts = (checkoutObj, product, date) => {
    if (date) {
        return product === 'all'
            ? Object.values(checkoutObj[date]).reduce((acc, curr) => {
                  acc += curr.length;
                  return acc;
              }, 0)
            : checkoutObj[date][product].length;
    } else {
        return Object.values(checkoutObj).reduce((acc, curr) => {
            acc += curr[product].length;
            return acc;
        }, 0);
    }
};

export default countProducts;
