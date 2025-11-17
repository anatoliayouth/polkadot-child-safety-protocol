import { formatAddress, validatePolkadotAddress, parseAddressList } from '../../hooks/useMockContracts';

describe('useMockContracts utilities', () => {
  describe('formatAddress', () => {
    it('formats a Polkadot address by truncating middle characters', () => {
      const address = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
      const formatted = formatAddress(address);
      expect(formatted).toBe('5Grwva...utQY');
    });

    it('formats with custom start and end lengths', () => {
      const address = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
      const formatted = formatAddress(address, 8, 6);
      expect(formatted).toBe('5GrwvaEF...GKutQY');
    });

    it('returns the original address if it is too short', () => {
      const short = 'short';
      expect(formatAddress(short)).toBe('short');
    });

    it('handles empty strings', () => {
      expect(formatAddress('')).toBe('');
    });
  });

  describe('validatePolkadotAddress', () => {
    it('validates a properly formatted Polkadot address', () => {
      const validAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
      expect(validatePolkadotAddress(validAddress)).toBe(true);
    });

    it('rejects addresses not starting with 5', () => {
      const invalid = '3GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
      expect(validatePolkadotAddress(invalid)).toBe(false);
    });

    it('rejects addresses with incorrect length', () => {
      const tooShort = '5GrwvaEF5zXb26Fz';
      expect(validatePolkadotAddress(tooShort)).toBe(false);
    });

    it('rejects addresses with invalid characters', () => {
      const invalidChars = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQ0';
      expect(validatePolkadotAddress(invalidChars)).toBe(false);
    });
  });

  describe('parseAddressList', () => {
    it('parses a comma-separated list of addresses', () => {
      const input = '5ABC...,5DEF...,5GHI...';
      const result = parseAddressList(input);
      expect(result).toEqual(['5ABC...', '5DEF...', '5GHI...']);
    });

    it('trims whitespace from addresses', () => {
      const input = '  5ABC...  , 5DEF... ,  5GHI...  ';
      const result = parseAddressList(input);
      expect(result).toEqual(['5ABC...', '5DEF...', '5GHI...']);
    });

    it('filters out empty strings', () => {
      const input = '5ABC...,,5DEF...';
      const result = parseAddressList(input);
      expect(result).toEqual(['5ABC...', '5DEF...']);
    });

    it('handles an empty string', () => {
      expect(parseAddressList('')).toEqual([]);
    });

    it('handles a single address', () => {
      const input = '5ABC...';
      expect(parseAddressList(input)).toEqual(['5ABC...']);
    });
  });
});
