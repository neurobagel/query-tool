import { Stack, Snackbar } from "@mui/material";
import { useSnackStack } from "./SnackStackProvider";
import SnackbarToast from "./SnackToast";

function SnackStack() {
  const { toastsPack } = useSnackStack();

  const firstToast = toastsPack[0];

  return (
    <Snackbar
      open={!!firstToast}
      autoHideDuration={null}
      transitionDuration={0}
      anchorOrigin={{
        vertical: firstToast?.position?.vertical || "top",
        horizontal: firstToast?.position?.horizontal || "right"
      }}
      sx={{
        mt: "env(safe-area-inset-top)",
        mb: "env(safe-area-inset-bottom)"
      }}
    >
      <Stack flexDirection="column" gap={1}>
        {toastsPack.map((toast) => (
          <SnackbarToast key={toast.key} toast={toast} />
        ))}
      </Stack>
    </Snackbar>
  );
};

export default SnackStack;
