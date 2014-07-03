# Session Management

A guide about session management.

## U4M and sessions

In U4M session management is pretty "straight forward", either a login is required or it is not.  Currently, the session manager is geared towards the public api web services created by the Platform team. So, in the future expect  more development in this area.

This is an example where login is required.

				sessionManager: {
                    'static': true,
                    type: 'U4M.session.SessionManager',
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
                    type: 'U4M.session.SessionManager',
                    config: {
                        loginRequired: false
                    }
                }