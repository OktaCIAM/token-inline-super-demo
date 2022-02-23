const request = require('request-promise');

module.exports.handler = async (event) => {
    console.debug('event:', JSON.stringify(event));
    if (!event.body) return;

    const defaultOIDCScopes = ["openid", "profile", "email", "address", "phone", "offline_access"];
    const supportedScopes = [
        "appliance", "app", "bank", "beer", "blood", "invoice",
        "coffee", "commerce", "company", "computer", "crypto",
        "color", "dessert", "device", "food", "restaurant", "subscription"
    ];

    try {
        const hookPayload = JSON.parse(event.body).data;
        const scopes = hookPayload.context.protocol.request.scope.split(" ");
        const isNotDefaultOIDCScope = scope => defaultOIDCScopes.indexOf(scope) === -1;
        const isSupportedScope = scope => supportedScopes.indexOf(scope) > -1;

        const uniqueScopes = scopes
            .filter(isNotDefaultOIDCScope)
            .filter(isSupportedScope);
      
        const apiUrls = uniqueScopes
            .map(item => `https://random-data-api.com/api/${item}/random_${item}`);

        const constructRequests = url => request(url);

        const pApiCalls = apiUrls
            .map(constructRequests)
        
        const responses = await Promise.all(pApiCalls);
        
        const commandValues = responses
            .reduce((acc, mockResponse, currentIndex) => {
                const data = JSON.parse(mockResponse);
                const prefix = uniqueScopes[currentIndex];

                const appendedCommands = [];
                // Iterate through response and map any string values
                Object.keys(data).forEach(key => {
                    if (typeof data[key] === "string") {
                        appendedCommands.push({
                            op: "add",
                            path: `/claims/${prefix}_${key}`,
                            value: data[key]
                        });
                    }
                });
                
                return [...acc, ...appendedCommands];
            }, []);
            
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                commands: [
                    {
                        type: 'com.okta.identity.patch',
                        value: commandValues
                    }
                ]
            })
        };

        return response;
    } catch (err) {
        console.log(err);
        return {
            statusCode: 400,
            body: err
        }
    }
};
