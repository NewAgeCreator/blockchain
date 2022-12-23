var express = require('express');
var bodyParser = require('body-parser');
const uuid = require('uuid');
const axios = require('axios');

 
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const Blockchain = require('./blockchain');
var bitcoin = new Blockchain();

app.get('/' , (req, res) => {
    res.send("Hello Blockchain")
})

app.get('/blockchain' , (req, res) => {
    console.log(bitcoin);
    res.send(bitcoin);
})

app.get('/mine' , (req, res) => {

    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = { 
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    }
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData)
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce)
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash,    blockHash); 

    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOption = {
            url: networkNodeUrl + '/receive-new-block',
            method: "POST",
            data: {newBlock: newBlock}
        };
        requestPromises.push(axios(requestOption));
    });
    
    var nodeAddress = uuid.v1().split('-').join(''); 
    Promise.all(requestPromises).then(() => {
        const requestOption = {
            url: bitcoin.currentNodeUrl + '/transaction/broadcast',
            method: "POST",
            data: {
                amount: 12.5,
                sender: "00",
                recipient: nodeAddress
            }
        }
        return axios(requestOption)
    })
    .then(() => {
		res.json({
			note: "New block mined & broadcast successfully",
			block: newBlock
		});
	});

});

app.post('/receive-new-block', function(req, res) {
    const newBlock = req.body.newBlock;
    const lastBlock = bitcoin.getLastBlock();

    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];
    if(correctHash && correctIndex){
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];
        res.json({
            note: "New block received and accepted",
            newBlock: newBlock
        })
    } else {
        res.json({
            note: "New block rejected.",
            newBlock: newBlock
        });
    }
    
});

app.post('/transaction/broadcast', function(req, res){
    const newTransaction = bitcoin.createNewTransaction(
        req.body.amount, req.body.sender, req.body.recipient);

        bitcoin.addTransactionToPendingTransactions(newTransaction);
        const requestPromises = [];
        bitcoin.networkNodes.forEach(networkNodeUrl => {
            const requestOption = {
                url: networkNodeUrl + '/transaction',
                method: "POST",
                data: newTransaction
            }
        requestPromises.push(axios(requestOption));
        })
        Promise.all(requestPromises).then(data => {
            res.json({note: "Transaction created and broadcast successfully."});
        })
        
})

app.post('/transaction', function(req, res) {
   const newTransaction = req.body;
   const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction)
    res.json({note: `Transaction will be added in block : ${blockIndex}`})
});

app.post('/register-and-broadcast-node' , (req, res) => {
    const newNodeUrl = req.body.newNodeUrl;
    
    if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1)
        bitcoin.networkNodes.push(newNodeUrl);

    console.log("BITCOIN NETWORK NODEs : ", bitcoin.networkNodes)
    var networkNodePromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const config = {
            method: "POST",
            url: networkNodeUrl + '/register-node',
            data: {newNodeUrl : newNodeUrl}
        }
        networkNodePromises.push(axios(config)); 
    });

    Promise.all(networkNodePromises)
        .then(r1 => { 
            
            const bulkRegisterOptions = {
                method: "POST",
                url: newNodeUrl + '/register-nodes-bulk',
                data: {allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]}
            }
            axios(bulkRegisterOptions)
                .then((r2) => {
                    res.json({note: "New Node registered with network successfully"})
                });
        })
        .catch(err => {
            console.log("ERROR : " , err)
        });
});

app.post('/register-node' , (req, res) => {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;

    if(nodeNotAlreadyPresent && notCurrentNode) 
        bitcoin.networkNodes.push(newNodeUrl);

    res.json({note: "New node registered successfully"})

});

app.post('/register-nodes-bulk' , (req, res) => {
    const allNetworkNodes = req.body.allNetworkNodes;
    console.log(req)
    allNetworkNodes.forEach(networkNodeUrl => {
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        if(nodeNotAlreadyPresent && notCurrentNode)
            bitcoin.networkNodes.push(networkNodeUrl);
    });
    res.json({note: "Bulk registration successful"})
});

app.get('/consensus',(req, res) => {
    var promiseArray = [];
    bitcoin.networkNodes.forEach(networdNodeUrl => {
        promiseArray.push(axios(networdNodeUrl + '/blockchain'));
    });
    Promise.all(promiseArray)
        .then(blockchains => {
            const currentChainLength = bitcoin.chain.length;
            let maxChainLength = currentChainLength;
            let newLongestChain = null;
            let newPendingTransactions = null;
    
            blockchains.forEach(blockchain => {
                if(blockchain.data.chain.length > maxChainLength){
                    maxChainLength = blockchain.data.chain.length;
                    newLongestChain = blockchain.data.chain;
                    newPendingTransactions = blockchain.data.pendingTransactions;
                }                
            });

            if(!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))){
                res.json({
                    note: 'Current chain has not been replaced',
                    chain: bitcoin.chain
                })
            } else {
                bitcoin.chain = newLongestChain;
                bitcoin.pendingTransactions = newPendingTransactions;
                res.json({
                    note: 'This chain has been replaced',
                    chain: bitcoin.chain
                })
            }
        })

});

const port = process.argv[2];
app.listen(port , () => {
    console.log(`Blockchain network on PORT : ${port}...`);
});


//=======Block explorer API 

app.get('/block/:blockhash' , (req, res) => {
    const blockHash = req.params.blockhash;
    const correctBlock = bitcoin.getBlock(blockHash);
    res.json({
        block: correctBlock
    })
});

app.get('/transaction/:transactionId' , (req, res) => {
    const transactionId = req.params.transactionId;
    const transactionData = bitcoin.getTransaction(transactionId);
    res.json({
        transaction: transactionData.transaction,
        block: transactionData.block
    })
});

app.get('/address/:address' , (req, res) => {
    const address = req.params.address;
    const addressData = bitcoin.getAddressData(address);
    res.json({
        addressData: addressData
    })
});

