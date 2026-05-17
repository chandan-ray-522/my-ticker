const axios = require("axios");
const fs = require("fs");

async function run() {

    const delay =
        Math.floor(Math.random() * 1800) + 300;

    console.log(`Waiting ${delay} seconds...`);

    await new Promise(r =>
        setTimeout(r, delay * 1000)
    );

    try {

        const response = await axios.get(
            "https://mboum-finance.p.rapidapi.com/v1/markets/quotes",
            {

                params: {
                    symbol:
                        "^NSEI,^NSEBANK,^BSESN"
                },

                headers: {

                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",

                    "Accept":
                        "application/json",

                    "Accept-Language":
                        "en-US,en;q=0.9",

                    "Referer":
                        "https://www.google.com/",

                    "Origin":
                        "https://rapidapi.com",

                    "x-rapidapi-host":
                        "mboum-finance.p.rapidapi.com",

                    "x-rapidapi-key":
                        process.env.RAPIDAPI_KEY
                }
            }
        );

        fs.writeFileSync(
            "market-data.json",
            JSON.stringify(
                response.data,
                null,
                2
            )
        );

        console.log(
            "Market data updated successfully"
        );

    } catch (err) {

        console.error(
            "Error:",
            err.message
        );

    }
}

run();
