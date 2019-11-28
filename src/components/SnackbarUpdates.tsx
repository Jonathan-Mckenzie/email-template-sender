import * as React from 'react';
import { SyntheticEvent } from "react";
import { Button, Snackbar, SnackbarContent } from "@material-ui/core";
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles, Theme } from '@material-ui/core/styles';


type IProps = {
	variant: any;
	message: string;
	handleClose: () => void;
	handleRetry?: () => void;
};

const variantIcon = {
	success: CheckCircleIcon,
	warning: WarningIcon,
	error: ErrorIcon,
	info: InfoIcon,
};

type IVariantIcon = keyof typeof variantIcon;

const useStyles1 = makeStyles((theme: Theme) => ({
	success: {
		backgroundColor: green[600],
	},
	error: {
		backgroundColor: theme.palette.error.dark,
	},
	info: {
		backgroundColor: theme.palette.primary.main,
	},
	warning: {
		backgroundColor: amber[700],
	},
	icon: {
		fontSize: 20,
	},
	iconVariant: {
		opacity: 0.9,
		marginRight: theme.spacing(1),
	},
	message: {
		display: 'flex',
		alignItems: 'center',
	},
}));

interface ContentWrapperProps {
	className?: string;
	message?: string;
	onClose?: () => void;
	variant: IVariantIcon;
	handleRetry?: () => void;
}

function MySnackbarContentWrapper(props: ContentWrapperProps) {
	const classes = useStyles1();
	const { className, message, onClose, variant, handleRetry, ...other } = props;
	const Icon = variantIcon[variant];

	const actions = [];

	if (handleRetry) {
		actions.push(
			<Button key="retry"
					variant="contained"
					color="primary"
					href=""
					onClick={handleRetry}>
				Retry
			</Button>
		);
	}
	actions.push(
		<IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
			<CloseIcon className={classes.icon} />
		</IconButton>
	);

	return (
		<SnackbarContent
			className={clsx(classes[variant], className)}
			aria-describedby="client-snackbar"
			message={
				<span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
					{message}
        </span>
			}
			action={actions}
			{...other}
		/>
	);
}

const SnackbarUpdates = (props: IProps) => {

	const handleClose = (event?: SyntheticEvent, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		props.handleClose();
	};

	const variant: IVariantIcon = props.variant;
	const autoHideDuration = (props.variant !== 'success') ? null : 5000;

	return (
		<Snackbar
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			open={true}
			autoHideDuration={autoHideDuration}
			onClose={handleClose}
		>
			<MySnackbarContentWrapper
				onClose={handleClose}
				variant={variant}
				message={props.message}
				handleRetry={props.handleRetry}
			/>
		</Snackbar>
	);
};

export default SnackbarUpdates;

