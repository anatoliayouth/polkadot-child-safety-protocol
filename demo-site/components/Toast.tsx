import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ToastProps = {
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
};

const Toast: React.FC<ToastProps> = ({ position = 'top-right' }) => {
  return (
    <ToastContainer
      position={position}
      newestOnTop
      pauseOnFocusLoss={false}
      hideProgressBar={false}
      closeOnClick
      draggable
      theme="dark"
      toastClassName={() =>
        'relative flex p-4 min-h-10 rounded-xl justify-between overflow-hidden cursor-pointer bg-polkadotIndigo shadow-lg'
      }
      bodyClassName={() => 'text-sm font-medium text-white'}
      progressClassName={() => 'bg-polkadotPink'}
    />
  );
};

export default Toast;
