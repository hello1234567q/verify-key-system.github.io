// script.js

// Hàm kiểm tra trạng thái hoàn thành của các checkpoint
function checkCheckpointCompletion() {
    for (let i = 1; i <= 4; i++) {
        const checkpointCompleted = localStorage.getItem(`checkpoint${i}Completed`);
        if (!checkpointCompleted) {
            return false; // Nếu có checkpoint chưa hoàn thành, trả về false
        }
    }
    return true; // Tất cả các checkpoint đã hoàn thành
}

// Hàm lưu trạng thái checkpoint
function completeCheckpoint(checkpointNumber) {
    localStorage.setItem(`checkpoint${checkpointNumber}Completed`, true);
}

// Kiểm tra trạng thái khi người dùng cố gắng chuyển đến checkpoint tiếp theo
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname;

    if (currentPage.includes('checkpoint')) {
        const checkpointNumber = parseInt(currentPage.match(/\d+/)[0]);
        const prevCheckpointCompleted = checkpointNumber === 1 || localStorage.getItem(`checkpoint${checkpointNumber - 1}Completed`);

        if (!prevCheckpointCompleted && checkpointNumber > 1) {
            // Hiển thị thông báo nếu checkpoint trước chưa được hoàn thành
            alert('You need to complete the previous checkpoint before proceeding.');
            window.location.href = `checkpoint${checkpointNumber - 1}.html`; // Chuyển hướng về checkpoint trước đó
        }

        // Thực hiện khi người dùng nhấp vào nút hoàn thành checkpoint
        const completeButton = document.getElementById(`completeCheckpoint${checkpointNumber}`);
        if (completeButton) {
            completeButton.addEventListener('click', () => {
                completeCheckpoint(checkpointNumber); // Hoàn thành checkpoint hiện tại
                alert(`Checkpoint ${checkpointNumber} completed!`);
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

