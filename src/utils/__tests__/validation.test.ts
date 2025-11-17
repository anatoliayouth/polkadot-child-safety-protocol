import { ValidationRules, createValidator } from '../validation';

describe('ValidationRules', () => {
  describe('required', () => {
    it('returns error for empty string', () => {
      const error = ValidationRules.required('');
      expect(error).toBe('This field is required');
    });

    it('returns error for undefined', () => {
      const error = ValidationRules.required(undefined);
      expect(error).toBe('This field is required');
    });

    it('returns error for null', () => {
      const error = ValidationRules.required(null as any);
      expect(error).toBe('This field is required');
    });

    it('returns undefined for non-empty string', () => {
      const error = ValidationRules.required('value');
      expect(error).toBeUndefined();
    });

    it('returns undefined for non-zero number', () => {
      const error = ValidationRules.required(5);
      expect(error).toBeUndefined();
    });
  });

  describe('minLength', () => {
    it('returns error for string shorter than min', () => {
      const validator = ValidationRules.minLength(5);
      const error = validator('abc');
      expect(error).toBe('Must be at least 5 characters');
    });

    it('returns undefined for string meeting min length', () => {
      const validator = ValidationRules.minLength(5);
      const error = validator('abcde');
      expect(error).toBeUndefined();
    });

    it('returns undefined for string exceeding min length', () => {
      const validator = ValidationRules.minLength(5);
      const error = validator('abcdefgh');
      expect(error).toBeUndefined();
    });
  });

  describe('maxLength', () => {
    it('returns error for string longer than max', () => {
      const validator = ValidationRules.maxLength(5);
      const error = validator('abcdef');
      expect(error).toBe('Must be no more than 5 characters');
    });

    it('returns undefined for string meeting max length', () => {
      const validator = ValidationRules.maxLength(5);
      const error = validator('abcde');
      expect(error).toBeUndefined();
    });

    it('returns undefined for string shorter than max', () => {
      const validator = ValidationRules.maxLength(5);
      const error = validator('abc');
      expect(error).toBeUndefined();
    });
  });

  describe('email', () => {
    it('returns error for invalid email', () => {
      const error = ValidationRules.email('invalid-email');
      expect(error).toBe('Must be a valid email address');
    });

    it('returns undefined for valid email', () => {
      const error = ValidationRules.email('user@example.com');
      expect(error).toBeUndefined();
    });

    it('returns undefined for empty string', () => {
      const error = ValidationRules.email('');
      expect(error).toBeUndefined();
    });
  });

  describe('address', () => {
    it('returns error for invalid Polkadot address', () => {
      const error = ValidationRules.address('invalid-address');
      expect(error).toBe('Must be a valid blockchain address');
    });

    it('returns undefined for valid Polkadot address', () => {
      const error = ValidationRules.address('1AAAApHg8q8F4Ky78iP8f6h3nVwj4RN3V8gS6JjFxA');
      expect(error).toBeUndefined();
    });

    it('returns undefined for empty string', () => {
      const error = ValidationRules.address('');
      expect(error).toBeUndefined();
    });
  });

  describe('did', () => {
    it('returns error for invalid DID', () => {
      const error = ValidationRules.did('not-a-did');
      expect(error).toBe('Must be a valid DID (Decentralized Identifier)');
    });

    it('returns undefined for valid DID', () => {
      const error = ValidationRules.did('did:kilt:4r1WkS3t8rbCb11n6SsS7JBs84nqxF84K1cLvPWPF6Jf');
      expect(error).toBeUndefined();
    });

    it('returns undefined for empty string', () => {
      const error = ValidationRules.did('');
      expect(error).toBeUndefined();
    });
  });
});

describe('createValidator', () => {
  it('creates validator function that validates multiple fields', () => {
    const validator = createValidator({
      name: ValidationRules.required,
      email: ValidationRules.email,
    });

    const errors = validator({ name: '', email: 'invalid' });

    expect(errors.name).toBe('This field is required');
    expect(errors.email).toBe('Must be a valid email address');
  });

  it('returns empty object when all validations pass', () => {
    const validator = createValidator({
      name: ValidationRules.required,
      email: ValidationRules.email,
    });

    const errors = validator({ name: 'John', email: 'john@example.com' });

    expect(errors).toEqual({});
  });

  it('handles array of validators for single field', () => {
    const validator = createValidator({
      password: [ValidationRules.required, ValidationRules.minLength(8)],
    });

    const errors1 = validator({ password: '' });
    expect(errors1.password).toBe('This field is required');

    const errors2 = validator({ password: 'short' });
    expect(errors2.password).toBe('Must be at least 8 characters');

    const errors3 = validator({ password: 'longenough' });
    expect(errors3).toEqual({});
  });

  it('stops validation at first error for field', () => {
    const validator = createValidator({
      text: [ValidationRules.required, ValidationRules.minLength(10)],
    });

    const errors = validator({ text: '' });
    // Should have the error from the first validator, not the second
    expect(errors.text).toBe('This field is required');
  });
});
