switch (response.status) {
    case 200:
      toastRef.current.show({
        severity: "success",
        summary: "Success",
        detail: response.data,
        life: 3000,
      });
      break;
    case 400:
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: response.data,
        life: 5000,
      });
      break;
    case 401:
      toastRef.current.show({
        severity: "info",
        summary: "Info",
        detail: "Unauthorized",
        life: 3000,
      });

      break;
    case 500:
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Server error",
        life: 5000,
      });
      break;

    default:
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Uncaught error",
        life: 3000,
      });
      break;
  }
