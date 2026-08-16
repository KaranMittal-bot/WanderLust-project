const axios = require("axios");

async function geocode(location) {
    const response = await axios.get(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json`,
        {
            params: {
                key: process.env.MAPTILER_API_KEY
            }
        }
    );

    return response.data;
}

module.exports = geocode;
