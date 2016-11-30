const app = app || {};

(function() {
    'use strict';

    class Notificator {
        showNotification(text, type) {
            if (type === 'success') {
                toastr.success(text);
            } else if (type === 'error') {
                toastr.error(text);
            }
        }
    }

    app.notificator = new Notificator();
}());