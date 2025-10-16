import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletAdvancedAddressDetails,
    WalletAdvancedTokenHoldings,
    WalletAdvancedTransactionActions,
    WalletAdvancedWalletActions,
  } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';

  
export default function WalletAdvancedDemo() {
    const { address, isConnected } = useAccount();
    console.log(name);

    return (
        <>
            
            <Wallet>
                <ConnectWallet />
                <WalletDropdown>
                    <WalletAdvancedWalletActions />
                    <WalletAdvancedAddressDetails />
                    <WalletAdvancedTransactionActions />
                    <WalletAdvancedTokenHoldings />
                </WalletDropdown>
            </Wallet>
        </>
    )
}
