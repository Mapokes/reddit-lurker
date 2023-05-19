const ErrorFallback = ({ error }) => {
	console.log(error);

	return (
		<div role="alert">
			<p>Something went wrong:</p>
			<pre style={{ color: "red" }}>{error.message}</pre>
		</div>
	);
};
export default ErrorFallback;
