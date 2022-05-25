pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract Token {
    using SafeMath for uint;
    
    //Variables
    string public name = "Boogiereum Token"; // name of the token of crypto we are creating
    string public symbol = "BOOGIE";   // symbol for the     token
    uint256 public decimals = 18;   
    uint256 public totalSupply ; 

    // Mapping
    mapping(address => uint256) public balanceOf; //Track Balances 
    //mapping to add amount in allowance 
    mapping(address => mapping(address => uint256)) public allowance; //first mapping has the address who approves to spend on exchanges
                                                                      // second mapping has all the address of the exchanges where it gets approval with the respective amount
   
   //Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner,address indexed spender,uint256 value);


    //internal function to transfer tokens. Can't be called from blockchain
    function _transfer(address _from, address _to, uint256 _value) internal returns (bool success){
         // require funtion will not execute further statements if condition is false inside it
        require( _to != address(0)); // Checking if reciever address is valid or not
        balanceOf[_from] = balanceOf[msg.sender].sub(_value); //subtracting tokens from sender
        balanceOf[_to] = balanceOf[_to].add(_value);  // adding tokens to reciever
        //Calling the event
       emit Transfer(_from,_to,_value);
        return true;
    }

   // Send tokens or transer function
   function transfer(address _to, uint256 _value ) public returns (bool success){
       require(balanceOf[msg.sender] >= _value);   //Checking if sender has desired amount of token to send or not
        _transfer(msg.sender,_to,_value);
       return true;
   }

   //Approve Tokens to spend for ecxhange
   function approve(address _spender,uint256 _value) public returns (bool Success){
       require(_spender != address(0));
       allowance[msg.sender][_spender]= _value;
       emit Approval(msg.sender, _spender, _value);
       return true;
   }

   //transfer function for exchange
   function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
       require(_value <= balanceOf[_from]); // sending amount should be less than the total token sender has
       require(_value <= allowance[_from][msg.sender]); // sending amount should be less than the approved amount
       allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);  // reset the allowance
       _transfer(_from, _to, _value);  //Calling _transfer function
       return true;
   }

    constructor() public {
        totalSupply = 1000000 * (10 ** decimals);  // setting total supply wheneer smart contract is deployed
        balanceOf[msg.sender] = totalSupply;  // adding total supply of token to deployer
    }
}