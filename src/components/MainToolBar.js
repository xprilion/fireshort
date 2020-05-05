import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, ButtonGroup, Card, Container } from '@material-ui/core';
import { ViewModule as ViewModuleIcon, ViewList as ViewListIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    toolBarRoot: {
        padding: theme.spacing(1),
        marginTop: theme.spacing(10),
    },
    button: {
        margin: theme.spacing(1),
    },
}));

export default function MainToolBar(props) {
    const classes = useStyles();

    return (
        <Container maxWidth="md">
            <Card className={classes.toolBarRoot}>
                <ButtonGroup variant="outlined" color="default" style={{boxShadow: "unset !important", justifyContent: "flex-end", display: "flex"}}>
                    <Button onClick={() => props.updateViewMode("module")} disabled = { props.state.viewMode === "module" }>
                        <ViewModuleIcon />
                    </Button>
                    <Button onClick={() => props.updateViewMode("list")}  disabled = { props.state.viewMode === "list" }>
                        <ViewListIcon />
                    </Button>
                </ButtonGroup>
            </Card>
        </Container>
    );
}