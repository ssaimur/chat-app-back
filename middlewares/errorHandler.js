const errorHandler = (err, req, res, next) => {
  // make the error scaffolding
  const error = {
    success: false,
  };

  // check for error code 11000
  if (err.code && err.code === 11000) {
    error.statusCode = 400;
    error.type = Object.keys(err.keyValue)[0];
    error.msg = `${error.type} already exists. Please provide another one`;
  }

  // check for validation error
  else if (err.name === 'ValidationError') {
    Object.values(err.errors).map((item) => {
      error.statusCode = 400;
      error.type = item.path;
      error.msg = item.message;
    });
  }

  // set the default error
  else {
    error.type = err.type || 'Unknown';
    error.msg = err.message || 'Something went wrong! Please Try again later';
    error.statusCode = err.statusCode || 500;
  }

  // console.log({
  //   Name: err.name,
  //   Msg: err.message,
  //   Code: err.code,
  //   Path: err.path,
  //   keypattern: err.keyPattern,
  //   keyValue: err.keyValue,
  // });
  console.log({ err });
  res.status(error.statusCode).json(error);
};

module.exports = errorHandler;
