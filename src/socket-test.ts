import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  extraHeaders: {
    'x-tenant-id': 'e5349b53-ba71-4151-93df-82bdda3f39eb',
  },
});

socket.on('connect', () => {
  console.log('✅ Connected to WebSocket');
});

socket.on('orderUpdate', (data) => {
  console.log('📦 New Order Update:', data);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected');
});
