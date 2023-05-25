import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

function ConfirmBox({
  open,
  closeDialog,
  title,
  deleteFunction,
  littleTitle
}: {
  open: any;
  closeDialog: any;
  title?: any;
  deleteFunction: any;
  littleTitle?: any;
}) {
  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth="xs"
      scroll="body"
      onClose={closeDialog}
    >
      <DialogContent sx={{ px: 2, py: 2, position: "relative" }}>
        <div className="delete-popup-close">
          <Typography variant="h5">Delete {title}</Typography>
          <IconButton
            className="cross-button"
            size="medium"
            onClick={closeDialog}
            sx={{}}
          >
            X
          </IconButton>
        </div>

        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
              }}
            >
              <Typography variant="body1">
                Are you sure want to delete {littleTitle ? `"${littleTitle}"`:''} from the records.?
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            <Button
              onClick={closeDialog}
              size="small"
              style={{ color: "#F44336" }}
            >
              Cancel
            </Button>
            <Button
              onClick={deleteFunction}
              size="small"
              style={{ color: "#66BB6A" }}
            >
              OK
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmBox;
