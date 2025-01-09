import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export function useSwal() {
  const router = useRouter();
  const { pathname } = router;

  const showToast = (options) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire(options);
  };

  const showAlert = (options, callback) => {
    Swal.fire(options).then(callback);
  };

  const showPostRedirectAlert = (options) => {
    sessionStorage.setItem('swalAlert', JSON.stringify(options));
    const checkRouteChange = setInterval(() => {
      if (window.location.pathname !== pathname) {
        const alertOptions = sessionStorage.getItem('swalAlert');
        if (alertOptions) {
          showAlert(JSON.parse(alertOptions));
          sessionStorage.removeItem('swalAlert');
          clearInterval(checkRouteChange);
        }
      }
    }, 100);
  };

  return {
    showToast,
    showAlert,
    showPostRedirectAlert
  };
}
