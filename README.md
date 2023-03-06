[![PyPI](https://img.shields.io/pypi/v/bot-alert-rate.svg)](https://pypi.org/project/bot-alert-rate)

# bot-alert-rate
Tool that calculators bot alert rate

## Requirements

* Set `ZETTABLOCK_API_KEY` env variable. Contact Mariko to get this.

## Tutorials

### Python

First install the package and run the python example
```bash
$ pip install bot_alert_rate
$ python example.py
```

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

### Typescript

Coming soon!