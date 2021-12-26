import { Paper, Typography, ListItemText } from '@material-ui/core'
import React from 'react'

const Privacy = () => {
    return (
        <div style={{ margin: '100px 25px' }}>
            <ListItemText
                primary={<Typography variant='h4' component='h5'>Artystian Privacy Policy</Typography>}
                secondary='Effective'
            />
            <Typography variant='body1'>
                We are committed to maintaining the security, confidentiality and privacy of your personal information. This document describes the general privacy policies of Artyst. Please note that this Privacy Policy applies to the following internet sites and related links:
                <ListItemText secondary='www.artytian.com' />
                If you have any questions about the practices described in this policy, please contact us using the details in the “Contact” section below.
            </Typography>
        </div >
    )
}

export default Privacy;
