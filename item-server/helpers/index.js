module.exports = {
    getErrMessage: (err) => {
        if (err.indexOf("`name` is required") !== -1 ) {
            return "name can't be empty";
        } else if (err.indexOf("source` is required") !== -1 ) {
            return "source can't be empty";
        } else {
            return '';
        }
    },
};
