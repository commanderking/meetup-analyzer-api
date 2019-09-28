import { createMuiTheme } from "@material-ui/core/styles";

const getMuiTheme = () =>
  createMuiTheme({
    overrides: {
      MuiToolbar: {
        root: {
          textAlign: "left"
        }
      }
    }
  });

export default getMuiTheme;
