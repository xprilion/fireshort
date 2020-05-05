import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, ButtonGroup, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
import { FileCopyOutlined as FileCopyOutlinedIcon, Edit as EditIcon, Visibility as VisibilityIcon, DeleteForever as DeleteForeverIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
    label: {
        textTransform: 'initial',
    },
}));

export default function ListUrls(props) {
    const classes = useStyles();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Container className={classes.cardGrid} maxWidth="md">
            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell key="curl" align="left" style={{ minWidth: "100px" }}>
                                    Short URL
                                </TableCell>
                                <TableCell key="lurl" align="left" style={{ minWidth: "100px" }}>
                                    Long URL
                                </TableCell>
                                <TableCell key="action" align="right" style={{ minWidth: "100px" }}>
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.shortUrls.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((card) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={card.id}>
                                        <TableCell key="curl" align="left" style={{ minWidth: "100px" }}>
                                            <Button
                                                startIcon={
                                                    <FileCopyOutlinedIcon />
                                                }
                                                onClick={() => { navigator.clipboard.writeText(window.location.hostname + "/" + card.data.curl) }}
                                                classes={{
                                                    label: classes.label
                                                }}
                                                >{card.data.curl}</Button>
                                        </TableCell>
                                        <TableCell key="lurl" align="left" style={{ minWidth: "100px" }}>
                                            <Box bgcolor="text.primary" color="background.paper" p={2} style={{ overflowX: 'auto', overflowY: 'hidden', whiteSpace: "nowrap" }}>
                                                {card.data.lurl}
                                            </Box>
                                        </TableCell>
                                        <TableCell key="action" align="right" style={{ minWidth: "100px" }}>
                                            <ButtonGroup variant="outlined" color="default">
                                                <Button size="small" color="primary" href={card.data.lurl} target="_blank">
                                                    <VisibilityIcon />
                                                </Button>
                                                <Button size="small" onClick={() => props.handleEditShortUrl(card.data.curl)}>
                                                    <EditIcon />
                                                </Button>
                                                <Button size="small" color="secondary" onClick={() => props.handleDeleteShortUrl(card.data.curl)}>
                                                    <DeleteForeverIcon />
                                                </Button>
                                            </ButtonGroup>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={props.shortUrls.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </Container>
    );
}