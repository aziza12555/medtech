import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

export default function admin({ childs }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {childs}
    </Box>
  );
}
