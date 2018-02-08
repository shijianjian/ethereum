const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile')

let accounts;
let inbox;

const INIT_STRING = 'Hi there!';
const FIN_STRING = 'Bye there!';

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts()

    // Use one of theose accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode, 
            arguments: [INIT_STRING]
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        });
    inbox.setProvider(provider);
});

describe('Inbox Test', () => {

    it('deploy a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INIT_STRING);
    });

    it('can change the message', async() => {
        await inbox.methods.setMessage(FIN_STRING)
            .send({
                from: accounts[0]
            });
        const message = await inbox.methods.message().call();
        assert.equal(message, FIN_STRING);
    });

});