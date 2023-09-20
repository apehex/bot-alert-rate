[![PyPI](https://img.shields.io/pypi/v/bot-alert-rate.svg)](https://pypi.org/project/bot-alert-rate)
[![npm](https://img.shields.io/npm/v/bot-alert-rate.svg)](https://www.npmjs.com/package/bot-alert-rate)

# bot-alert-rate
Tool that calculates bot alert rate. Bot alert rate measures the rareness of a specific alert relative to the number of blockchain activity. For example, a bot alert rate can be `# of bot alerts / # of contract creations in the last 24 hours`. Most [Forta threat detection bots](https://github.com/forta-network/starter-kits/tree/main) and community bots use this package to help identity anomalous alerts.

## Requirements

Create a [Zettablock account](https://app.zettablock.com/auth/login) to get an API key and set the following env variable:

* `ZETTABLOCK_API_KEY`

## Tutorials

### Python

#### Install

First install the package and run the python example
```bash
$ pip install bot_alert_rate
$ python example.py
```

#### Using the Zetta API

You can query the Zetta API to get the rate of a specific alert.
To do so, call `calculate_alert_rate` with the specifics of the alert:

```python
from bot_alert_rate import calculate_alert_rate, ScanCountType

# BSC
CHAIN_ID = 56
# sentiment analysis tx message bot - https://explorer.forta.network/bot/0xbdb84cba815103a9a72e66643fb4ff84f03f7c9a4faa1c6bb03d53c7115ddc4d
BOT_ID = "0xbdb84cba815103a9a72e66643fb4ff84f03f7c9a4faa1c6bb03d53c7115ddc4d"
ALERT_ID = "NEGATIVE-ANGER-TEXT-MESSAGE"


if __name__ == "__main__":
    alert_rate = calculate_alert_rate(
        CHAIN_ID, BOT_ID, ALERT_ID, ScanCountType.TX_WITH_INPUT_DATA_COUNT
    )
    print(alert_rate)
```

#### Using a local history

An alternative is to save a local history of the alerts in memory and use it to calculate the rates.
The main motivation is to improve performance by avoiding web requests.

To use it, just wrap `handle_block` / `handle_transaction` / `handle_alert` as follows:

```python
@alert_history(size=10000)
def handle_block(log: BlockEvent) -> list:
    pass

@alert_history(size=10000)
def handle_transaction(log: TransactionEvent) -> list:
    pass

@alert_history(size=10000)
def handle_alert(log: AlertEvent) -> list:
    pass
```

The decorator will automatically add the `anomaly_score` in the metadata of the `Finding` objects.
It will use the field `alert_id` from the `Finding` objects to identify them.

> make sure the history size is big enough to contain occurences of the bot alerts!

For example, if your bot triggers `ALERT-1` every 2k transactions and `ALERT-2` every 10k on average:
`@alert_history(size=100000)` would gather enough alerts to have a relevant estimation of the rate of both alerts.

### Typescript

First install the package and run the typescript example
```bash
$ npm i bot-alert-rate
$ ts-node example.ts
```

```typescript
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
```
