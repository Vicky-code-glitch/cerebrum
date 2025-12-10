// Show toast notification
export const showToast = (message, type = 'info') => {
    let backgroundColor = '#4361ee'; // Default blue
    
    switch (type) {
        case 'success':
            backgroundColor = '#4cc9f0';
            break;
        case 'error':
            backgroundColor = '#f72585';
            break;
        case 'warning':
            backgroundColor = '#f8961e';
            break;
        case 'info':
        default:
            backgroundColor = '#4361ee';
    }
    
    Toastify({
        text: message,
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: backgroundColor,
        stopOnFocus: true,
        className: 'toastify'
    }).showToast();
};