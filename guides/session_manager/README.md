# Session Management

A guide about session management.

## MEPH and sessions

In MEPH session management is pretty "straight forward", either a login is required or it is not.

This is an example where login is required.

				sessionManager: {
                    'static': true,
                    type: 'MEPH.session.SessionManager',
                    config: {
                        loginRequired: true,
                        'authorizationPath': authorizationPath,
                        'clientId': 'AgressoMobile2',
                        'returnUri': signPath,
                        'state': 'state',
                        'scope': 'agresso',
                        'client_secret': 'secret',
                        'response_type': 'token'
                    }
                }

An example of no login required.


				sessionManager: {
                    'static': true,
                    type: 'MEPH.session.SessionManager',
                    config: {
                        loginRequired: false
                    }
                }