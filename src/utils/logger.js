const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m"
};

function timestamp() {
    return new Date().toLocaleString();
}

module.exports = {

    info(message) {
        console.log(
            `${colors.green}[INFO]${colors.reset} ${timestamp()} - ${message}`
        );
    },

    warn(message) {
        console.log(
            `${colors.yellow}[WARN]${colors.reset} ${timestamp()} - ${message}`
        );
    },

    error(error) {
        console.error(
            `${colors.red}[ERROR]${colors.reset} ${timestamp()}`
        );

        console.error(error);
    },

    debug(message) {
        console.log(
            `${colors.cyan}[DEBUG]${colors.reset} ${timestamp()} - ${message}`
        );
    }

};