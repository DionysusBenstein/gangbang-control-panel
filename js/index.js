const myModal = new HystModal({
    linkAttributeName: "data-hystmodal",
});

let fullPath = document.getElementById('wallet-file-picker').value;
console.log(fullPath);

if (fullPath) {
    let startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
    let filename = fullPath.substring(startIndex);

    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
        filename = filename.substring(1);
    }

    alert(filename);
}

fetch('https://gangbang-criapi.herokuapp.com/wallets')
.then(function(response) {
    return response.json();
})
.then(function(jsonResponse) {
    let list = document.querySelector('.list-wallets');    
    let transactionsArray = [];
    let balances = [];

    fetch(`https://infinite-badlands-71377.herokuapp.com/https://blockchain.info/multiaddr?active=${jsonResponse.join('|')}`, {
        method: 'GET',
    })
    .then(function(responseEx) {
        return responseEx.json();
    })
    .then(function(jsonResponseEx) {        
        for (let j = 0; j < jsonResponseEx.addresses.length; j++) {
            transactionsArray.push(jsonResponseEx.addresses[j].n_tx);  
            balances.push(jsonResponseEx.addresses[j].final_balance);
        }

        for (let i = 0; i < jsonResponse.length; i++) {
            let item = document.createElement('li');
            let address = document.createElement('span');
            let transactions = document.createElement('span');
            let balance = document.createElement('span');
    
            item.className = 'list-wallets__item';
    
            address.className = 'list-wallets__address';
            transactions.className = 'list-wallets__transactions';
            balance.className = 'list-wallets__balance';
    
            address.appendChild(document.createTextNode(jsonResponse[i]));
            transactions.appendChild(document.createTextNode(transactionsArray[i]));
            balance.appendChild(document.createTextNode(balances[i]));
    
            item.appendChild(address);
            item.appendChild(transactions);
            item.appendChild(balance);
    
            list.appendChild(item);
        }
    });
});


