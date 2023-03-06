import TTLCache from '@isaacs/ttlcache';

import { chainIds, datasetIds, queryPayload } from './constants';

export enum ScanCountType {
  ContractCreationCount,
  ContractInteractionCount,
  CustomScanCount,
  ErcApprovalAllCount,
  ErcApprovalCount,
  ErcTransferCount,
  LargeValueTransferCount,
  TransferCount,
  TxCount,
  TxWithInputDataCount,
}

// TTL set to 300 seconds.
const alertStatsCache = new TTLCache({ max: 100, ttl: 300000 });

const scanCountsCache = new TTLCache({ max: 100, ttl: 60000 });

async function getAlertCount(botId: string, alertId: string, chainId: number): Promise<any> {
  /* Gets bot alert count in the last 24 hours via Forta API */
  if (alertStatsCache.has(`${botId}-${alertId}-${chainId}`)) {
    return alertStatsCache.get(`${botId}-${alertId}-${chainId}`);
  }
  const statsApiUrl = `https://api.forta.network/stats/bot/${botId}/alerts?chainId=${chainId}`;
  const response = await fetch(statsApiUrl);
  const data = await response.json();
  let alertIdCounts = 1;
  if (alertId in data.alertIds) {
    try {
      alertIdCounts = parseInt(data.alertIds[alertId].count, 10);
      alertStatsCache.set(`${botId}-${alertId}-${chainId}`, alertIdCounts);
    } catch (err) {
      console.warn(`Error obtaining alert counts: ${err}`);
    }
  }
  return alertIdCounts;
}

const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

async function getScanCounts(chainId: number): Promise<any> {
  /* Gets all scan counts for given chain via Zettablock. */
  if (scanCountsCache.has(chainId)) {
    return scanCountsCache.get(chainId);
  }
  const datasetId = datasetIds[chainId];
  if (!datasetId.startsWith('sq')) {
    throw new Error(datasetId);
  }
  const scanCountsUrl = `https://api.zettablock.com/api/v1/dataset/${datasetId}/graphql`;
  const payload = queryPayload;
  const headers = {
    'Content-Type': 'application/json',
    'X-API-KEY': process.env.ZETTABLOCK_API_KEY || '',
  };
  let scanCounts = {};
  try {
    const response = await fetch(scanCountsUrl, { method: 'POST', body: JSON.stringify(payload), headers: headers });
    const data = await response.json();
    scanCounts = data['records'][0];
    scanCountsCache.set(chainId, scanCounts);
  } catch (err) {
    console.warn(`Error obtaining scan counts: ${err}`);
  }
  return scanCounts;
}

async function getScanCount(scanCountType: ScanCountType, chainId: number): Promise<number> {
  /* Gets scan count in the last 24 hours via Zettablock GraphQL API */
  const scanCounts = await getScanCounts(chainId);
  const scanCountName = camelToSnakeCase(scanCountType.toString());
  const scanCount = parseInt(scanCounts[scanCountName] || 1.0, 10);
  return Math.max(scanCount, 1.0);
}

export default async function calculateAlertRate(
  chainId: number,
  botId: string,
  alertId: string,
  scanCountType: ScanCountType,
  custom_scan_count?: number,
): Promise<number> {
  /* Calculate bot's alert rate in the last 24 hours.
    Alert Rate Formula: (bot alert count / scan_count )

    E.g.Bot A's alert rate with scan count type set to
    contract_creation_count on a chain X will be a quotient of 2 numbers:

    1. The bot alert count on chain X
    2. Contract creation counts on chain X

    Args:
    chain_id(int): EIP155 identifier of the chain
    bot_id(str): Forta bot ID
    alert_id(str): Forta bot alert id
    scan_count_type(ScanCountType): Type of scan count to use in the alert rate formula
    custom_scan_count(int): Custom scan count to use in the alert rate formula

    Returns:
    float: Bot's alert rate in the last 24 hours

    Raises:
    ValueError: If chain_id is not supported
    ValueError: If custom_scan_count is not an int
    ValueError: If custom_scan_count is less than alert_count
  */
  let scanCount;
  if (!chainIds.has(chainId)) {
    throw new Error(`Chain id ${chainId} is not supported.`);
  }
  const alertCount = await getAlertCount(botId, alertId, chainId);
  if (scanCountType === ScanCountType.CustomScanCount) {
    if (typeof custom_scan_count !== 'number') {
      throw new Error('custom_scan_count must be an int');
    }
    if (custom_scan_count < 1) {
      throw new Error('custom_scan_count must be greater than 0');
    }
    scanCount = custom_scan_count;
  } else {
    scanCount = await getScanCount(scanCountType, chainId);
  }
  return Math.min(alertCount / scanCount, 1.0);
}
