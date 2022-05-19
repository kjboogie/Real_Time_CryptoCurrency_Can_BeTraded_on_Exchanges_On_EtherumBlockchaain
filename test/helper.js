import { assert } from "chai"
import Web3 from "web3"

export const EVM_REVERT = 'VM Exception while processing transaction: revert';
export const tokens = (n) => {
    return new Web3.utils.BN(
        Web3.utils.toWei(n.toString(), 'ether')
    )
    }