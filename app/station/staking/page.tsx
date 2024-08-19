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
      return (num / 1e12).toFixed(2atorId) => {
    setImageLoadErrors(prev => ne) + 'M';
    } else {
      return num.toString();
    }
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleImageError = (validw Set(prev).add(validatorId));
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
    if (connected) {
      const params = { status: 'BOND_STATUS_BONDED' };

      lcd.staking.pool(chainID, params).then((poolInfo) => {
        const bondedTokens = parseInt(poolInfo.bonded_tokens.amount.toString());
        setTotalBondedTokens(bondedTokens);
  
        lcd.staking.validators(chainID, params).then((res) => {
          console.log(res[0][0])
          const unsortedData  = res[0].map((val, index) => {
            const votingPowerPercentage = ((parseInt(val.tokens.toString()) / bondedTokens) * 100).toFixed(2) + '%'; // 使用获取到的bondedTokens计算
            return {
              totalStaked: formatNumber(parseInt(val.tokens)),
              votingPower: votingPowerPercentage,
              commissionRate: `${(parseFloat(val.commission.commission_rates.rate) * 100).toFixed(2)}%`,
              lastUpdated: new Date(val.commission.update_time).toLocaleDateString(),
              commissionDetails: `Max Rate: ${(parseFloat(val.commission.commission_rates.max_rate) * 100).toFixed(2)}%, Max Change Rate: ${(parseFloat(val.commission.commission_rates.max_change_rate) * 100).toFixed(2)}%`,
              description: {moniker: val.description.moniker, details: val.description.details, website: val.description.website, id: val.description.identity},
              delegator_shares: formatNumber(parseInt(val.delegator_shares.toString())),
              imageLoaded: true
            }
          });
          const sortedData = unsortedData.sort((a, b) => parseFloat(b.votingPower) - parseFloat(a.votingPower));
          sortedData.forEach((val, index) => {
            val.rank = index + 1;
          });
          setValidatorInfos(sortedData);
        });
  
      });
  
      lcd.staking.delegations(connected.addresses[chainID]).then((res) => {
        console.log(res);
      });
    } else {
      console.log("Wallet not connected");
    }
  }, [connected]);

  return (
    <div>

      <Paper component="form" style={{padding: '2px 4px', display: 'flex', alignItems: 'center', width: 400}}
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

      <TableContainer component={Paper} className="my-4" style={{ height: 400, overflow: 'auto' }}>
        <Table stickyHeader aria-label="simple table">
        <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id} align={headCell.numeric ? 'right' : 'left'} sortDirection={orderBy === headCell.id ? order : false}>
                  <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'} onClick={(event) => handleRequestSort(event, headCell.id)}>
                    {headCell.label}
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
                <TableRow key={idx}>
                  <TableCell align="right">{validator.rank}</TableCell>
                  <TableCell>
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
                    </div>
                    <div>
                      {validator.description.moniker}
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
  );
};

export default wallet;
