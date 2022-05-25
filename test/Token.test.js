import { assert } from "chai"
import { eq } from "lodash"
import Web3 from "web3"
import {tokens,EVM_REVERT} from './helper.js'


require('chai')
        .use(require('chai-as-promised'))
        .should()

const Token = artifacts.require('./Token')


//In parameters we can define the accounts
contract('Token', (accounts)=>{
    const name = 'Boogiereum Token'
    const symbol = 'BOOGIE'
    const decimals = '18'
    const totalSupply = tokens(1000000).toString()
    let token

    // beforeEach function will run before every tests
    beforeEach(async()=>{
         //Fetch the deployed contract  for our test cases
          token = await Token.new()  
    })

    // All test cases related to contract deployment i.e. token creation with proper name, total supply, symbol, etc
    describe('deployment',  () => {
        it('tracks the name', async () =>{
            //extract name from it
            const result = await token.name() 
            //assert.equal(result, 'My Name')
            result.should.equal(name) // check if its equal to excat value or not
        })
        it('tracks the Symbol', async () =>{
            const result = await token.symbol()
            result.should.equal(symbol) 
        })
        it('tracks the decimals', async () =>{
            const result = await token.decimals()
            result.toString().should.equal(decimals)
        })
        it('tracks the total Supply', async () =>{
            const result = await token.totalSupply()     
            result.toString().should.equal(totalSupply.toString()) 
        })

        it('Assign total supplyer to the deployer', async () => {
            const result = await token.balanceOf(accounts[0])
            result.toString().should.equal(totalSupply.toString())
        })

        
    })

    // All test cases for token transfer
    describe('sending tokens',  () =>{
        let result
        let amount
        // All test cases for successfull token transfer
        describe('Successful token transfer', async () =>{
            beforeEach(async()=>{
                amount = tokens(100)
              //Transfer
            result = await token.transfer(accounts[1],amount, {from: accounts[0]}) 
           })
          it('transfer token balance', async () =>{
            let balanceOf
        //After Transfer
            balanceOf = await token.balanceOf(accounts[0])
            balanceOf.toString().should.equal(tokens(999900).toString())
            balanceOf = await token.balanceOf(accounts[1])
            balanceOf.toString().should.equal(tokens(100).toString())
          })  
    
          //Test for Transfer event with details of the sender , reciever and the amount of tokens send in transcation
          it('emits a transfer event', async () =>{
              const logs = result.logs[0]  // We get logs array in return when function called. We are extracting that logs
              logs.event.should.equal('Transfer')  // Comparing that right event is triggered
              const event = logs.args    // args is array which contain details about the transcation happened
              event.from.toString().should.equal(accounts[0], 'Sender is correct')
              event.to.toString().should.equal(accounts[1], 'Sender is correct')
              event.value.toString().should.equal(amount.toString(), 'Value is correct')
          })

        })
        
        //All test cases when token failed to transfer
        describe('Failure in token transfer', async () =>{
            it('rejects insufficient balance',async()=>{
                let invalidAmount
                //Attempting to send tokens more then user have
                invalidAmount = tokens(100000000) // 100 million - IT is greator then total supply or sender's or deployer's account
                await token.transfer(accounts[1],invalidAmount, {from: accounts[0]}).should.be.rejectedWith(EVM_REVERT)
               
                //Attempting to send token when user have none
                invalidAmount = tokens(10)
                await token.transfer(accounts[0], invalidAmount, {from: accounts[1]}).should.be.rejectedWith(EVM_REVERT)
            })
            // Checking reciever address is correct or not
            it('rejects invalid recepient', async() =>{
                await token.transfer(0x0, amount, {from: accounts[0]}).should.be.rejected
            })
        })
    })

    // Aproving tokens so that onyone/exchanges can send tokens from user's account
    describe('approving tokens', async ()=> {
        let result
        let amount
        beforeEach(async () => {
            amount = tokens(100)
            result = await token.approve(accounts[2],amount,{from: accounts[0]})  //account[0] approves the allowance for account[2] to send amount
        }) 
        describe('success', () =>{
            it('allocate an allowance for delegated token spending on exchanges', async () =>{
                const allowance = await token.allowance(accounts[0],accounts[2]) 
                allowance.toString().should.equal(amount.toString()) // checking if the amount of tokens are added to the allowance
            })
            
            it("emits an Transfer event", async() =>{
                const log = result.logs[0]
                log.event.should.equal('Approval')
                const event = log.args
                event.owner.toString().should.equal(accounts[0],"Owner is correct")
                event.spender.toString().should.equal(accounts[2].toString(),"Spender is correct")
                event.value.toString().should.equal(amount.toString(),"Value is correct")
            })
        })
        describe('failure', () =>{
            it('rejects invalid spender', async() =>{
                await token.approve(0x0, amount,{from: accounts[0]}).should.be.rejected
            })
        })
    })


    //Test for exchange token transfer function i.e. transFrom 
    describe('sending tokens by exchange (accounts[2]) to different account i.e. delegated token transfer',  () =>{
        let result
        let transferAmount = tokens(200)
        let amount

        beforeEach(async () =>{
            amount = tokens(100)
            await token.transfer(accounts[1],transferAmount, {from: accounts[0]})
            await token.approve(accounts[0], amount, {from: accounts[1]})   // approving for exchange to transfer tokens from accounts[1] for all test cases
        })

        // All test cases for successfull token transfer
        describe('Successful token transfer', async () =>{
            beforeEach(async()=>{
              //Transfer
            
            result = await token.transferFrom(accounts[1],accounts[2],amount, {from: accounts[0]}) 
           })

          it('transfer token balance', async () =>{
            let balanceOf
        //After Transfer
            balanceOf = await token.balanceOf(accounts[1])
            balanceOf.toString().should.equal(tokens(999700).toString())
            balanceOf = await token.balanceOf(accounts[2])
            balanceOf.toString().should.equal(tokens(100).toString())
          })  

          it('reset the allowance', async () =>{
            const allowance = await token.allowance(accounts[1],accounts[2]) 
            allowance.toString().should.equal('0') // checking if the amount of tokens are added to the allowance
        })
    
        //   Test for TransferF event with details of the sender , reciever and the amount of tokens send in transcation
          it('emits a transfer event', async () =>{
              const logs = result.logs[0]  // We get logs array in return when function called. We are extracting that logs
              logs.event.should.equal('Transfer')  // Comparing that right event is triggered
              const event = logs.args    // args is array which contain details about the transcation happened
              event.from.toString().should.equal(accounts[1], 'Sender is correct')
              event.to.toString().should.equal(accounts[2], 'reciever is correct')
              event.value.toString().should.equal(amount.toString(), 'Value is correct')
          })

        })
        
        //All test cases when token failed to transfer
        describe('Failure in token transfer', async () =>{
            it('rejects insufficient balance and cant send more than approved tokens',async()=>{
                let invalidAmount
                //Attempting to send tokens more then user have
                invalidAmount = tokens(1000000000) // 100 million - IT is greator then total supply or sender's or deployer's account
                await token.transferFrom(accounts[1],accounts[2],invalidAmount, {from: accounts[0]}).should.be.rejectedWith(EVM_REVERT)
               
            })
           
            it('Sending token to invalid account', async() =>{
                await token.transferFrom(accounts[1],0x0, {from: accounts[0]}).should.be.rejected
            })
        })
    })
})