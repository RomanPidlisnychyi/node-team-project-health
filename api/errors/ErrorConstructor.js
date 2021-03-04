class ErrorConstructor extends Error {
  constructor(status) {
    super(status);

    this.status = status;
    delete this.stack;
  }
}

module.exports = ErrorConstructor;
