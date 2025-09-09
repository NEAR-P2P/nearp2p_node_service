const nearAPI = require('near-api-js');

async function functionStorageDeposit(req, res) {
    try {
        const account_id  = req.body.account_id;
        const walletName = process.env.WALLET; // replace with your wallet name
        const privateKey = process.env.PRIVATE_KEY; // replace with your actual private key
        const keyPair = nearAPI.utils.KeyPair.fromString(privateKey);
        const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
        await keyStore.setKey('mainnet', walletName, keyPair);
        const near = await nearAPI.connect({
            deps: { keyStore },
            networkId: 'mainnet',
            nodeUrl: 'https://free.rpc.fastnear.com',
            walletUrl: 'https://app.mynearwallet.com/',
        });

        const account = await near.account('andresdom.near');
        const contractId = 'usdt.tether-token.near';
        const methodName = 'storage_deposit';
        const args = { account_id };  // use the passed account_id
        const attachedDeposit = '1250000000000000000000'; // nearAPI.utils.format.parseNearAmount('1.25');  // 1.25 NEAR

        const result = await account.functionCall({
            contractId,
            methodName,
            args,
            gas: '100000000000000',
            attachedDeposit,
        });

        res.json(result.receipts_outcome);  // Send the result back as the response
    } catch (error) {
        // If there's an error, send it back as the response
        res.status(500).json({ error: error.toString() });
    }
}

module.exports = { functionStorageDeposit }
// functionStorageDeposit('maruja.near').then(console.log).catch(console.error);