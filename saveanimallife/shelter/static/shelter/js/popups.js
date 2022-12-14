// Author: Ivan Tsiareshkin, xtsiar00

var popupLinks = document.querySelectorAll('.popup-link');
var body = document.querySelector('body');
var lockPadding = document.querySelectorAll('.lock-padding');

function update_values() {
    popupLinks = document.querySelectorAll('.popup-link');
    body = document.querySelector('body');
    lockPadding = document.querySelectorAll('.lock-padding');
    if (popupLinks.length > 0) {
        for (let index = 0; index < popupLinks.length; index++) {
            const popupLink = popupLinks[index];
            popupLink.addEventListener("click", function (e) {
                const popupName = popupLink.getAttribute('href');
                const currentPopup = document.getElementById(popupName);
                popupOpen(currentPopup);
                e.preventDefault();
            });
        }
    }
}

let unlock = true;
const timeout = 800;

if (popupLinks.length > 0) {
    for (let index = 0; index < popupLinks.length; index++) {
        const popupLink = popupLinks[index];
        popupLink.addEventListener("click", function (e) {
            const popupName = popupLink.getAttribute('href');
            const currentPopup = document.getElementById(popupName);
            popupOpen(currentPopup);
            e.preventDefault();
        });
    }
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
    for (let index = 0; index < popupCloseIcon.length; index++) {
        const el = popupCloseIcon[index];
        el.addEventListener('click', function(e) {
            popupClose(el.closest('.popup'));
            e.preventDefault();
        });
    }
}

function popupOpen(currentPopup) {
    if (currentPopup && unlock) {
        const popupActive = document.querySelector('.popup.open');
        if (popupActive) {
            popupClose(popupActive, false);
        } else {
            bodyLock();
        }
        currentPopup.classList.add('open');
        currentPopup.addEventListener("click", function (e) {
            if (!e.target.closest('.popup__content')) {
                popupClose(e.target.closest('.popup'));
            }
        });
    }
}

function popupClose(popupActive, doUnclock= true) {
    if (unlock) {
        popupActive.classList.remove('open');
        if (doUnclock) {
            bodyUnlock();
        }
    }
}

function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector('.table-page').offsetWidth + 'px';
    if (lockPadding.length > 0) {
        for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = lockPaddingValue;
        }
    }
    body.style.paddingRight = lockPaddingValue;
    body.classList.add('lock');

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

function bodyUnlock() {
    setTimeout(function () {
        for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = '0px';
        }
        body.style.paddingRight = "0px";
        body.classList.remove('lock');
    }, timeout);

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

// esc close
document.addEventListener('keydown', function (e) {
    if (e.which === 27) {
        const popupActive = document.querySelector('.popup.open');
        popupClose(popupActive);
    }
});

$("#animal_form").submit(function (e) {
    e.preventDefault();
    var frm = $('#animal_form');
    var formData = new FormData(frm[0]);
    let url_a = "/addanimal/";
    $.ajax({
        type: 'POST',
        url: url_a,
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            const popupActive = document.querySelector('.popup.open');
            popupClose(popupActive, true);
            window.alert("Animal added");
            let addr = window.location.toString();
            if (addr.indexOf('/animals/') != -1) {
                page_change(1);
            }
            document.getElementById("animal_form").reset();
        },
        error: function (xhr, errmsg, err) {
        }
    })
})

$(document).on('click', '#fav-btn', function (e) {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: 'favorite/',
        data: {
            animalid: $('#fav-btn').val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'animal'
        },
        success: function (response) {
            document.getElementById('fav-count').innerHTML = response['result']
            if (response['isliked'] === 1) {
                document.getElementById('fav-btn').classList.add("current");
            } else {
                document.getElementById('fav-btn').classList.remove("current");
            }
        },
        error: function (xhr, errmsg, err) {
        }
    });
});



