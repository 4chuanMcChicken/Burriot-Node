'use client';
import { useConnectedWallet, useLcdClient } from '@terra-money/wallet-kit';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import Modal from '@/components/staking/delagation'


const Details = () => {
  const params = useParams();
  const {id} = params;
  const [searchParams] = useSearchParams();
  const connected = useConnectedWallet();
  // const rank = searchParams.get('rank');
  const rank = searchParams[1]
  const [validatorInfo, setValidatorInfo] = useState(
    {
      description: {
        id: '',
        moniker: '',
        details: '',
        website: '',
      },
      totalStaked: '',
      votingPower: '',
      lastUpdated: '',
      commissionDetails: {},
      selfBonded: 0,
      delegator_shares: '',
      imageLoaded: true,
      status: ''
    }
  );
  const [totalBondedTokens, setTotalBondedTokens] = useState(0);

  const handleImageError = () => {
    console.log(validatorInfo.description.id)
    setValidatorInfo(prev => ({ ...prev, imageLoaded: false }));
  };

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  function formatNumber(num) {
    if (num >= 1e15) {
      return (num / 1e15).toFixed(2) + 'B';
    } else if (num >= 1e12) {
      return (num / 1e12).toFixed(2) + 'M';
    } else {
      return num.toString();
    }
  }

  
  useEffect(() => {
    const poolUrl = 'https://terra-classic-lcd.publicnode.com/cosmos/staking/v1beta1/pool';
    const validatorUrl = `https://terra-classic-lcd.publicnode.com/cosmos/staking/v1beta1/validators/${id}`;
  
    fetch(poolUrl)
      .then(response => response.json())
      .then(poolData => {
        const bondedTokens = parseInt(poolData.pool.bonded_tokens);
        setTotalBondedTokens(bondedTokens);
  
        fetch(validatorUrl)
          .then(response => response.json())
          .then(validatorData => {
            const validator = validatorData.validator
            const votingPowerPercentage = ((parseInt(validator.tokens) / bondedTokens) * 100).toFixed(2) + '%';
            console.log(parseFloat(validator.tokens) - parseFloat(validator.delegator_shares))
            setValidatorInfo({
              totalStaked: formatNumber(parseInt(validator.tokens)),
              votingPower: votingPowerPercentage,
              lastUpdated: new Date(validator.commission.update_time).toLocaleDateString(),
              commissionDetails: {
                rate: `${(parseFloat(validator.commission.commission_rates.rate) * 100).toFixed(2)}%`,
                max_rate: `${(parseFloat(validator.commission.commission_rates.max_rate) * 100).toFixed(2)}%`,
                max_change_rate: `${(parseFloat(validator.commission.commission_rates.max_change_rate) * 100).toFixed(2)}%`
              },
              description: {
                moniker: validator.description.moniker,
                details: validator.description.details,
                website: validator.description.website,
                id: validator.description.identity
              },
              delegator_shares: formatNumber(parseInt(validator.delegator_shares)),
              selfBonded: parseFloat(validator.tokens) - parseFloat(validator.delegator_shares),
              imageLoaded: true,
              status: validator.jailed ? 'JAILED' : 'ACTIVE'
            });
          })
          .catch(error => console.error('Error fetching validator:', error));
      })
      .catch(error => console.error('Error fetching pool data:', error));
  }, [id]);


  return (
    // <div className='text-white'>
    //   Details for Validator: {JSON.stringify(validatorInfo)}
    // </div>

    // <div className='el-BlockchainAgentTitle bg-white flex flex-col gap-2 px-[40px] pb-2 pt-[30px] max-md:gap-1 max-md:p-2 mb-2 max-md:mb-0'>
    //   <div className='relative z-1 flex flex-1 items-center gap-0.5 el-BlockchainAgentLabelsBlock flex-col items-start gap-0.5 ml-[35px] max-md:ml-1 el-NameText text-[42px] leading-[50px] font-700 text-colorWhite el-ImpostorLabel self-start el-SybilLabel self-start max-md:gap-0.5 el-NameText max-md:text-xl el-NameText max-md:leading-[30px] el-ImpostorLabel el-Icon md:block el-SybilLabel el-Icon md:block'>
    //     <div className='el-Avatar h-fit overflow-hidden' style={{ minWidth: '72px', width: '72px', height: '72px', borderRadius: '36px' }}>
    //     {! validatorInfo.imageLoaded && (
    //       <img
    //         src={`/validatorIcon/${validatorInfo.description.id}.jpg`}
    //         alt={validatorInfo.description.moniker}
    //         className='float-left h-full w-full rounded-50% object-contain'
    //         onError={() => handleImageError}
    //         width={72}
    //         height={72}
    //       />
    //     )}
    //     {validatorInfo.imageLoaded && (
    //       <PersonIcon
    //         className='float-left h-full w-full rounded-50% object-contain'
    //         width={72}
    //         height={72}
    //       />
    //     )}
    //     </div>
    //   </div>
    //   <div className='el-BlockchainAgentLabelsBlock flex flex-1 items-center gap-1.5 max-md:gap-1'>
    //     <div className='el-BlockchainAgentNameWrapper flex-1 max-md:flex max-md:flex-col max-md:items-start'>
    //       <span className='el-NameText break-all text-md font-500 leading-1.2 text-darkBrandColor max-md:text-md max-rows-2-leading-1_2 text-start'>
    //         {validatorInfo.description.moniker}
    //       </span>
    //     </div>
    //   </div>
    // </div>

    <div className='w-full h-full overflow-auto'>
      <div className='el-BlockchainAgentTitle flex flex-col gap-2 px-[40px] pb-2 pt-[30px] max-md:gap-1 max-md:p-2 mb-2 max-md:mb-0'>
        <div className='relative z-1 flex flex-1 items-center gap-0.5 [&_.el-BlockchainAgentLabelsBlock]:flex-col [&_.el-BlockchainAgentLabelsBlock]:items-start [&_.el-BlockchainAgentLabelsBlock]:gap-0.5 [&_.el-BlockchainAgentLabelsBlock]:ml-[35px] [&_.el-BlockchainAgentLabelsBlock]:max-md:ml-1 [&_.el-NameText]:text-[42px] [&_.el-NameText]:leading-[50px] [&_.el-NameText]:font-700 [&_.el-NameText]:text-colorWhite [&_.el-ImpostorLabel]:self-start [&_.el-SybilLabel]:self-start max-md:gap-0.5 [&_.el-NameText]:max-md:text-xl [&_.el-NameText]:max-md:leading-[30px] [&_.el-ImpostorLabel_>_.el-Icon]:md:block [&_.el-SybilLabel_>_.el-Icon]:md:block'>
          <div className='el-Avatar overflow-hidden' style={{ width: '72px', height: '72px', borderRadius: '36px', flexShrink: 0 }}>
            {validatorInfo.imageLoaded ? (
              <img
                src={`/validatorIcon/${validatorInfo.description.id}.jpg`}
                alt={validatorInfo.description.moniker}
                className='rounded-full object-cover'
                onError={() => handleImageError}
                style={{ width: '72px', height: '72px' }}
              />
            ) : (
              <PersonIcon
                className='text-gray-400'
                style={{ fontSize: '72px', width: '72px', height: '72px' }}
              />
            )}
          </div>
          <div className='el-BlockchainAgentLabelsBlock flex flex-1 items-center gap-1.5 max-md:gap-1'>
            <div className='el-BlockchainAgentNameWrapper flex-1 max-md:flex max-md:flex-col max-md:items-start'>
              <span className='el-NameText break-all text-md font-500 leading-1.2 text-darkBrandColor max-md:text-md max-rows-2-leading-1_2 text-start'>
                {validatorInfo.description?.moniker}
              </span>
            </div>
          </div>
          {connected ? (
  <div className='el-Popover overflow-hidden [&>*]:float-left el-Dropdown relative flex cursor-pointer items-center rounded-16 max-md:h-[48px] [&>svg]:pointer-events-none border-0 bg-headerControlsBg hover:bg-colorWhite/10 h-[48px]'>
    <button
      className='text-white mt-2 mb-2 ml-2 mr-2 h-[48px] min-w-[48px] px-1'
      disabled={!connected}
      onClick={handleOpenModal}
    >
      Delegate
    </button>
    {isModalOpen && (
        <Modal onClose={handleCloseModal} validatorId={id}>
        </Modal>
      )}
  </div>
) : (
  <div className='el-Popover overflow-hidden [&>*]:float-left el-Dropdown relative flex cursor-pointer items-center rounded-16 max-md:h-[48px] [&>svg]:pointer-events-none border-0 bg-headerControlsBg hover:bg-colorWhite/10 h-[48px]'>
    <button
      className='text-white mt-2 mb-2 ml-2 mr-2 h-[48px] min-w-[48px] px-1'
      disabled={true}
    >
      Delegate
    </button>
  </div>
)}
        </div>
        <div className='ml-[112px] flex flex-col gap-2 max-md:ml-0 max-md:gap-1'>
          <span className='el-Text m-0 inline text-left transition-colors duration-default ease-default text-lg leading-[24px] text-grayBrandColor max-md:text-sm max-md:leading-20px [&_.el-Link]:inline [&_.el-Link]:text-link [&_.el-Link]:hover:text-linkHover'>
          {validatorInfo.description?.details}
          </span>
        </div>
      </div>

      <div className='terra-validator-dashboard terra-blockchain-agent-dashboard-bonded'>
        <div className='group/AnimateArrow relative flex flex-col rounded-20 p-[35px] transition duration-default max-md:p-2 el-DashboardBadge h-full bg-primaryColor/25 blockchain-agent-dashboard-rank-area'>
          <div className='el-DashboardCardContent flex-1 flex items-center justify-between max-sm:flex-col-reverse max-sm:gap-1.5'>
            <div className='el-TextBlock flex flex-col gap-1 max-sm:items-center max-sm:gap-0.2'>
              <p className='text-xl text-colorWhite max-sm:text-md'>
                #{rank} of 100
              </p>
              <p className='whitespace-nowrap text-lg font-500 max-sm:text-sm text-primaryColor'>
                <span className='flex items-center gap-0.5 text-white'>
                Validator rank
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className='group/AnimateArrow relative flex flex-col rounded-20 p-[35px] transition duration-default max-md:p-2 el-DashboardBadge h-full bg-lightGrayBrandColor/25 blockchain-agent-dashboard-voting-area'>
            <div className='el-DashboardCardContent flex-1 flex items-center justify-between max-sm:flex-col-reverse max-sm:gap-1.5'>
              <div className='el-TextBlock flex flex-col gap-1 max-sm:items-center max-sm:gap-0.2'>
                <p className='text-xl text-colorWhite max-sm:text-md'>
                  {validatorInfo.votingPower}
                </p>
                <p className='whitespace-nowrap text-lg font-500 max-sm:text-sm text-lightGrayBrandColor'>
                  Voting power
                </p>
              </div>
            </div>
        </div>

        <div className='group/AnimateArrow relative flex flex-col rounded-20 p-[35px] transition duration-default max-md:p-2 el-DashboardBadge h-full bg-successColor/25 blockchain-agent-dashboard-status-area'>
            <div className='el-DashboardCardContent flex-1 flex items-center justify-between max-sm:flex-col-reverse max-sm:gap-1.5'>
              <div className='el-TextBlock flex flex-col gap-1 max-sm:items-center max-sm:gap-0.2'>
                <p className='text-xl text-colorWhite max-sm:text-md'>
                  {validatorInfo.status}
                </p>
                <p className='whitespace-nowrap text-lg font-500 max-sm:text-sm text-successColor'>
                  Updates from {validatorInfo.lastUpdated}
                </p>
              </div>
            </div>
        </div>

        <div className='group/AnimateArrow relative flex flex-col rounded-20 p-[35px] transition duration-default max-md:p-2 el-DashboardBadge h-full bg-dashboardCardBg blockchain-agent-dashboard-uptime-area'>
          <div className='el-DashboardCardContent flex-1 flex items-center justify-between max-sm:flex-col-reverse max-sm:gap-1.5'>
            <div className='el-TextBlock flex flex-col gap-1 max-sm:items-center max-sm:gap-0.2'>
              <p className='text-xl text-colorWhite max-sm:text-md'>
                {validatorInfo.totalStaked} LUNC
              </p>
              <p className='whitespace-nowrap text-lg font-500 max-sm:text-sm text-successColor'>
                Delegated
              </p>
            </div>
          </div>
        </div>

        {/* <div className='group/AnimateArrow relative flex w-full flex-col rounded-20 bg-dashboardCardBg/75 p-[35px] transition duration-default max-md:p-2 blockchain-agent-dashboard-bonded-area'>
          <div className='el-DashboardCardTitleWrapper mb-2 flex items-start justify-between gap-1 max-md:mb-1'>
            <div className='el-DashboardCardTitleContent flex items-start'>
              <h3 className='el-DashboardCardTitle font-500 uppercase text-primaryColor min-h-2 text-md leading-20px max-md:min-h-[16px] max-md:text-xs max-md:leading-[16px]'>
                Bonded
              </h3>
            </div>
            <div className='flex items-center gap-2'></div>
          </div>

          <div className='el-DashboardCardContent flex-1'>
            <div className='el-Bonded flex flex-col items-stretch gap-[30px] max-md:gap-2'>
              <div className='relative h-2 w-full overflow-hidden rounded-4 bg-primaryColor/25'>
                <div 
                className='absolute bottom-0 left-0 top-0 rounded-l-4 bg-primaryColor'
                style={{width:'1%'}}
                >
                </div>
              </div>

              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <label className='mb-1 text-md font-500 text-textMuted max-md:text-sm max-md:leading-20px'>
                    Self Bonded
                  </label>
                  <p className='text-white m-0 text-[24px] font-400 uppercase max-md:text-md max-md:leading-20px'>
                    {validatorInfo.selfBonded} LUNC
                  </p>
                  <p className='m-0 text-md font-400 text-textMuted  max-md:text-sm max-md:leading-[18px]'>
                    0.01%
                  </p>
                </div>

                <div className='text-right'>
                  <label className='mb-1 text-md font-500 text-textMuted max-md:text-sm max-md:leading-20px'>
                    Delegated
                  </label>
                  <p className='text-white m-0 text-[24px] font-400 uppercase max-md:text-md max-md:leading-20px'>
                    {validatorInfo.delegator_shares} LUNC
                  </p>
                  <p className='m-0 text-md font-400 text-textMuted  max-md:text-sm max-md:leading-[18px]'>
                    99.99%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        
        <div className='group/AnimateArrow relative flex flex-col rounded-20 bg-dashboardCardBg/75 p-[35px] transition duration-default max-md:p-2 blockchain-agent-dashboard-overview-area'>
            <div className='el-DashboardCardTitleWrapper mb-2 flex items-start justify-between gap-1 max-md:mb-1'>
              <div className='el-DashboardCardTitleContent flex items-start'>
                <h3 className='el-DashboardCardTitle font-500 uppercase text-primaryColor min-h-2 text-md leading-20px max-md:min-h-[16px] max-md:text-xs max-md:leading-[16px]'>
                  Overview
                </h3>
              </div>
            </div>

            {/* <div className='el-DashboardCardContent flex-1'>
              <div className='flex h-full flex-col items-stretch justify-between max-md:pt-2'>
                <div className='el-SummaryListRow flex items-center justify-between gap-2'>
                  <label className='el-SummaryListLabel flex items-center gap-1 whitespace-nowrap text-md font-500 leading-[36px] text-lightGrayBrandColor max-md:text-sm max-md:leading-[24px]'>
                    Blocks
                  </label>
                  <div className='flex flex-col items-end'>
                    <div className='text-white el-SummaryListValue flex items-center gap-1 text-[24px] !leading-1.5 max-md:text-md'>
                      99.94%
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            <span className='el-SummaryDivider my-1.5 h-0.1 w-full bg-borderLight'></span>

            <div className='el-DashboardCardContent flex-1'>
              <div className='flex h-full flex-col items-stretch justify-between max-md:pt-2'>
                <div className='el-SummaryListRow flex items-center justify-between gap-2'>
                  <label className='el-SummaryListLabel flex items-center gap-1 whitespace-nowrap text-md font-500 leading-[36px] text-lightGrayBrandColor max-md:text-sm max-md:leading-[24px]'>
                    Fee
                  </label>
                  <div className='flex flex-col items-end'>
                    <div className='text-white el-SummaryListValue flex items-center gap-1 text-[24px] !leading-1.5 max-md:text-md'>
                      {validatorInfo.commissionDetails.rate}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <span className='el-SummaryDivider my-1.5 h-0.1 w-full bg-borderLight'></span>

            <div className='el-DashboardCardContent flex-1'>
              <div className='flex h-full flex-col items-stretch justify-between max-md:pt-2'>
                <div className='el-SummaryListRow flex items-center justify-between gap-2'>
                  <label className='el-SummaryListLabel flex items-center gap-1 whitespace-nowrap text-md font-500 leading-[36px] text-lightGrayBrandColor max-md:text-sm max-md:leading-[24px]'>
                    Max fee
                  </label>
                  <div className='flex flex-col items-end'>
                    <div className='text-white el-SummaryListValue flex items-center gap-1 text-[24px] !leading-1.5 max-md:text-md'>
                      {validatorInfo.commissionDetails.max_rate}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <span className='el-SummaryDivider my-1.5 h-0.1 w-full bg-borderLight'></span>

            <div className='el-DashboardCardContent flex-1'>
              <div className='flex h-full flex-col items-stretch justify-between max-md:pt-2'>
                <div className='el-SummaryListRow flex items-center justify-between gap-2'>
                  <label className='el-SummaryListLabel flex items-center gap-1 whitespace-nowrap text-md font-500 leading-[36px] text-lightGrayBrandColor max-md:text-sm max-md:leading-[24px]'>
                    Max fee daily change
                  </label>
                  <div className='flex flex-col items-end'>
                    <div className='text-white el-SummaryListValue flex items-center gap-1 text-[24px] !leading-1.5 max-md:text-md'>
                      {validatorInfo.commissionDetails.max_change_rate}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <span className='el-SummaryDivider my-1.5 h-0.1 w-full bg-borderLight'></span>

            <div className='el-DashboardCardContent flex-1'>
              <div className='flex h-full flex-col items-stretch justify-between max-md:pt-2'>
                <div className='el-SummaryListRow flex items-center justify-between gap-2'>
                  <label className='el-SummaryListLabel flex items-center gap-1 whitespace-nowrap text-md font-500 leading-[36px] text-lightGrayBrandColor max-md:text-sm max-md:leading-[24px]'>
                  Identity
                  </label>
                  <div className='flex flex-col items-end'>
                    <div className='text-white el-SummaryListValue flex items-center gap-1 text-[24px] !leading-1.5 max-md:text-md'>
                      {validatorInfo.description.id}
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>

  );
}

export default Details;