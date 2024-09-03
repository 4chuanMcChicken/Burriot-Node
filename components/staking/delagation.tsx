import React, { useState } from 'react';
import './Modal.css';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { Height } from '@mui/icons-material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Modal = ({onClose, validatorId }) => {

    const [stakeAmount, setStakeAmount] = useState(0);

    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    const handleStakeAmountChange = (e) => {
        setStakeAmount(e.target.value);
    };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-1/2 h-1/2" onClick={handleModalContentClick}>
      {/* <label>
            Stake Amount:
            <TextField
              id="stakeValue"
              label="Stake Amount"
            variant="outlined"
              value={stakeAmount}
              onChange={handleStakeAmountChange}
              inputProps={{
                min: 0,
                step: 0.01
              }}
            />
          </label> */}
        <div style={{ width: "100%", height: "10%" }}>
            <CloseIcon onClick={onClose} className="modal-close-btn"></CloseIcon>
        </div>
        <article className='card-article'>
            <section>
                <form className='form'>
                    <div className='FormHelp_warning'>
                        <div className='Flex_column'>
                            <ErrorOutlineIcon style={{ fontSize: '18px' }}/>
                        </div>
                        <span>
                            Leave coins to pay fees for subsequent transactions
                        </span>
                    </div>

                    <div style={{gap: '4px'}}>
                        <header className='Form_header'>
                            <label className='Form_label'>
                                Amount
                            </label>
                            <aside style={{ fontSize: '12px' }}>
                                <div style={{ gap: '4px', justifyContent: 'flex-start' }}>
                                    <AccountBalanceWalletIcon style={{ fontSize: '15px', color: '#8c8c8c' }}/>
                                    <span style={{color: '#8c8c8c'}}>
                                        0.000 LUNC
                                    </span>
                                </div>
                            </aside>
                        </header>

                        <div className='input-wapper'>
                            <input
                                className='Input'
                                id="stakeValue"
                                value={stakeAmount}
                                placeholder="0.000000"
                                onChange={handleStakeAmountChange}
                                step={'any'}
                            />
                            <div className='Input-after'>
                                LUNC
                            </div>
                        </div>
                    </div>

                    <div className='Details_component'>
                        <dl>
                            <dt className='Tx_gas'>
                                Fee
                            </dt>
                            <dd>
                                <span className='Read_component'>
                                    28 LUNC
                                </span>
                            </dd>
                            <dt className='Tx_gas'>
                                Balance
                            </dt>
                            <dd>
                                <span className='Read_component'>
                                    100 LUNC
                                </span>
                            </dd>
                            <dt className='Tx_gas'>
                                Balance after Tax
                            </dt>
                            <dd>
                                <span className='Read_component'>
                                    15 LUNC
                                </span>
                            </dd>
                        </dl>
                    </div>

                    <div style={{gap: '4px', display: 'grid'}}>
                        <button
                            type='submit'
                            className='button'
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </section>
        </article>
      </div>
    </div>
  );
};

export default Modal;