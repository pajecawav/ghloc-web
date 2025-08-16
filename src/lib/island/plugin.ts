import _generate from "@babel/generator";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
import {
	callExpression,
	exportDefaultDeclaration,
	functionExpression,
	identifier,
	memberExpression,
	objectExpression,
	objectProperty,
	stringLiteral,
	variableDeclaration,
	variableDeclarator,
} from "@babel/types";
import path from "path";
import { createUnplugin } from "unplugin";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const generate = (_generate.default as typeof _generate) ?? _generate;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const traverse = (_traverse.default as typeof _traverse) ?? _traverse;

export const islands = createUnplugin(() => {
	return {
		name: "ghloc-islands",
		enforce: "pre",
		transform(code, id) {
			if (!/\.island(\.lazy)?\.tsx?$/.test(id)) {
				return;
			}

			const src = path.posix.relative(process.cwd(), id);

			const ast = parse(code, {
				sourceType: "module",
				plugins: ["typescript", "jsx"],
			});

			traverse(ast, {
				ExportDefaultDeclaration(path) {
					const declarationType = path.node.declaration.type;

					if (
						!(
							declarationType === "FunctionDeclaration" ||
							declarationType === "FunctionExpression" ||
							declarationType === "ArrowFunctionExpression"
						)
					) {
						return;
					}

					const originalFunction =
						path.node.declaration.type === "FunctionExpression" ||
						path.node.declaration.type === "ArrowFunctionExpression"
							? path.node.declaration
							: functionExpression(
									null,
									path.node.declaration.params,
									path.node.declaration.body,
									undefined,
									path.node.declaration.async,
								);

					const islandIdentifier = identifier("__ISLAND__");

					path.insertBefore(
						variableDeclaration("const", [
							variableDeclarator(islandIdentifier, originalFunction),
						]),
					);

					path.replaceWith(
						exportDefaultDeclaration(
							callExpression(
								memberExpression(identifier("Object"), identifier("assign")),
								[
									islandIdentifier,
									objectExpression([
										objectProperty(identifier("src"), stringLiteral(src)),
									]),
								],
							),
						),
					);
				},
			});

			const result = generate(ast);

			return { code: result.code, map: null };
		},
	};
});
