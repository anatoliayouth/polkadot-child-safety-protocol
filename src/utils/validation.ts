export const ValidationRules = {
  required: (value: string | number | undefined): string | undefined => {
    if (value === undefined || value === '' || value === null) {
      return 'This field is required';
    }
    return undefined;
  },

  minLength: (min: number) => (value: string | undefined): string | undefined => {
    if (!value || value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return undefined;
  },

  maxLength: (max: number) => (value: string | undefined): string | undefined => {
    if (value && value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return undefined;
  },

  email: (value: string | undefined): string | undefined => {
    if (!value) return undefined;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Must be a valid email address';
    }
    return undefined;
  },

  address: (value: string | undefined): string | undefined => {
    if (!value) return undefined;
    // Polkadot/Substrate address validation (simplified)
    if (!value.match(/^[1-5KL][1-9A-HJ-NP-Z]{46}$/) && !value.match(/^0x[a-fA-F0-9]{40}$/)) {
      return 'Must be a valid blockchain address';
    }
    return undefined;
  },

  did: (value: string | undefined): string | undefined => {
    if (!value) return undefined;
    // Basic DID validation (did:kilt:...)
    if (!value.startsWith('did:')) {
      return 'Must be a valid DID (Decentralized Identifier)';
    }
    return undefined;
  },
};

export function createValidator(rules: { [key: string]: (value: any) => string | undefined | (string | undefined)[] }) {
  return (values: any) => {
    const errors: { [key: string]: string } = {};

    for (const [field, fieldRules] of Object.entries(rules)) {
      const validators = Array.isArray(fieldRules) ? fieldRules : [fieldRules];
      for (const validator of validators) {
        if (typeof validator === 'function') {
          const error = validator(values[field]);
          if (error) {
            errors[field] = error;
            break;
          }
        }
      }
    }

    return errors;
  };
}
