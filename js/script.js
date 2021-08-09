const myModal = new HystModal({
    linkAttributeName: "data-hystmodal",
});

let listItems = document.querySelectorAll('.list-wallets__item');
let copyIcons = document.querySelectorAll('.copy-img');

submitForms = function(){
    document.getElementById("json-data").submit();
    document.getElementById("file-data").submit();
}

function showHideSeed() {
    if (this.classList.contains('list-wallets__seed_active')) {
        this.classList.remove('list-wallets__seed_active');
    } else {
        this.classList.add('list-wallets__seed_active');
    }
}

function showCopyIcon() {
    if (this.querySelector('.copy-img') !== null) {        
        this.querySelector('.copy-img').style.opacity = '1';
    }
}

function hideCopyIcon() {
    if (this.querySelector('.copy-img') !== null) {   
        this.querySelector('.copy-img').style.opacity = '0';
    }
}

function copyText() {
    console.log(this.parentNode.innerText);
}

for (let i = 0; i < listItems.length; i++) {
    listItems[i].addEventListener('click', showHideSeed, false);
    listItems[i].addEventListener('mouseover', showCopyIcon, false);
    listItems[i].addEventListener('mouseleave', hideCopyIcon, false);
}

for (let i = 0; i < copyIcons.length; i++) {   
    // listItems[i].removeEventListener('click', showHideSeed, false);     
    copyIcons[i].addEventListener('click', copyText, false);
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
    
            // list.appendChild(item);
        }
    });
});


