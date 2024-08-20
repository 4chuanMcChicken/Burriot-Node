'use client';

import { useConnectedWallet, useLcdClient } from '@terra-money/wallet-kit';
import React, { useEffect, useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { MagicCard } from '@/components/magicui/MagicCard';
import { Validator } from '@terra-money/feather.js/dist/core/staking/Validator';
import { makeStyles, createStyles } from '@mui/styles';
import InputBase from '@mui/material/InputBase';
import TableSortLabel from '@mui/material/TableSortLabel';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import Link from 'next/link';

const wallet = () => {
  const theme = 'dark';
  const lcd = useLcdClient();
  const connected = useConnectedWallet();
  const [validatorInfos, setValidatorInfos] = useState<Validator[]>([]);
  const [totalBondedTokens, setTotalBondedTokens] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [imageLoadErrors, setImageLoadErrors] = useState(new Set());
  const chainID = 'columbus-5';

  const validators_url = `https://terra-classic-lcd.publicnode.com/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED`
  const pool_url = 'https://terra-classic-lcd.publicnode.com/cosmos/staking/v1beta1/pool'

  const headCells = [
    { id: 'rank', numeric: true, label: 'Rank' },
    { id: 'moniker', numeric: false, label: 'Moniker' },
    { id: 'totalStaked', numeric: true, label: 'Total Staked' },
    { id: 'votingPower', numeric: true, label: 'Voting Power' },
    { id: 'commissionRate', numeric: true, label: 'Commission Rate' },
    { id: 'lastUpdated', numeric: false, label: 'Last Updated' },
    { id: 'commissionDetails', numeric: false, label: 'Commission Details' }
  ];

  function formatNumber(num) {
    if (num >= 1e15) {
      return (num / 1e15).toFixed(2) + 'B';
    } else if (num >= 1e12) {
      return (num / 1e12).toFixed(2) + 'M';
    } else {
      return num.toString();
    }
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleImageError = (validatorId) => {
    setImageLoadErrors(prev => new Set(prev).add(validatorId));
  };

  const parseValue = (value) => {
    if (typeof value === 'string') {
      if (value.endsWith('B')) {
        return parseFloat(value.slice(0, -1)) * 1e3;
      } else if (value.endsWith('M')) {
        return parseFloat(value.slice(0, -1));
      } else if (value.endsWith('%')) {
        return parseFloat(value.slice(0, -1));
      }
    }
    return parseFloat(value);
  };

  const sortedValidatorsList = useMemo(() => {
    const arrayCopy = [...validatorInfos];
    return arrayCopy.sort((a, b) => {
      if (!orderBy) return 0;
      const valueA = parseValue(a[orderBy]);
      const valueB = parseValue(b[orderBy]);
  
      if (valueA < valueB) {
        return order === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [validatorInfos, orderBy, order]);

  useEffect(() => {
    const poolUrl = 'https://terra-classic-lcd.publicnode.com/cosmos/staking/v1beta1/pool';
    const validatorsUrl = 'https://terra-classic-lcd.publicnode.com/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED';
  
    // 获取pool信息
    fetch(poolUrl)
      .then(response => response.json())
      .then(poolData => {
        const bondedTokens = parseInt(poolData.pool.bonded_tokens);
        setTotalBondedTokens(bondedTokens);
  
        // 获取validators信息
        fetch(validatorsUrl)
          .then(response => response.json())
          .then(validatorsData => {
            const validators = validatorsData.validators || [];
            const unsortedData = validators.map((val, index) => {
              const votingPowerPercentage = ((parseInt(val.tokens) / bondedTokens) * 100).toFixed(2) + '%';
              return {
                totalStaked: formatNumber(parseInt(val.tokens)),
                votingPower: votingPowerPercentage,
                commissionRate: `${(parseFloat(val.commission.commission_rates.rate) * 100).toFixed(2)}%`,
                lastUpdated: new Date(val.commission.update_time).toLocaleDateString(),
                commissionDetails: `Max Rate: ${(parseFloat(val.commission.commission_rates.max_rate) * 100).toFixed(2)}%, Max Change Rate: ${(parseFloat(val.commission.commission_rates.max_change_rate) * 100).toFixed(2)}%`,
                description: {
                  moniker: val.description.moniker,
                  details: val.description.details,
                  website: val.description.website,
                  id: val.description.identity
                },
                delegator_shares: formatNumber(parseInt(val.delegator_shares)),
                imageLoaded: true
              };
            });
  
            const sortedData = unsortedData.sort((a, b) => parseFloat(b.votingPower) - parseFloat(a.votingPower));
            sortedData.forEach((val, index) => {
              val.rank = index + 1;
            });
            setValidatorInfos(sortedData);
          })
          .catch(error => console.error('Error fetching validators:', error));
      })
      .catch(error => console.error('Error fetching pool data:', error));
  }, []);

  return (
    <>
      <div className={'flex h-full w-full flex-col gap-4 '}>
        <div
           className="flex flex-col items-center justify-center shadow-2xl whitespace-nowrap text-4xl"
        >
            <Paper component="form" className='w-full max-w-screen-xl mt-4 mb-4' style={{padding: '2px 4px', display: 'flex', alignItems: 'center'}}
              onSubmit={(e) => {
                e.preventDefault();
              }}>
              <InputBase
                style={{flex: 1}}
                placeholder="Search for validators"
                inputProps={{ 'aria-label': 'search for validators' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IconButton type="submit" style={{padding: 10}} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>

            <TableContainer component={Paper} className='flex max-w-screen-xl' style={{ maxHeight: '85vh', overflow: 'auto', cursor: 'pointer' }}>
              <Table stickyHeader aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {headCells.map((headCell) => (
                      <TableCell key={headCell.id} align={headCell.numeric ? 'right' : 'left'} sortDirection={orderBy === headCell.id ? order : false}>
                        <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'} onClick={(event) => handleRequestSort(event, headCell.id)}>
                        <div style={{ fontWeight: 'bold' }}>
                          {headCell.label}
                        </div>
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedValidatorsList.length > 0 ? (
                    sortedValidatorsList.filter(validator => 
                      validator.description.moniker.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((validator, idx) => (
                      <TableRow key={idx} className="hover-effect">
                        <TableCell align="right">{validator.rank}</TableCell>
                        <TableCell>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div>
                              {!imageLoadErrors.has(validator.description.id) && (
                                <img
                                  src={`/validatorIcon/${validator.description.id}.jpg`}
                                  alt={validator.description.moniker}
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    verticalAlign: 'middle'
                                  }}
                                  onError={() => handleImageError(validator.description.id)}
                                />
                              )}
                              {imageLoadErrors.has(validator.description.id) && (
                                <PersonIcon
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    verticalAlign: 'middle'
                                  }}
                                />
                              )}
                            </div>
                            <Link href={`/station/staking/${validator.description.id}`} passHref>
                              <div style={{
                                  maxWidth: '270px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden', 
                                  textOverflow: 'ellipsis'
                                }}>
                                {validator.description.moniker}
                              </div>
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell align="right">{validator.totalStaked}</TableCell>
                        <TableCell align="right">{validator.votingPower}</TableCell>
                        <TableCell align="right">{validator.commissionRate}</TableCell>
                        <TableCell align="right">{validator.lastUpdated}</TableCell>
                        <TableCell align="right">
                          <span>{validator.commissionDetails}</span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">No validators found or wallet not connected.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
        </div>
      </div>
    </>
  );
};

export default wallet;
