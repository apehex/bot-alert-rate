import { ScanCountType } from '../index';
import calculateAlertRate from '../index';

describe('bot alert rate', () => {
  let botId: string;
  let alertId: string;
  let customValue: number;

  beforeAll(() => {
    botId = 'test_bot';
    alertId = 'TEST-ALERT';
    customValue = 1000;
  });

  test.each([1, 56, 42161, 137, 43114, 10, 250])(
    'should calculate alert rate with custom scan count for %p',
    async (chainId: number) => {
      expect(await calculateAlertRate(chainId, botId, alertId, ScanCountType.CustomScanCount, customValue)).toBe(0.001);
    },
  );
});
