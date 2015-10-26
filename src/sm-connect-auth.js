class SmConnectAuth {
  beforeRegister() {
    this.is = 'sm-connect-auth';

    this.properties = {
      email: String,
      password: String,
      error: {
        type: Number,
        notify: true,
        readOnly: true
      },
      authenticated: {
        type: Boolean,
        notify: true,
        readOnly: true
      },
      token: {
        type: String,
        observer: '_updateStorage'
      },
      busy: {
        type: Boolean,
        notify: true
      },
      _request: {
        computed: '_computeRequest(email, password)',
        value: () => {}
      },
      _server: {
        type: String,
        readOnly: true,
        value: simpla.config.server
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

    this._setAuthenticated(!!token);
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

    this._setError(code);

    // Stop their event, we want to set our own
    event.stopPropagation();
    this.fire('error', { code });
  }
}

Polymer(SmConnectAuth);
