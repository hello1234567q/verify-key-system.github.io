// script.js

// Hàm kiểm tra trạng thái hoàn thành của các checkpoint
function checkCheckpointCompletion() {
    for (let i = 1; i <= 4; i++) {
        const checkpointCompleted = localStorage.getItem(`checkpoint${i}Completed`);
        if (checkpointCompleted !== 'true') { // Đảm bảo trạng thái là 'true'
            return false; // Nếu có checkpoint chưa hoàn thành, trả về false
        }
    }
    return true; // Tất cả các checkpoint đã hoàn thành
}

// Hàm lưu trạng thái checkpoint
function completeCheckpoint(checkpointNumber) {
    localStorage.setItem(`checkpoint${checkpointNumber}Completed`, 'true'); // Lưu trạng thái là 'true'
}

// Hàm bảo vệ chống bypass
function validateCheckpointCompletion(checkpointNumber) {
    // Thay vì chỉ lưu trạng thái đơn giản, bạn có thể dùng token hoặc mã xác thực
    const token = localStorage.getItem('completionToken');
    if (!token || !isValidToken(token, checkpointNumber)) {
        alert('Invalid completion attempt.');
        return false;
    }
    return true;
}

// Hàm tạo mã xác thực
function isValidToken(token, checkpointNumber) {
    // Kiểm tra mã xác thực với checkpointNumber
    // Đây là ví dụ đơn giản, bạn nên sử dụng phương pháp phức tạp hơn trong thực tế
    return token === `checkpoint-${checkpointNumber}`;
}

// Hiển thị thông báo hoàn thành checkpoint
function showCompletionMessage(checkpointNumber) {
    const messageDiv = document.getElementById('message');
    messageDiv.style.display = 'block';
    messageDiv.className = 'alert alert-success';
    messageDiv.textContent = `Checkpoint ${checkpointNumber} completed!`;
}

// Kiểm tra trạng thái khi người dùng cố gắng chuyển đến checkpoint tiếp theo
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname;

    if (currentPage.includes('checkpoint')) {
        const checkpointNumber = parseInt(currentPage.match(/\d+/)[0]);

        // Cập nhật mã kiểm tra checkpoint
        const prevCheckpointCompleted = checkpointNumber === 1 || localStorage.getItem(`checkpoint${checkpointNumber - 1}Completed`) === 'true';
        if (!prevCheckpointCompleted && checkpointNumber > 1) {
            // Hiển thị thông báo nếu checkpoint trước chưa được hoàn thành
            alert('You need to complete the previous checkpoint before proceeding.');
            window.location.href = `checkpoint${checkpointNumber - 1}.html`; // Chuyển hướng về checkpoint trước đó
        }

        // Thực hiện khi người dùng nhấp vào nút hoàn thành checkpoint
        const completeButton = document.getElementById(`completeCheckpoint${checkpointNumber}`);
        if (completeButton) {
            completeButton.addEventListener('click', () => {
                if (validateCheckpointCompletion(checkpointNumber)) {
                    completeCheckpoint(checkpointNumber); // Hoàn thành checkpoint hiện tại
                    showCompletionMessage(checkpointNumber); // Hiển thị thông báo hoàn thành
                }
            });
        }
    }

    // Hiển thị key nếu trên trang kết quả
    if (currentPage.includes('result.html')) {
        if (checkCheckpointCompletion()) {
            const key = generateKey();
            document.getElementById('key').textContent = key;
            setKeyExpiration(); // Thiết lập thời gian hết hạn cho key
        } else {
            document.getElementById('key').textContent = 'You must complete all checkpoints to receive the key.';
        }
    }
});

// Hàm tạo key ngẫu nhiên
function generateKey() {
    // Tạo một key ngẫu nhiên, có thể tùy chỉnh theo yêu cầu
    return 'KEY-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Hàm thiết lập thời gian hết hạn cho key (24 giờ)
function setKeyExpiration() {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24);
    localStorage.setItem('keyExpiration', expirationDate.toISOString());
}

// Hàm kiểm tra thời gian hết hạn của key
function checkKeyExpiration() {
    const expirationDate = new Date(localStorage.getItem('keyExpiration'));
    const now = new Date();
    if (now > expirationDate) {
        localStorage.removeItem('keyExpiration'); // Xóa key hết hạn
        return null; // Key đã hết hạn
    }
    return localStorage.getItem('generatedKey'); // Trả về key còn hiệu lực
}
