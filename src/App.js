import './App.css';
import AppRouter from './navigation/AppRouter';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRouter />
        <ToastContainer />
      </PersistGate>
    </Provider>
  );
}

export default App;
