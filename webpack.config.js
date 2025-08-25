"use strict";

/* eslint-env node */

const path = require("path");
const webpack = require("webpack");
const { bundler, styles } = require("@ckeditor/ckeditor5-dev-utils");
const { CKEditorTranslationsPlugin } = require( '@ckeditor/ckeditor5-dev-translations' );
const TerserWebpackPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	devtool: "source-map",
	performance: { hints: false },

	entry: path.resolve(__dirname, "src", "ckeditor.js"),

	output: {
		filename: "ckeditor.js",
		path: path.resolve(__dirname, "build"),
		library: {
			type: "module"
		},
    globalObject: 'this',
	},
	experiments: {
		outputModule: true,
	},

	optimization: {
		minimizer: [
			new TerserWebpackPlugin({
				sourceMap: true,
				terserOptions: {
					output: {
						// Preserve CKEditor 5 license comments.
						comments: /^!/,
					},
				},
				extractComments: false,
			}),
		],
	},

	plugins: [
		new CKEditorTranslationsPlugin({
			language: "de",
			additionalLanguages: ["en", "es", "uk"],
		}),
		new webpack.BannerPlugin({
			banner: bundler.getLicenseBanner(),
			raw: true,
		}),
		new MiniCssExtractPlugin({
			filename: "ckeditor.css",
		}),
	],

	module: {
		rules: [
			{
				test: /\.svg$/,
				use: ["raw-loader"],
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: styles.getPostCssConfig({
								themeImporter: {
									themePath: require.resolve("@ckeditor/ckeditor5-theme-lark"),
								},
								minify: true,
							}),
						},
					},
				],
			},
		],
	},
};
