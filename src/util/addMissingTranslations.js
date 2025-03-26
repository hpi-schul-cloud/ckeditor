import { add } from "@ckeditor/ckeditor5-utils/src/translation-service.js";
import de from "../locales/de.js";
import en from "../locales/en.js";
import es from "../locales/es.js";
import uk from "../locales/uk.js";

const translations = { de, en, es, uk };
const supportedLanguages = Object.keys(translations);

const addMissingTranslations = () => {
	supportedLanguages.forEach((language) => {
		add(language, translations[language]);
	});
};

export { addMissingTranslations };
