const myModal = new HystModal({
    linkAttributeName: 'data-hystmodal',
});

function showHideSeed() {
    if (this.classList.contains('list-wallets__seed_active')) {
        this.classList.remove('list-wallets__seed_active');
    } else {
        this.classList.add('list-wallets__seed_active');
    }
}

function showCopyIcon() {
    let copyImg = this.querySelector('.copy-img');

    if (copyImg !== null) {
        copyImg.style.webkitTransition = 'opacity 0.1s';
        copyImg.style.opacity = '1';
    }
}

function hideCopyIcon() {
    let copyImg = this.querySelector('.copy-img');

    if (copyImg !== null) {
        copyImg.style.webkitTransition = 'opacity 0.1s'; 
        copyImg.style.opacity = '0';
    }
}

function deleteWallet() {
    let address = this.parentNode.parentNode.querySelector('.list-wallets__address').innerText;

    fetch(`https://gangbang-criapi.herokuapp.com/wallets/delete/${address}`, { method: 'DELETE'})
    .then(function (response) {
        return response;  
    })
    .then(() => {
        location.reload();
    });
}

function downloadWallet() {
    let address = this.parentNode.parentNode.querySelector('.list-wallets__address').innerText;

    fetch(`https://gangbang-criapi.herokuapp.com/wallets/download/${address}`, { method: 'GET' })
    .then(res => res.blob())
    .then(blob => {
        let file = window.URL.createObjectURL(blob);
        window.location.assign(file);
    });    

    console.log(`File "${address}" is downloading!`); 
}

function copyText() {
    console.log(this.parentNode.innerText);
}

fetch('https://gangbang-criapi.herokuapp.com/wallets')
.then(function(response) {
    return response.json();
})
.then(function(jsonResponse) {
    let list = document.querySelector('.list-wallets');    
    let addresses = [];
    let seeds = [];
    let transactionsArray = [];
    let balances = [];

    for (let i = 0; i < jsonResponse.length; i++) {
        addresses.push(jsonResponse[i].address);
    }

    fetch(`https://infinite-badlands-71377.herokuapp.com/https://blockchain.info/multiaddr?active=${addresses.join('|')}`, {
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

        for (let k = 0; k < jsonResponseEx.addresses.length; k++) {
            for (let j = 0; j < jsonResponse.length; j++) {jsonResponse
                if (jsonResponse[j].address === jsonResponseEx.addresses[k].address) {
                    seeds.push(jsonResponse[j].seed);
                }
            }
        }

        for (let i = 0; i < jsonResponse.length; i++) {
            let item = document.createElement('li');
            let itemText = document.createElement('div');
            let copyImg = document.createElement('img');
            let seedSmall = document.createElement('small');
            let address = document.createElement('span');
            let transactions = document.createElement('span');
            let balance = document.createElement('span');
            let controlsBlock = document.createElement('div');
            let downloadBtn = document.createElement('div');
            let deleteBtn = document.createElement('div');
            let downloadBtnImg = document.createElement('img');
            let deleteBtnImg = document.createElement('img');
    
            copyImg.src = '../img/icons/content_copy_black_24dp.svg';
            downloadBtnImg.src = '../img/icons/file_download_black_24dp.svg';
            deleteBtnImg.src = '../img/icons/delete_black_24dp.svg';
            
            item.className = 'list-wallets__item';

            seedSmall.className = 'list-wallets__seed';
            controlsBlock.className = 'wallets__controls';
            downloadBtn.className = 'wallets__download-btn';
            deleteBtn.className = 'wallets__delete-btn';
            copyImg.className = 'copy-img';

            itemText.className = 'list-wallets__text';    
            address.className = 'list-wallets__address';

            transactions.className = 'list-wallets__transactions';
            balance.className = 'list-wallets__balance';

            address.setAttribute('onclick', 'event.stopPropagation();');
            seedSmall.setAttribute('onclick', 'event.stopPropagation();');
            transactions.setAttribute('onclick', 'event.stopPropagation();');
            balance.setAttribute('onclick', 'event.stopPropagation();');
            controlsBlock.setAttribute('onclick', 'event.stopPropagation();');

            if (jsonResponseEx.addresses[i].address !== undefined) {
                address.appendChild(document.createTextNode(jsonResponseEx.addresses[i].address));
                address.appendChild(copyImg);
                seedSmall.appendChild(document.createTextNode(seeds[i]));
                transactions.appendChild(document.createTextNode(transactionsArray[i]));
                balance.appendChild(document.createTextNode(`${balances[i]} BTC`));

                itemText.appendChild(address);
                itemText.appendChild(seedSmall);

                downloadBtn.appendChild(downloadBtnImg);
                deleteBtn.appendChild(deleteBtnImg);

                controlsBlock.appendChild(downloadBtn);
                controlsBlock.appendChild(deleteBtn);
    
                item.appendChild(itemText);
                item.appendChild(transactions);
                item.appendChild(balance);
                item.appendChild(controlsBlock);
    
                list.appendChild(item);
            }
        }

        let listItems = document.querySelectorAll('.list-wallets__item');
        let copyIcons = document.querySelectorAll('.copy-img');
        let deleteBtns = document.querySelectorAll('.wallets__delete-btn');
        let downloadBtns = document.querySelectorAll('.wallets__download-btn');
        
        for (let i = 0; i < listItems.length; i++) {
            listItems[i].addEventListener('click', showHideSeed, false);
            listItems[i].addEventListener('mouseover', showCopyIcon, false);
            listItems[i].addEventListener('mouseleave', hideCopyIcon, false);
            deleteBtns[i].addEventListener('click', deleteWallet, false);
            downloadBtns[i].addEventListener('click', downloadWallet, false);
        }
        
        for (let i = 0; i < copyIcons.length; i++) {   
            copyIcons[i].addEventListener('click', copyText, false);
        }

    });
});

