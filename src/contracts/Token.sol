pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract Token {
    using SafeMath for uint;
    
    //Variables
    string public name = "Boogiereum Token"; // name of the token of crypto we are creating
    string public symbol = "BOOGIE";   // symbol for the     token
    uint256 public decimals = 18;   
    uint256 public totalSupply ; 

    //Track Balances 
    mapping(address => uint256) public balanceOf;
   
   //Events
    event Transfer(address indexed from, address indexed to, uint256 value);

   // Send tokens or transer function
   function transfer(address _to, uint256 _value ) public returns (bool success){
       // require funtion will not execute further statements if condition is false inside it
        require( _to != address(0)); // Checking if reciever address is valid or not
       require(balanceOf[msg.sender] >= _value);   //Checking if sender has desired amount of token to send or not
       balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
       balanceOf[_to] = balanceOf[_to].add(_value);
       //Calling the event
       emit Transfer(msg.sender,_to,_value);
       return true;
   }

    constructor() public {
        totalSupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }
}