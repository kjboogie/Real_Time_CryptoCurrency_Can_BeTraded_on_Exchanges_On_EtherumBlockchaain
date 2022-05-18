pragma solidity >=0.4.22 <0.9.0;

contract Token {
    string public name = "Boogiereum Token"; // name of the token of crypto we are creating
    string public symbol = "BOOGIE";   // symbol for the     token
    uint256 public decimals = 18;   
    uint256 public totalSupply ; 

    constructor() public {
        totalSupply = 1000000 * (10 ** decimals);
    }
}