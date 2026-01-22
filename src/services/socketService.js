import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';

class SocketService {
    socket = null;

    connect() {
        if (this.socket) return;

        // Customer might not need an auth token for VIEWING only, 
        // or use a guest token. For now, we use a placeholder.
        this.socket = io(SOCKET_URL, {
            auth: { token: 'customer_token_placeholder' }
        });

        this.socket.on('connect', () => {
            console.log('Customer App Connected to Socket Server:', this.socket.id);
        });
    }

    joinOrderRoom(orderId) {
        if (!this.socket) return;
        this.socket.emit('join_room', { orderId });
    }

    /**
     * Listen for location updates
     * @param {Function} callback - Function to handle { lat, lng, heading }
     */
    onLocationUpdate(callback) {
        if (!this.socket) return;
        this.socket.on('location_changed', callback);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export default new SocketService();
