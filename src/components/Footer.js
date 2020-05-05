import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Link } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
}));

export default function Footer(props) {
    const classes = useStyles();

    return (
        <footer className={classes.footer}>
            <Typography variant="h6" align="center" gutterBottom>
                With <span role="img" aria-label="heart">❤️</span> from <Link color="inherit" href="https://xprilion.com">
                    xprilion
            </Link>
            </Typography>
            <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                <Link color="inherit" href="https://github.com/xprilion/fireshort">
                    Fork on GitHub
            </Link>
            </Typography>
        </footer>
    );
}