const myModal = new HystModal({
    linkAttributeName: 'data-hystmodal',
});

function updateSelect() {
    let selectElem = document.querySelector('.hystmodal__select-input');
    let selectImg = document.querySelector('.coin-icon');
    selectImg.src = `../img/icons/cryptocurrencies/${selectElem.options[selectElem.selectedIndex].value}.svg`    
}

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
    let address = this.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].nodeValue;

    console.log(`https://cribots.xyz/wallets/delete/${address}`);
    fetch(`https://cribots.xyz/wallets/delete/${address}`, { method: 'DELETE'})
    .then(function (response) {
        return response;  
    })
    .then(() => {
        location.reload();
    });
}

function downloadWallet() {
    let address = this.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].nodeValue;

    fetch(`https://cribots.xyz/wallets/download/${address}`, { method: 'GET' })
    .then(res => res.blob())
    .then(blob => {
        let file = window.URL.createObjectURL(blob);
        window.location.assign(file);
    });    

    console.log(`File "${address}" is downloading!`); 
}

function showCopyMessage() {
    let msg = this.parentNode.querySelector('.copy-text-msg');
    msg.classList.add('copy-text-msg_show');
}

function hideCopyMessage() {
    let msg = this.parentNode.querySelector('.copy-text-msg');
    msg.classList.remove('copy-text-msg_show');
}

function copyText() {
    let text = this.parentNode.childNodes[0].nodeValue;
    let currentListItem = this.parentNode.parentNode.parentNode;
    let msgContainer = currentListItem.querySelector('.copy-text-msg');

    const showCopyMessageBound = showCopyMessage.bind(this);
    const hideCopyMessageBound = hideCopyMessage.bind(this);

    navigator.clipboard.writeText(text).then(function() {    
        msgContainer.appendChild(document.createTextNode('Text copied!'));
        console.log('Async: Copying to clipboard was successful!');
        showCopyMessageBound();
        currentListItem.addEventListener('mouseleave', hideCopyMessageBound, false);
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

fetch('https://cribots.xyz/wallets')
.then(function(response) {
    return response.json();
})
.then(function(jsonResponse) {
    let list = document.querySelector('.list-wallets');    
    let addresses = [];
    let seeds = [];
    let coinTypes = [];

    for (let i = 0; i < jsonResponse.length; i++) {
        addresses.push(jsonResponse[i].address);
        seeds.push(jsonResponse[i].seed);
        coinTypes.push(jsonResponse[i].coin);
    }

    for (let i = 0; i < jsonResponse.length; i++) {
        let item = document.createElement('li');
        let itemText = document.createElement('div');
        let copyImg = document.createElement('img');
        let seedSmall = document.createElement('small');
        let address = document.createElement('span');
        let controlsBlock = document.createElement('div');
        let downloadBtn = document.createElement('div');
        let deleteBtn = document.createElement('div');
        let downloadBtnImg = document.createElement('img');
        let deleteBtnImg = document.createElement('img');
        let coinTypeContainer = document.createElement('div');
        let coinTypeImg = document.createElement('img');
        let msgContainer = document.createElement('div');

        copyImg.src = '../img/icons/content_copy_black_24dp.svg';
        downloadBtnImg.src = '../img/icons/file_download_black_24dp.svg';
        deleteBtnImg.src = '../img/icons/delete_black_24dp.svg';
        coinTypeImg.src = `../img/icons/cryptocurrencies/${coinTypes[i]}.svg`
        
        item.className = 'list-wallets__item';

        seedSmall.className = 'list-wallets__seed';
        controlsBlock.className = 'wallets__controls';
        downloadBtn.className = 'wallets__download-btn';
        deleteBtn.className = 'wallets__delete-btn';
        copyImg.className = 'copy-img';

        coinTypeContainer.className = 'wallets__icon';
        itemText.className = 'list-wallets__text';    
        address.className = 'list-wallets__address';
        msgContainer.classList = 'copy-text-msg';

        address.setAttribute('onclick', 'event.stopPropagation();');
        seedSmall.setAttribute('onclick', 'event.stopPropagation();');
        controlsBlock.setAttribute('onclick', 'event.stopPropagation();');

        address.appendChild(document.createTextNode(addresses[i]));
        address.appendChild(copyImg);
        address.appendChild(msgContainer);
        seedSmall.appendChild(document.createTextNode(seeds[i]));
        coinTypeContainer.appendChild(coinTypeImg);

        itemText.appendChild(address);
        itemText.appendChild(seedSmall);

        downloadBtn.appendChild(downloadBtnImg);
        deleteBtn.appendChild(deleteBtnImg);

        controlsBlock.appendChild(downloadBtn);
        controlsBlock.appendChild(deleteBtn);
            
        item.appendChild(coinTypeContainer);
        item.appendChild(itemText);
        item.appendChild(controlsBlock);

        list.appendChild(item);        
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
