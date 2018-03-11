class Response {
  static OK(res, data = [], message = '') {
    res.status(200).json({ status: 200, data, message });
  }

  static CREATED(res, data = []) {
    res.status(201).json({ status: 201, data });
  }

  static NOT_FOUND(res, err = {}) {
    err = err !== {} ? err : 'The requested resource could not be located';
    res.status(404).json({ status: 404, err });
  }

  static ERROR(res, err = {}) {
    err =
      err !== {}
        ? err
        : 'A server error occurred whilst processing the request';
    res.status(500).json({ status: 500, err });
  }

  static FORBIDDEN(res, err = {}) {
    err = err !== {} ? err : 'Access is forbidden to the requested resource';
    res.status(403).json({ status: 403, err });
  }

  constructor(res, status, data = [], message = '') {
    res.status(status).json({ status, data, message });
  }
}

module.exports = Response;
