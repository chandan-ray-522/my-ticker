const axios = require("axios");
const fs = require("fs");

const holidays = require("./holidays.json");

async function run() {

    const now = new Date();

    const indiaTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const day = indiaTime.getDay();

    const currentDate = indiaTime.toISOString().split("T")[0];

    const hours = indiaTime.getHours();
    const minutes = indiaTime.getMinutes();

    const totalMinutes = hours * 60 + minutes;

    // MARKET TIME: 9:30 AM → 3:35 PM
    const marketOpen = 570;
    const marketClose = 935;

    // WEEKEND CHECK
    if (day === 0 || day === 6) {
        console.log("Weekend detected. Exiting...");
        return;
    }

    // NSE HOLIDAY CHECK
    if (holidays.includes(currentDate)) {
        console.log("NSE Holiday detected. Exiting...");
        return;
    }

    // MARKET HOURS CHECK
    if (totalMinutes < marketOpen || totalMinutes > marketClose) {
        console.log("Market closed. Exiting...");
        return;
    }

    // RANDOM DELAY (5–10 MIN)
    const delay = Math.floor(Math.random() * 300) + 300;

    console.log(`Waiting ${delay} seconds...`);

    await new Promise(r => setTimeout(r, delay * 1000));

    try {

        const response = await axios.get(
            "https://mboum-finance.p.rapidapi.com/v1/markets/quotes",
            {
                params: {
                    symbol:
                        "^NSEI,^NSEBANK,^BSESN"
                },

                headers: {
                    "x-rapidapi-key": process.env.RAPIDAPI_KEY,
                    "x-rapidapi-host": "mboum-finance.p.rapidapi.com",

                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",

                    "Accept": "application/json",

                    "Accept-Language": "en-US,en;q=0.9",

                    "Referer": "https://www.google.com/"
                }
            }
        );

        fs.writeFileSync(
            "market-data.json",
            JSON.stringify(response.data, null, 2)
        );

        console.log("Market data updated successfully!");

    } catch (error) {

        console.error(error.message);

    }
}

run();
