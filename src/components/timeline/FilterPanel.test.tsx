import { Children, isValidElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { DecadeFilterButtons } from "./FilterPanel";

describe("DecadeFilterButtons", () => {
	it("renders Hebrew labels and retains numeric decade filter keys", () => {
		const onDecadesChange = vi.fn();
		const props = {
			lang: "he" as const,
			selectedDecades: [1990],
			onDecadesChange,
		};
		const html = renderToStaticMarkup(<DecadeFilterButtons {...props} />);

		expect(html).toContain("שנות ה־90");
		expect(html).toContain("שנות ה־2000");
		expect(html).toContain("שנות ה־2010");
		expect(html).toContain("שנות ה־2020");
		expect(html).not.toContain("90s");
		expect(html).not.toContain("2000s");

		const buttons = Children.toArray(DecadeFilterButtons(props).props.children);
		const year2000Button = buttons.find(
			(button) =>
				isValidElement<{ children?: unknown }>(button) &&
				button.props.children === "שנות ה־2000",
		);
		if (!isValidElement<{ onClick: () => void }>(year2000Button)) {
			throw new Error("2000 decade button was not rendered");
		}
		year2000Button.props.onClick();
		expect(onDecadesChange).toHaveBeenCalledWith([1990, 2000]);
	});
});
