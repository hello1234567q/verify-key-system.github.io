// result-script.js

document.addEventListener('DOMContentLoaded', function () {
    const keyDisplay = document.getElementById('keyDisplay');
    const errorDisplay = document.getElementById('errorDisplay');

    // URL của Pastebin hoặc URL chứa key
    const keyUrl = 'https://pastebin.com/raw/0f5DJcTz'; // Thay YOUR_PASTEBIN_ID bằng ID của bạn

    // Hàm lấy key từ URL
    function fetchKey() {
        fetch(keyUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.text();
            })
            .then(key => {
                // Lưu key vào localStorage với thời gian hết hạn 24 giờ
                const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 giờ
                localStorage.setItem('userKey', key);
                localStorage.setItem('keyExpiry', expiryTime);

                // Hiển thị key
                keyDisplay.textContent = `Your key: ${key}`;
                errorDisplay.style.display = 'none'; // Ẩn thông báo lỗi nếu kết nối thành công
            })
            .catch(error => {
                keyDisplay.textContent = 'Failed to fetch key.';
                errorDisplay.textContent = 'Unable to connect to the key source. Please check your VPN or network connection.';
                errorDisplay.style.display = 'block'; // Hiển thị thông báo lỗi
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    // Hàm kiểm tra xem key có hết hạn không
    function isKeyExpired() {
        const expiryTime = localStorage.getItem('keyExpiry');
        return expiryTime ? new Date().getTime() > expiryTime : true;
    }

    // Nếu key đã hết hạn hoặc không tồn tại, lấy key từ URL
    if (isKeyExpired()) {
        fetchKey();
    } else {
        // Hiển thị key từ localStorage nếu chưa hết hạn
        const storedKey = localStorage.getItem('userKey') || 'Your key is not available.';
        keyDisplay.textContent = storedKey;
    }
});
