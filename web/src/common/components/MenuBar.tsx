import React, { useContext, MouseEvent } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { FirebaseContext } from "auth/FirebaseContext";
import { withRouter, RouteComponentProps } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  })
);

const MenuBar = (props: RouteComponentProps) => {
  const classes = useStyles();

  const { user, firebase } = useContext(FirebaseContext);
  const handleLogout = async (event: MouseEvent) => {
    if (firebase) {
      event.preventDefault();

      // @ts-ignore - firebase can be null even with null check above?
      await firebase.signOut();
      props.history.push("/base/login");
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Meetup Analyzer
          </Typography>
          {user ? (
            <Button onClick={handleLogout}> Sign out</Button>
          ) : (
            <React.Fragment>
              <Button component={Link} to={"/base/signup"} color="inherit">
                Sign Up
              </Button>
              <Button component={Link} to={"/base/login"} color="inherit">
                Login
              </Button>
            </React.Fragment>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(MenuBar);
