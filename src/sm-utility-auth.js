class SmUtilityAuth {
  beforeRegister() {
    this.is = 'sm-utility-auth';

    this.properties = {
      email: String,
      password: String,
      error: {
        type: Number,
        notify: true
      },
      authenticated: {
        type: Boolean,
        notify: true
      },
      token: {
        type: String,
        observer: '_updateStorage',
        notify: true
      },
      busy: {
        type: Boolean,
        notify: true
      },
      _server: {
        type: String,
        value: simpla.config.server
      },
      _request: {
        computed: '_computeRequest(email, password)',
        value: () => {}
      },
      _url: {
        computed: '_computeUrl(_server)'
      }
    }
  }

  login() {
    this.$.ajax.generateRequest();
  }

  logout() {
    this.token = null;
  }

  _updateStorage(token) {
    if (token) {
      window.localStorage.setItem('sm-token', token);
    } else {
      window.localStorage.removeItem('sm-token');
    }

    this.authenticated = !!token;
  }

  _computeRequest(email, password) {
    return { email, password };
  }

  _computeUrl(server) {
    return server ? `${server}/login` : '';
  }

  _handleSuccess({ detail: request }) {
    this.token = request.response.token;
  }

  _handleError(event) {
    const code = event.detail.request.status;

    this.error = code;

    // Stop their event, we want to set our own
    event.stopPropagation();
    this.fire('error', { code });
  }

  _computeHeaders(token) {
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
}

Polymer(SmUtilityAuth);
