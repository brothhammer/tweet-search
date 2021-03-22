import React 							from 'react'
import PropTypes 					from 'prop-types'
import {
	Button,
	makeStyles
} 												from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(1),
		borderRadius: 12,
		background: '#bbdefb',
		color: '#2196f3',
	},
}));

const HashTag = ({ hashTag, ...props }) => {
	const classes = useStyles();

	return (
		<Button
			variant="contained"
			size="small"
			className={classes.button}
			{...props}
		>
			#{hashTag}
		</Button>
	)
};

HashTag.propTypes = {
	hashTag: PropTypes.string.isRequired,
};

export default HashTag;
