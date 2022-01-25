import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Dialog, DialogTitle, DialogContent, TableContainer, ButtonGroup, Table, TableHead, TableRow, TableCell, TableBody, DialogActions, Button, Typography, Snackbar } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { grey, deepPurple, teal } from '@material-ui/core/colors';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import CloseIcon from '@material-ui/icons/Close';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';

// rgb(39,39,43)
const useStyles = makeStyles((theme) => ({
    cartPaper: {
        backgroundColor: 'rgb(39, 39, 43)',
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
    const [total, setTotal] = useState(0);

    useEffect(() => {
        let priceTotal;
        props.cartList.map(cart => {
            console.log('cartItem', cart.price);
            priceTotal = total + cart.price;
        })
        setTotal(priceTotal)
    }, []);

    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="customized-dialog-title" classes={{ paper: classes.cartPaper }}>
            {props.cartList.length === 0 ?
                <DialogContent style={{ padding: '20px' }}>
                    <CloseIcon style={{ position: 'absolute', right: 0, top: 0 }} fontSize='small' onClick={props.handleClose} />
                    <Typography variant='button' style={{ padding: '0 30px' }}>
                        This cart is empty!
                    </Typography>
                </DialogContent>
                :
                <>
                    <DialogTitle id="customized-dialog-title" onClose={props.handleClose} disableTypography style={{ backgroundColor: deepPurple[500], padding: '16px' }}>
                        <div style={{ display: 'flex', color: 'white' }}>
                            <ShoppingCartIcon fontSize='small' style={{ margin: 'auto 5px auto 0' }} />
                            My Shopping Cart
                            <CloseIcon style={{ marginLeft: 'auto' }} onClick={props.handleClose} />
                        </div>
                    </DialogTitle>
                    <DialogContent style={{ padding: '0' }}>
                        <TableContainer className={classes.container}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell key={column.id} style={{ color: grey[300], backgroundColor: 'rgb(39, 39, 43)', padding: '8px 14px' }}>
                                                <Typography variant='button' >{column.label}</Typography>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.cartList.map((item, index) => (
                                        <TableRow role="checkbox" tabIndex={-1} key={index}>
                                            <TableCell key={index} style={{ color: grey[300], borderBottomColor: 'transparent', padding: '8px 16px' }}>
                                                {item.title}
                                            </TableCell>
                                            <TableCell key={index} style={{ color: grey[300], borderBottomColor: 'transparent', padding: '8px 16px' }}>
                                                {item.price}
                                            </TableCell>
                                            <TableCell key={index} style={{ color: grey[300], borderBottomColor: 'transparent', padding: '8px 16px' }}>
                                                <ButtonGroup size="small" aria-label="small outlined button group">
                                                    <Button style={{ color: grey[100], background: teal[400], padding: 2, minWidth: 'fit-content' }} onClick={async () => { await props.handleAddToCart(item); props.fetchCartList(); }}>
                                                        <AddIcon fontSize='small' />
                                                    </Button>
                                                    <Button disabled style={{ color: grey[300], backgroundColor: teal[400], minWidth: 'fit-content', padding: '0 10px' }}>
                                                        {item.quantity}
                                                    </Button>
                                                    <Button style={{ color: grey[100], background: teal[400], padding: 2, minWidth: 'fit-content' }} onClick={async () => { await props.handleRemoveFromCart(item); props.fetchCartList(); }}>
                                                        <RemoveIcon fontSize='small' />
                                                    </Button>
                                                    {console.log('item', item)}
                                                </ButtonGroup>
                                            </TableCell>
                                            <TableCell key={index} style={{ color: grey[300], borderBottomColor: 'transparent' }}>
                                                {item.subtotal}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                </>
            }
            <Divider style={{ height: '2px', backgroundColor: '#444' }} />
            {props.cartList.length === 0 ?
                ''
                :
                <DialogActions style={{ padding: '5px 15px', justifyContent: 'space-between' }}>
                    <Typography variant='button' style={{ padding: '5px', color: grey[300] }}>Total: &#8377;{props.cartTotal}</Typography>
                    <Button autoFocus onClick={props.handleClose} style={{ color: grey[300] }}>
                        Checkout
                        <AddToPhotosIcon style={{ padding: '0 5px' }} />
                    </Button>
                </DialogActions>
            }
        </Dialog >
    )
}

export default Cart;