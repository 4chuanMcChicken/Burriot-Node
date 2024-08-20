interface DenomMapping {
  [key: string]: {
    id: string;
    displayName: string;
    decimals: number;
  };
}

const denomMapping: DenomMapping = {
  uluna: {
    id: 'terra-luna',
    displayName: 'LUNC',
    decimals: 6,
  },
  uusd: {
    id: 'terrausd',
    displayName: 'USTC',
    decimals: 6,
  },
  ukrw: {
    id: 'terra-krw',
    displayName: 'KRTC',
    decimals: 6,
  },
  usdr: {
    id: 'terra-sdr',
    displayName: 'SDTC',
    decimals: 6,
  },
  umnt: {
    id: 'terra-mnt',
    displayName: 'MNTC',
    decimals: 6,
  },
  ucny: {
    id: 'terra-cny',
    displayName: 'CNTC',
    decimals: 6,
  },
  ujpy: {
    id: 'terra-jpy',
    displayName: 'JPTC',
    decimals: 6,
  },
  ugbp: {
    id: 'terra-gbp',
    displayName: 'GPTC',
    decimals: 6,
  },
  ueur: {
    id: 'terra-eur',
    displayName: 'EUTC',
    decimals: 6,
  },
  ucad: {
    id: 'terra-cad',
    displayName: 'CATC',
    decimals: 6,
  },
  uchf: {
    id: 'terra-chf',
    displayName: 'CHTC',
    decimals: 6,
  },
  uaud: {
    id: 'terra-aud',
    displayName: 'AUTC',
    decimals: 6,
  },
  uinr: {
    id: 'terra-inr',
    displayName: 'INTC',
    decimals: 6,
  },
  uidr: {
    id: 'terra-idr',
    displayName: 'IDTC',
    decimals: 6,
  },
  uthb: {
    id: 'terra-thb',
    displayName: 'THTC',
    decimals: 6,
  },
  umyr: {
    id: 'terra-myr',
    displayName: 'MYTC',
    decimals: 6,
  },
  usek: {
    id: 'terra-sek',
    displayName: 'SETC',
    decimals: 6,
  },
  uphp: {
    id: 'terra-php',
    displayName: 'PHTC',
    decimals: 6,
  },
  unok: {
    id: 'terra-nok',
    displayName: 'NOTC',
    decimals: 6,
  },
  utwd: {
    id: 'terra-twd',
    displayName: 'TWTC',
    decimals: 6,
  },
  uhkd: {
    id: 'terra-hkd',
    displayName: 'HKTC',
    decimals: 6,
  },
  usgd: {
    id: 'terra-sgd',
    displayName: 'SGTC',
    decimals: 6,
  },
  udkk: {
    id: 'terra-dkk',
    displayName: 'DKTC',
    decimals: 6,
  },
};

export const convertDenom = (
  denom: string,
): { displayName: string; decimals: number; id: string } => {
  if (denomMapping[denom]) {
    return denomMapping[denom];
  }
  return { displayName: denom.toUpperCase(), decimals: 0, id: '' };
};

export const formatAmount = (amount: string, decimals: number): string => {
  const formattedAmount = (parseInt(amount) / Math.pow(10, decimals)).toFixed(
    decimals,
  );
  return formattedAmount;
};
