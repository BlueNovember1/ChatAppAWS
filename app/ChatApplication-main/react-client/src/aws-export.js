export const awsconfig = {
    Auth: {
        Cognito: {
            userPoolId: 'us-east-1_TwGZ5KEDS',
            userPoolClientId: '1f0gib7vjm03d640egj2qbs51e',
            signUpVerificationMethod: 'code',
            loginWith: {
                oauth: {
                    domain: 'us-east-1twgz5keds.auth.us-east-1.amazoncognito.com',
                    scopes: [
                        'email',
                        'phone',
                        'openid',
                    ],
                    redirectSignIn: ['http://localhost:3000/chatroom', 'https://chatapp.myddns.me/chatroom'],
                    redirectSignOut: ['http://localhost:3000/chatroom', 'https://chatapp.myddns.me/chatroom'],
                    responseType: 'code',
                },
            },
        },
    },
};
