import { assert } from "chai"
require('chai')
        .use(require('chai-as-promised'))
        .should()

const Token = artifacts.require('./Token')

contract('Token', (account)=>{
    const name = 'Boogiereum Token'
    const symbol = 'BOOGIE'
    const decimals = '18'
    const totalSupply = '1000000000000000000000000'
    let token
    beforeEach(async()=>{
         //Fetch the deployed contract  for our test cases
          token = await Token.new()  
    })

    describe('deployment', async () => {
        //From here our test cases starts

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
            result.toString().should.equal(totalSupply) 
        })
    })
})