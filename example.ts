import { ScanCountType } from "bot-alert-rate";
import calculateAlertRate from "bot-alert-rate";

// BSC
const chainId = 56;
// sentiment analysis tx message bot - https://explorer.forta.network/bot/0xbdb84cba815103a9a72e66643fb4ff84f03f7c9a4faa1c6bb03d53c7115ddc4d
const botId = "0xbdb84cba815103a9a72e66643fb4ff84f03f7c9a4faa1c6bb03d53c7115ddc4d";
const alertId = "NEUTRAL-NEUTRAL-TEXT-MESSAGE";


calculateAlertRate(
    chainId, botId, alertId, ScanCountType.TxWithInputDataCount
).then(alertRate => {
    console.log(alertRate);
}).catch((error) => {
    console.error(error);
});
