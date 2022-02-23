const request = require('request-promise');

module.exports.handler = async (event) => {
    console.log('event:', JSON.stringify(event));
    if (!event.body) return;

    try {
        const hookPayload = JSON.parse(event.body).data;
        const {ipAddress} = hookPayload.context.request;
        const geoLocation = await request(`https://api.freegeoip.app/json/${ipAddress}?apikey=${process.env['geoApiKey']}`);
        const { region_name, city } = JSON.parse(geoLocation);
        const weather = await request(`https://weatherdbi.herokuapp.com/data/weather/${city},${region_name}`);
        const { region, currentConditions } = JSON.parse(weather);
    
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                commands: [
                    {
                        type: 'com.okta.identity.patch',
                        value: [
                            {
                                op: "add",
                                path: "/claims/region",
                                value: region
                            },
                            {
                                op: "add",
                                path: "/claims/weatherTemp",
                                value: currentConditions.temp.c
                            },
                            {
                                op: "add",
                                path: "/claims/weather_icon_url",
                                value: currentConditions.iconURL
                            },
                            {
                                op: "add",
                                path: "/claims/weather_wind",
                                value: currentConditions.wind.km
                            },
                            {
                                op: "add",
                                path: "/claims/weather_precip",
                                value: currentConditions.precip
                            },
                            {
                                op: "add",
                                path: "/claims/weather_humidity",
                                value: currentConditions.humidity
                            }
                        ]
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
