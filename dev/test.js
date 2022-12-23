const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

const bc1 = {
    "chain": [
    {
        "index": 1,
        "timestamp": 1671585319027,
        "transactions": [],
        "nonce": 100,
        "hash": "0",
        "previousBlockHash": "0"
    },
    {
        "index": 2,
        "timestamp": 1671585413788,
        "transactions": [],
        "nonce": 18140,
        "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
        "previousBlockHash": "0"
    },
    {
        "index": 3,
        "timestamp": 1671585460593,
        "transactions": [
        {
        "amount": 12.5,
        "sender": "00",
        "recipent": "2782adc080cd11edab64ada01cc71944",
        "transactionId": "2785e21080cd11edab64ada01cc71944"
        },
        {
        "amount": 10,
        "sender": "stachu",
        "recipent": "artur",
        "transactionId": "3bbc98a080cd11edab64ada01cc71944"
        }
        ],
        "nonce": 5911,
        "hash": "0000ca33171da1408929d36ea5809b9074a6fd07fb30e85fd09c74b90fa4ccc7",
        "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    },
    {
    "index": 4,
    "timestamp": 1671585559372,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipent": "43688e1080cd11edab64ada01cc71944",
    "transactionId": "4369034080cd11edab64ada01cc71944"
    },
    {
    "amount": 100,
    "sender": "stachu inzynier",
    "recipent": "artur ziomal",
    "transactionId": "59fdf52080cd11edab64ada01cc71944"
    },
    {
    "amount": 2,
    "sender": "ga8dfg9adfhjgfadg93",
    "recipent": "fasdfu9a0sdf2ni",
    "transactionId": "6373fc3080cd11edab64ada01cc71944"
    }
    ],
    "nonce": 145445,
    "hash": "000086315c226a08e3fac8d6074f0d8b23c4a9f1e9ab26cfa5f424b2065534d8",
    "previousBlockHash": "0000ca33171da1408929d36ea5809b9074a6fd07fb30e85fd09c74b90fa4ccc7"
    },
    {
    "index": 5,
    "timestamp": 1671585560314,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipent": "7e4908c080cd11edab64ada01cc71944",
    "transactionId": "7e4956e080cd11edab64ada01cc71944"
    }
    ],
    "nonce": 5028,
    "hash": "00002212aa182276f6818d2ab79dd7c227ea0b9218e1b22360dd0df4558f39fb",
    "previousBlockHash": "000086315c226a08e3fac8d6074f0d8b23c4a9f1e9ab26cfa5f424b2065534d8"
    },
    {
    "index": 6,
    "timestamp": 1671585562358,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipent": "7ed8c5a080cd11edab64ada01cc71944",
    "transactionId": "7ed93ad080cd11edab64ada01cc71944"
    }
    ],
    "nonce": 4551,
    "hash": "00008ac840fc5c96911b9a2302324af098d028ab98a5188ebde930ff5374cfa6",
    "previousBlockHash": "00002212aa182276f6818d2ab79dd7c227ea0b9218e1b22360dd0df4558f39fb"
    },
    {
    "index": 7,
    "timestamp": 1671585566248,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipent": "8010a96080cd11edab64ada01cc71944",
    "transactionId": "801208f080cd11edab64ada01cc71944"
    }
    ],
    "nonce": 19747,
    "hash": "0000d7d9403e5592d08450b435ee0eca2c99826abfb680ad78da38a96a618101",
    "previousBlockHash": "00008ac840fc5c96911b9a2302324af098d028ab98a5188ebde930ff5374cfa6"
    }
    ],
    "pendingTransactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipent": "82623a8080cd11edab64ada01cc71944",
    "transactionId": "826324e080cd11edab64ada01cc71944"
    }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
    }

    console.log('VALID : ' , bitcoin.chainIsValid(bc1.chain))