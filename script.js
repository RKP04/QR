document.addEventListener('DOMContentLoaded', function() {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (document.getElementById('register')) {
        document.getElementById('register').addEventListener('click', function() {
            const name = document.getElementById('register-name').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value.trim();
            
            if (name === '' || email === '' || password === '') {
                alert('Please fill in all fields');
                return;
            }

            const existingUser = users.find(user => user.email === email);
            if (existingUser) {
                alert('Email already registered');
                return;
            }

            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful');
            window.location.href = 'login.html';
        });
    }

    if (document.getElementById('login')) {
        document.getElementById('login').addEventListener('click', function() {
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value.trim();

            const user = users.find(user => user.email === email && user.password === password);
            if (!user) {
                alert('Invalid email or password');
                return;
            }

            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'index.html';
        });
    }

    if (document.getElementById('generate')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Please log in first');
            window.location.href = 'login.html';
        }
    }
});

// Generate QR Code for text or URL
document.getElementById('generate').addEventListener('click', function() {
    const text = document.getElementById('text').value.trim();
    if (text === '') {
        alert('Please enter text or a URL');
        return;
    }
    const qrcodeContainer = document.getElementById('qrcode');
    qrcodeContainer.innerHTML = ''; // Clear previous QR code

    const qrcode = new QRCode(qrcodeContainer, text);

    // Add QR code to history
    qrcode._oDrawing._elImage.onload = function() {
        const imgSrc = qrcode._oDrawing._elImage.src;
        addToHistory(text, imgSrc);

        // Set download link
        const downloadBtn = document.getElementById('download');
        downloadBtn.href = imgSrc;
        downloadBtn.classList.remove('d-none');
    };
});

// Toggle History Section
document.getElementById('toggle-history').addEventListener('click', function() {
    const historyContainer = document.getElementById('history-container');
    if (historyContainer.classList.contains('d-none')) {
        historyContainer.classList.remove('d-none');
        this.textContent = 'Hide History';
    } else {
        historyContainer.classList.add('d-none');
        this.textContent = 'Show History';
    }
});

// Toggle Contact QR Section
document.getElementById('toggle-contact').addEventListener('click', function() {
    const contactContainer = document.getElementById('contact-container');
    if (contactContainer.classList.contains('d-none')) {
        contactContainer.classList.remove('d-none');
        this.textContent = 'Hide Contact QR Section';
    } else {
        contactContainer.classList.add('d-none');
        this.textContent = 'Show Contact QR Section';
    }
});

// Generate Contact QR Code
document.getElementById('generate-contact').addEventListener('click', function() {
    const name = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const address = document.getElementById('contact-address').value.trim();

    if (name === '' && phone === '' && email === '' && address === '') {
        alert('Please enter at least one contact detail');
        return;
    }

    const contactInfo = `MECARD:N:${name};TEL:${phone};EMAIL:${email};ADR:${address};;`;
    const contactQrcodeContainer = document.getElementById('contact-qrcode');
    contactQrcodeContainer.innerHTML = ''; // Clear previous QR code

    const contactQrcode = new QRCode(contactQrcodeContainer, contactInfo);

    // Set download link
    contactQrcode._oDrawing._elImage.onload = function() {
        const imgSrc = contactQrcode._oDrawing._elImage.src;
        const downloadContactBtn = document.getElementById('download-contact');
        downloadContactBtn.href = imgSrc;
        downloadContactBtn.classList.remove('d-none');
    };
});

// Toggle Plain Text QR Section
document.getElementById('toggle-plain-text').addEventListener('click', function() {
    const plainTextContainer = document.getElementById('plain-text-container');
    if (plainTextContainer.classList.contains('d-none')) {
        plainTextContainer.classList.remove('d-none');
        this.textContent = 'Hide Plain Text QR Section';
    } else {
        plainTextContainer.classList.add('d-none');
        this.textContent = 'Show Plain Text QR Section';
    }
});

// Generate Plain Text QR Code
document.getElementById('generate-plain-text').addEventListener('click', function() {
    const plainText = document.getElementById('plain-text-input').value.trim();
    if (plainText === '') {
        alert('Please enter some text');
        return;
    }
    const plainTextQrcodeContainer = document.getElementById('plain-text-qrcode');
    plainTextQrcodeContainer.innerHTML = ''; // Clear previous QR code

    const plainTextQrcode = new QRCode(plainTextQrcodeContainer, plainText);

    // Set download link
    plainTextQrcode._oDrawing._elImage.onload = function() {
        const imgSrc = plainTextQrcode._oDrawing._elImage.src;
        const downloadPlainTextBtn = document.getElementById('download-plain-text');
        downloadPlainTextBtn.href = imgSrc;
        downloadPlainTextBtn.classList.remove('d-none');
    };
});

function addToHistory(text, imgSrc) {
    const historyContainer = document.getElementById('history');
    const card = document.createElement('div');
    card.className = 'card m-2';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const qrImage = document.createElement('img');
    qrImage.src = imgSrc;
    qrImage.className = 'qr-image';

    const qrText = document.createElement('p');
    qrText.className = 'card-text';
    qrText.textContent = text;

    const downloadButton = document.createElement('a');
    downloadButton.href = imgSrc;
    downloadButton.download = 'qrcode.png';
    downloadButton.textContent = 'Download';
    downloadButton.className = 'btn btn-success btn-block';

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.className = 'btn btn-danger btn-block';
    removeButton.addEventListener('click', function() {
        card.remove();
    });

    cardBody.appendChild(qrImage);
    cardBody.appendChild(qrText);
    cardBody.appendChild(downloadButton);
    cardBody.appendChild(removeButton);

    card.appendChild(cardBody);
    historyContainer.appendChild(card);
}
