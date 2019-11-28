import * as React from "react";
import { RouteComponentProps } from "react-router";
import { EmailEditor } from "../components";
import { handlebarsVariableParser } from "../utilities/handlebarsVariableParser";

interface IProps extends RouteComponentProps<void> {}

const EmailTemplatePage = (props: IProps) => {
	return (
		<EmailEditor templateParser={handlebarsVariableParser}/>
	);
};


export default EmailTemplatePage;
