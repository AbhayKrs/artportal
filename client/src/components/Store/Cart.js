import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Dialog, DialogTitle, DialogContent, TableContainer, ButtonGroup, Table, TableHead, TableRow, TableCell, TableBody, DialogActions, Button, Typography } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { grey, deepPurple, teal } from '@material-ui/core/colors';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const useStyles = makeStyles((theme) => ({
    cartPaper: {
        position: 'absolute',
        bottom: '0',
        right: '0',
        margin: '15px'
    },
    container: {
        maxHeight: 500,
    },
}))

const columns = [
    { id: 'title', label: 'Title' },
    { id: 'price', label: 'Price' },
    { id: 'quantity', label: 'Quantity' },
    { id: 'subtotal', label: 'Subtotal' },
];

const Cart = (props) => {
    const classes = useStyles();

    // const handleAddToCart = (clickedItem) => {
    //     setcartList((prev) => {
    //         const isItemInCart = prev.find((item) => item.id === clickedItem.id);

    //         if (isItemInCart) {
    //             return prev.map((item) =>
    //                 item.id === clickedItem.id
    //                     ? { ...item, quantity: item.quantity + 1 }
    //                     : item
    //             );
    //         }

    //         return [...prev, { ...clickedItem, quantity: 1 }];
    //     });
    // };

    // const handleRemoveFromCart = (id) => {
    //     setcartList((prev) =>
    //         prev.reduce((acc, item) => {
    //             if (item.id === id) {
    //                 if (item.quantity === 1) return acc;
    //                 return [...acc, { ...item, quantity: item.quantity - 1 }];
    //             } else {
    //                 return [...acc, item];
    //             }
    //         }, [])
    //     );
    // };

    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="customized-dialog-title" classes={{ paper: classes.cartPaper }}>
            <DialogTitle id="customized-dialog-title" onClose={props.handleClose} disableTypography style={{ backgroundColor: deepPurple[900], padding: '16px' }}>
                <div style={{ display: 'flex', color: 'white' }}>
                    <ShoppingCartIcon fontSize='small' style={{ margin: 'auto 5px auto 0' }} />
                    My Shopping Cart
                </div>
            </DialogTitle>
            {props.cartList.length === 0 ?
                <DialogContent dividers style={{ padding: '20px 50px' }}>
                    <Typography variant='body2'>This cart is empty!</Typography>
                </DialogContent>
                :
                <DialogContent dividers style={{ padding: '0' }}>
                    <TableContainer className={classes.container}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell key={column.id} style={{ background: grey[200] }}>
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.cartList.map((item, index) => (
                                    <TableRow role="checkbox" tabIndex={-1} key={index}>
                                        <TableCell key={index} style={{ borderBottomColor: 'transparent' }}>
                                            {item.title}
                                        </TableCell>
                                        <TableCell key={index} style={{ borderBottomColor: 'transparent' }}>
                                            {item.price}
                                        </TableCell>
                                        <TableCell key={index} style={{ borderBottomColor: 'transparent' }}>
                                            <ButtonGroup size="small" aria-label="small outlined button group">
                                                <Button style={{ color: grey[100], background: teal[400] }} onClick={async () => { await props.handleAddToCart(item); props.fetchCartList(); }}>
                                                    <AddIcon fontSize='small' />
                                                </Button>
                                                <Button disabled style={{ color: 'black' }}>
                                                    {item.quantity}
                                                </Button>
                                                <Button style={{ color: grey[100], background: teal[400] }} onClick={async () => { await props.handleRemoveFromCart(item); props.fetchCartList(); }}>
                                                    <RemoveIcon fontSize='small' />
                                                </Button>
                                                {console.log('item', item)}
                                            </ButtonGroup>
                                        </TableCell>
                                        <TableCell key={index} style={{ borderBottomColor: 'transparent' }}>
                                            {item.subtotal}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            }
            {props.cartList.length === 0 ?
                ''
                :
                <DialogActions style={{ padding: '8px 15px', justifyContent: 'space-between' }}>
                    <Paper elevation={2} style={{ padding: '5px' }}>Total: 322</Paper>
                    <Button autoFocus onClick={props.handleClose} color="primary">
                        Checkout
                    </Button>
                </DialogActions>
            }
        </Dialog >
    )
}

export default Cart;