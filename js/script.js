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

    console.log(`https://gangbang-criapi.herokuapp.com/wallets/delete/${address}`);
    fetch(`https://gangbang-criapi.herokuapp.com/wallets/delete/${address}`, { method: 'DELETE'})
    .then(function (response) {
        return response;  
    })
    .then(() => {
        location.reload();
    });
}

function downloadWallet() {
    let address = this.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].nodeValue;

    fetch(`https://gangbang-criapi.herokuapp.com/wallets/download/${address}`, { method: 'GET' })
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
        if (msgContainer.innerHTML === '') {
            msgContainer.appendChild(document.createTextNode('Text copied! '));            
        }
        
        console.log('Async: Copying to clipboard was successful!');
        showCopyMessageBound();
        currentListItem.addEventListener('mouseleave', hideCopyMessageBound, false);
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

fetch('https://gangbang-criapi.herokuapp.com/wallets')
.then(response => {
    return response.json();
})
.then(jsonResponse => {
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
        const listItemTemplate = 
        `<li class="list-wallets__item">
          <div class="wallets__icon">
            <img src="img/icons/cryptocurrencies/${coinTypes[i]}.svg" alt="">
          </div>
          <div class="list-wallets__text">
            <span class="list-wallets__address" onclick="event.stopPropagation();">
              ${addresses[i]}
              <img class="copy-img" src="img/icons/content_copy_black_24dp.svg" width="24px" alt="">
            </span>
            <small class="list-wallets__seed" onclick="event.stopPropagation();">${seeds[i]}</small>
          </div>
          <div class="wallets__controls" onclick="event.stopPropagation();">
            <div class="wallets__download-btn">
              <img src="img/icons/file_download_black_24dp.svg" alt="">
            </div>
            <div class="wallets__delete-btn">
              <img src="img/icons/delete_black_24dp.svg" alt="">
            </div>
          </div>
        </li>`

        let listNode = new DOMParser().parseFromString(listItemTemplate, 'text/html').body.firstChild;
        list.appendChild(listNode);  
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
