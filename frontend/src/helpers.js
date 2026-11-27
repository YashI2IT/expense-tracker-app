import { Alert } from 'react-native';

// shows the error from the server, or a common message if the server is not reachable
export function showError(err) {
  const message =
    err.response && err.response.data.message
      ? err.response.data.message
      : 'Cannot reach the server. Is the backend running?';
  Alert.alert('Error', message);
}
