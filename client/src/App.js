import { createTheme, MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import React, { useEffect } from 'react';
import './App.css';
import Routes from './Routes';

const theme = createTheme({
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 768,
			lg: 1280,
			xl: 1920,
		},
	},
});

const App = () => {
	return (
		<Provider store={store}>
			<Router>
				<MuiThemeProvider theme={theme}>
					<div className='App'>
						<Routes />
					</div>
				</MuiThemeProvider >
			</Router>
		</Provider>
	);
}

export default App;
