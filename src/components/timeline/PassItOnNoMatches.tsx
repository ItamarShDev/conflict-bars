export function PassItOnNoMatches({
	message,
	clearLabel,
	onClear,
}: {
	message: string;
	clearLabel: string;
	onClear: () => void;
}) {
	return (
		<div className="pass-it-on-no-match" role="status">
			<p>{message}</p>
			<button type="button" onClick={onClear}>
				{clearLabel}
			</button>
		</div>
	);
}
